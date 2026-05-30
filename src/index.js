import https from "node:https";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import app from "./app.js";
import '../src/models/index.js';
import { ConnectDB } from "./config/database.js";
import { env } from "./env.js";
import debugLib from 'debug';
import __dirname from "../dirname.js";

const debug = debugLib('exp:src:index');

await ConnectDB();

if (env.PROTOCOL === 'https') {
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem'), 'utf8'),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem'), 'utf8')
  };
  const server = https.createServer(httpsOptions, app);
  server.listen(env.HTTPS_PORT, '0.0.0.0', () => {
    debug(`🔒 HTTPS Server listening on https://0.0.0.0:${env.HTTPS_PORT}`);
  });
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      debug(`Port ${env.HTTPS_PORT} is already in use.`);
    } else {
      debug("Failed to start server:", err);
    }
    process.exit(1);
  });
} else {
  const server = http.createServer(app);
  server.listen(env.PORT, '0.0.0.0', () => {
    debug(`🌍 HTTP Server listening on http://0.0.0.0:${env.PORT}`);
  });
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      debug(`Port ${env.PORT} is already in use.`);
    } else {
      debug("Failed to start server:", err);
    }
    process.exit(1);
  });
}
// test test test 