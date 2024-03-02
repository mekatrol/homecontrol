"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = require("dotenv");
const path = require("path");
const hostname = "localhost";
const envFile = path.resolve(__dirname, process.env.NODE_ENV ? `../.env.${process.env.NODE_ENV}` : ".env");
dotenv.config({ path: envFile });
const port = +((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 80);
const app = (0, express_1.default)();
let spaRelativePath = "/spa";
if (process.env.NODE_ENV === "development") {
    spaRelativePath = "/../server/spa";
}
const spaPath = path.resolve(__dirname + spaRelativePath);
// Serve static assets
app.use(express_1.default.static(spaPath));
app.get(/^\/(?!api).*/, function (_ /* request */, response) {
    response.sendFile(path.resolve(`${spaPath}/index.html`));
});
// Sever all routes except /api
app.get("/api/points", (_ /* request */, response) => {
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ a: 1 }));
});
app.listen(port, "0.0.0.0", () => {
    console.log(`Home automation running at http://${hostname}:${port}/`);
});
