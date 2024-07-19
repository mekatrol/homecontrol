import express, { Express, RequestHandler } from 'express';
import pointsRouter from './routes/points';
import dotenv from 'dotenv';
import path from 'path';
import { initDataManager } from './data/dataManager';
import { DATA_DIRECTORY } from './constants';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

declare namespace Express {
  export interface Request {
    user?: string | jwt.JwtPayload | undefined;
  }
}

const hostname = 'localhost';

const envFile = path.resolve(__dirname, process.env.NODE_ENV ? `../.env.${process.env.NODE_ENV}` : '.env');
dotenv.config({ path: envFile });

interface User {
  username: string;
  password: string;
}

interface Jwt {
  accessToken: string;
  refreshToken: string;
}

const users: User[] = [];

const dataManager = initDataManager(process.env.DATA_DIRECTORY ?? DATA_DIRECTORY);
console.log(dataManager);

const port: number = +(process.env.PORT ?? 80);
const app: Express = express();

let spaRelativePath = '/spa';

if (process.env.NODE_ENV === 'development') {
  spaRelativePath = '/../server/spa';
}

const spaPath = path.resolve(__dirname + spaRelativePath);

export const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const request = req as Express.Request;
    request.user = user;
    next();
  });
};

const generateAccessToken = (user: User): string => {
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15s' });
  return accessToken;
};

const generateAccessAndRefreshTokens = (user: User): Jwt => {
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string);
  refreshTokens.push(refreshToken);
  return { accessToken: accessToken, refreshToken: refreshToken };
};

// Serve static assets
app.use(express.static(spaPath));
app.use(express.json());

let refreshTokens: string[] = [];

app.post('/login', (req, res) => {
  const username = req.body.username;
  const user = { username: username } as User;

  const jwt = generateAccessAndRefreshTokens(user);
  res.json(jwt);
});

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter((t) => t !== req.body.token);
  res.sendStatus(204);
});

app.post('/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { username: req.body.username, password: hashedPassword };
    users.push(user);
    return res.status(201).json(user);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

app.post('/users/login', async (req, res) => {
  try {
    const user = users.find((u) => u.username === req.body.username);

    if (!user) {
      return res.sendStatus(404);
    }

    const matched = await bcrypt.compare(req.body.password, user.password);

    if (!matched) {
      return res.sendStatus(401);
    }

    return res.status(200).json(generateAccessAndRefreshTokens(user));
  } catch (err: any) {
    return res.sendStatus(500);
  }
});

app.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.sendStatus(401);
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = generateAccessToken({ username: user.name } as User);
    res.json({ accessToken: accessToken });
  });
});

// Send SPA if not an API end point
app.get(/^\/(?!api).*/, function (_ /* request */, response) {
  response.sendFile(path.resolve(`${spaPath}/index.html`));
});

// All controllers after here need to have bearer token be authenticated
app.use(authenticateToken);

// Points controller
app.use(pointsRouter);

app.listen(port, '0.0.0.0', () => {
  console.log(`Home automation running at http://${hostname}:${port}/`);
});
