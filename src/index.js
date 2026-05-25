import https from "node:https"
import fs from "node:fs"
import path from "node:path"
import app from "./app.js";
import '../src/models/index.js'; // для иннициализации моделей в sequelize
import { ConnectDB } from "./config/database.js";
import { env } from "./env.js";
import debugLib from 'debug';
import __dirname from "../dirname.js";

const debug =debugLib('exp:src:index');

// HTTPS опции 
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem'), 'utf8'),
  cert:fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem'), 'utf8')
};
// подключаем DB
await ConnectDB();
// Создаем HTTPS сервер
const server = https.createServer(httpsOptions, app);

server.listen(env.HTTPS_PORT, '0.0.0.0', ()=>{
  debug (`🔒 HTTPS Server listening on https://pc:${env.HTTPS_PORT}`)
})
// вариант для создания http 
// const server = app.listen(env.PORT, () => {
//   debug(`Listening: http://localhost:${env.PORT}`);
// });

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    debug(`Port ${env.HTTPS_PORT} is already in use. Please choose another port or stop the process using it.`);
  }
  else {
    debug("Failed to start server:", err);
  }
  process.exit(1);
});
