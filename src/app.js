import path from "node:path"
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import debugLib from "debug";
import { handlebars } from "./config/database.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import * as middlewares from "./middleware/middlewares.js";
import __dirname from "../dirname.js"

const debug = debugLib('exp:src:--APP--');
//____________________________
debug('dirname:\n',__dirname);
//____________________________

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs',handlebars.engine); 
app.set('view engine','hbs');
app.use(cookieParser()); // куки
app.use(express.static(path.join(__dirname, 'public')));

app.use(middlewares.hasAuth);
// app.use(middlewares.kostyl)

app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);

app.get("/", (req, res) => {
  res.render('index');
});


app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
debug ('app init!!!');

export default app;
