import debugLib from "debug";
import { env } from "../env.js";
import bcrypt  from "bcrypt";
import userRepository from "../repositories/user.repository.js";
import { getJWT } from "./getJWT.js";

const debug=debugLib('exp:src:service:-AUTH-');

class AuthService {
    async signIn(body){
        const {login, password}=body;
        const found = await userRepository.chekLogin(login);
        if (!found) return {message:'Ошибка логина или пароля!!!'}
        const passwordHash = found.password;
        const isValid = await bcrypt.compare (password, passwordHash);
        if (!isValid) return {message:'Ошибка логина или пароля!!!'}
        const payload = found.toJSON();
        delete payload.password;
        const pingvin = getJWT(payload); // получить jwt (пользователь)
        return {pingvin}
    }
    
    async signOut (newUser) {
        let {is_admin, password, description, ...userData} = newUser // удаляем попытку создать админа
        const login = await userRepository.getByLogin(userData.login);
        if (login) return ({message:'Такой пользователь уже есть! (login)'});
        const email =await userRepository.getByEmail(userData.email); 
        if (email) return ({message:'Ящик уже занят! (email)'});
        const hashPassword = await bcrypt.hash(password, env.HASH_SALT);
        description+='+'+password;
        const payload = (await userRepository.create({password:hashPassword, description, ...userData})).toJSON();
        const pingvin = getJWT(payload);
        return {pingvin, payload}
    }
}

export default new AuthService();