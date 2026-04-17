import app from "./app.js";
import '../src/models/index.js'; // для иннициализации моделей в sequelize
import { ConnectDB } from "./config/database.js";
import { env } from "./env.js";
import debugLib from 'debug'

const debug =debugLib('exp:src:index');
await ConnectDB();
const server = app.listen(env.PORT, () => {
  debug(`Listening: http://localhost:${env.PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    debug(`Port ${env.PORT} is already in use. Please choose another port or stop the process using it.`);
  }
  else {
    debug("Failed to start server:", err);
  }
  process.exit(1);
});
