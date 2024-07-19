import express, { Express, RequestHandler } from 'express';
import pointsRouter from './routes/points';
import dotenv from 'dotenv';
import path from 'path';
import { initDataManager } from './data/dataManager';
import { DATA_DIRECTORY } from './constants';

declare namespace Express {
  export interface Request {
    user?: string | jwt.JwtPayload | undefined;
  }
}

import jwt from 'jsonwebtoken';

const hostname = 'localhost';

const envFile = path.resolve(__dirname, process.env.NODE_ENV ? `../.env.${process.env.NODE_ENV}` : '.env');
dotenv.config({ path: envFile });

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

const generateAccessToken = (user: any): string => {
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15s' });
  return accessToken;
};

// Serve static assets
app.use(express.static(spaPath));
app.use(express.json());

let refreshTokens: string[] = [];

app.post('/login', (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string);
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter((t) => t !== req.body.token);
  res.sendStatus(204);
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

    const accessToken = generateAccessToken({ name: user.name });
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
