import express, { Express } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { initDataManager } from './data/dataManager';
import { DATA_DIRECTORY } from './constants';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import https from 'https';
import { authenticateToken } from './routes/auth';

import pointsRouter from './routes/points';
import authRouter from './routes/auth';

declare namespace Express {
  export interface Request {
    user?: string | jwt.JwtPayload | undefined;
  }
}

const hostIP = process.env.HOST_IP ?? '0.0.0.0';
const hostPort: number = +(process.env.HOST_PORT ?? (process.env.USE_SSL ? 8443 : 8888));

const envFile = path.resolve(__dirname, process.env.NODE_ENV ? `../.env.${process.env.NODE_ENV}` : '.env');
dotenv.config({ path: envFile });

const dataManager = initDataManager(process.env.DATA_DIRECTORY ?? DATA_DIRECTORY);
console.log(dataManager);

const app: Express = express();

let spaRelativePath = '/spa';

if (process.env.NODE_ENV === 'development') {
  spaRelativePath = '/../server/spa';
}

const spaPath = path.resolve(__dirname + spaRelativePath);

// Serve static assets
app.use(express.static(spaPath));
app.use(express.json());

// Send SPA if not an API end point
app.get(/^\/(?!api).*/, function (_ /* request */, response) {
  response.sendFile(path.resolve(`${spaPath}/index.html`));
});

// These are unauthenticated as they are the auth methods
app.use(authRouter);

// All controllers after here need to have bearer token be authenticated
app.use(authenticateToken);

// Routers
app.use(pointsRouter);

const useSsl = process.env.USE_SSL?.toLowerCase() === 'true';

if (useSsl && process.env.SSL_CERT_FILENAME && process.env.SSL_KEY_FILENAME) {
  // Will be created As HTTPS
  https
    .createServer(
      {
        cert: fs.readFileSync(process.env.SSL_CERT_FILENAME),
        key: fs.readFileSync(process.env.SSL_KEY_FILENAME)
      },
      app
    )
    .listen(hostPort, hostIP, () => {
      console.log(`Home automation running at https://${hostIP}:${hostPort}/`);
    });
} else {
  // Will be created As HTTP
  app.listen(hostPort, hostIP, () => {
    console.log(`Home automation running at http://${hostIP}:${hostPort}/`);
  });
}
