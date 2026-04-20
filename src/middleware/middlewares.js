import { env } from "../env.js";

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
export function kostyl (req, res, next) {
  req.user = {...adm}
  next()
}

export function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

export function errorHandler(err, req, res, _next) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}



