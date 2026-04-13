import cors from "cors";
import express from "express";
import morgan from "morgan";
import debugLib from "debug";
import { ConnetcDB } from "./config/database.js";
import * as middlewares from "./middleware/middlewares.js";

const debug = debugLib('exp:src:app');
//____________________________

await ConnetcDB();
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Стартовал!!!",
  });
});


app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
debug ('app init!!!')

export default app;
