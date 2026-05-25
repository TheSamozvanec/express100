
import debugLib from "debug";
import whiteList from "../config/whiteList.js";
import jwt from "jsonwebtoken";
import { env } from "../env.js";
import userRepository from "../repositories/user.repository.js";

const debug = debugLib('exp:src:(--MIDDLEWARE--)');
const adm = {
  user_id:70,
  login:'main',
  name:'Админ',
  is_admin:true
}
const usr = {
  user_id:72,
  login:'user02',
  //name:undefined,
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

export async function hasAuth(req, res, next){
  try {
    const path =req.path
    debug('path:\n', path);
    debug('whiteList:\n', whiteList);
    if(whiteList.some(r=> r===path)) return next();
    const pin = req.cookies.pingvin;
    debug('>>>>>>>>>>>>', req.cookies);
    if(!pin) return res.status(401).json({message:'Требуется авторизация!!!'});
    const auth = jwt.verify(pin, env.COOKIE_SECRET, (err, ok)=>{
      const payload = {};
      if (ok) Object.assign(payload, ok.payload);
      return {err, payload} 
    });
    if (auth.err) throw err;
    // const user = await userRepository.getById(auth.payload.user_id);
    // if(user.message) throw user;
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

