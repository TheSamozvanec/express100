import path from "node:path"
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import debugLib from "debug";
import { handlebars } from "./config/database.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import thingRouter from "./routes/thing.routes.js";
import * as middlewares from "./middleware/middlewares.js";
import __dirname from "../dirname.js"

const debug = debugLib('exp:src:--APP--');
//____________________________
debug('dirname:\n',__dirname);
//____________________________
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8000',
  'https://semov777.com',
  'https://www.semov777.com',
  'https://poligon.semov777.com'
];
const app = express();
app.use(morgan("dev"));
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']      
}));
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs',handlebars.engine); 
app.set('view engine','hbs');
app.use(cookieParser()); // куки
app.use(express.static(path.join(__dirname, 'public')));

app.use(middlewares.hasAuth);
//app.use(middlewares.kostyl)

app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/thing',thingRouter);

app.get("/", (req, res) => {
  res.render('index',{script:'/javascript/start-page.js'});
});


app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
debug ('app init!!!');

export default app;
