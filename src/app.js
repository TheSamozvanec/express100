import cors from "cors";
import express from "express";
import morgan from "morgan";
import debugLib from "debug";

const debug = debugLib('exp:src:app');

import api from "./api/index.js";

import * as middlewares from "./middlewares.js";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
debug ('app init!!!')
//
export default app;
