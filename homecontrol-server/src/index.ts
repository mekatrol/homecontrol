import { clear } from "console";
import express, { Express, Request, Response } from "express";
const dotenv = require("dotenv");
const path = require("path");
const hostname = "localhost";

const envFile = path.resolve(
  __dirname,
  process.env.NODE_ENV ? `../.env.${process.env.NODE_ENV}` : ".env"
);
dotenv.config({ path: envFile });

const port: number = +(process.env.PORT ?? 80);
const app: Express = express();

let spaRelativePath = "/spa";

if (process.env.NODE_ENV === "development") {
  spaRelativePath = "/../server/spa";
}

const spaPath = path.resolve(__dirname + spaRelativePath);

// Serve static assets
app.use(express.static(spaPath));

app.get(/^\/(?!api).*/, function (_ /* request */, response) {
  response.sendFile(path.resolve(`${spaPath}/index.html`));
});

// Sever all routes except /api
app.get("/api/points", (_: Request /* request */, response: Response) => {
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify({ a: 1 }));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Home automation running at http://${hostname}:${port}/`);
});
