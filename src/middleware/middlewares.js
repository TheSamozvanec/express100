
import debugLib from "debug";
import whiteList from "../config/whiteList.js";
import jwt from "jsonwebtoken";
import { env } from "../env.js";

const debug = debugLib('exp:src:(--MIDDLEWARE--)');
const adm = {
  user_id:5,
  login:'main',
  name:'Samozvanec',
  is_admin:true
}
const usr = {
  user_id:17,
  login:'user05',
  name:'USER555',
}
export function kostyl (req, res, next) { //костыльная авторизация
  req.user = {...adm}
  next();
}

export function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

export function errorHandler(err, req, res, _next) {
  //const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  debug (err)
  res.send(err.message);
}

export function hasAuth(req, res, next){
  try {
    const path =req.path
    debug('path:\n', path);
    debug('whiteList:\n', whiteList);
    if(whiteList.some(r=> r===path)) return next();
    const pin = req.cookies.pingvin;
    if(!pin) return res.status(401).json({message:'Требуется авторизация!!!'});
    const auth = jwt.verify(pin, env.COOKIE_SECRET, (err, ok)=>{
      const payload = {};
      if (ok) Object.assign(payload, ok.payload);
      return {err, payload} 
    });
    if (auth.err) throw err;
    debug (auth);
    req.user = auth.payload;
    next();
  } 
  catch (err) {
    const error = JSON.stringify(err);
    debug(err);
    res.status(401).send({
      message:'Пошел нахуй!',
      error:{
        massage: err.message,
        stack: err.stack,
        name: err.name
      }
    })
  }

}

