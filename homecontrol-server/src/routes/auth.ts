import express, { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDataManagerInstance } from '../data/dataManager';
import { User } from '../models/user';
import { Jwt } from '../models/Jwt';

const router = express.Router();
export default router;

declare namespace Express {
  export interface Request {
    user?: string;
  }
}

let refreshTokens: string[] = [];
const users: User[] = [];

export const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader && authHeader.split(' ');

  // Muse be 2 parts, the word bearer and the token
  if (!bearerToken || bearerToken.length != 2) {
    return res.sendStatus(401);
  }

  // First part must be the word bearer
  if (bearerToken[0].trim().toLowerCase() !== 'bearer') {
    return res.sendStatus(401);
  }

  // Second part is the token
  const token = bearerToken[1].trim();

  // Make sure token is valid
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    // Set request user
    const request = req as Express.Request;
    request.user = user?.toString();

    next();
  });
};

const generateAccessToken = (user: User): string => {
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: 300 });
  return accessToken;
};

const generateAccessAndRefreshTokens = (user: User): Jwt => {
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string);
  refreshTokens.push(refreshToken);
  return { accessToken: accessToken, refreshToken: refreshToken };
};

router.post('/api/auth/login', (req, res) => {
  const username = req.body.username;
  const user = { username: username } as User;

  const jwt = generateAccessAndRefreshTokens(user);
  res.json(jwt);
});

router.delete('/api/auth/logout', (req, res) => {
  refreshTokens = refreshTokens.filter((t) => t !== req.body.token);
  res.sendStatus(204);
});

router.post('/api/auth/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { username: req.body.username, password: hashedPassword };
    const newUser = await getDataManagerInstance().createUser(user);
    return res.status(201).json(newUser);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/api/auth/generate-api-key', async (req, res) => {
  try {
    const token = crypto.randomUUID();
    const hashedToken = await bcrypt.hash(req.body.username + '_' + token, 10);
    return res.status(200).json({ key: hashedToken });
  } catch {
    return res.sendStatus(500);
  }
});

router.post('/api/auth/users/login', async (req, res) => {
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

router.post('/api/auth/refresh-token', (req, res) => {
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
