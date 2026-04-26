import jwt from "jsonwebtoken";
import { env } from "../env.js";
import debugLib from "debug";

const debug = debugLib('exp:service:getJWT')

export function getJWT(data) {
    const {user_id, login, name, is_admin} = data
    const payload = {user_id, login, name}
    if(is_admin) payload.is_admin=is_admin;
    const pingvin = jwt.sign(
        {payload}, 
        env.COOKIE_SECRET, 
        {expiresIn:env.JWT_EXPIRES_IN});
    debug('JWT life:',env.JWT_EXPIRES_IN);
    return pingvin
}