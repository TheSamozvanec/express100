import {ZodError} from "zod"
import {updateUserShema, emailShema, loginShema, setCookieJWT} from "./shemes/user.shemes.js"
import userService from '../services/user.service.js';
import debugLib from 'debug';

const debug = debugLib('exp:src:controller:--USER--');

class UserController {   
    getAll = async (req, res, next) => {
        try { 
            res.json({user:req.user, data:await userService.getAll(req.user)});
        } catch(error) {this.#err500(error, res, next)}  
    }

    getById = async (req, res, next) => {
        try {
            const result = await userService.getUById(req.params.id, req.user);
            if (result.message) return this.#error(404, result, res, next);
            return res.json({user:req.user, data:result});
        } catch(error) {this.#err500(error, res, next)}
    }

    update = async (req, res, next) => {
        try {
            const validData = updateUserShema.parse(req.body);
            const result = await userService.update(req.params.id,req.user,validData);
            if (result?.message) return this.#error(result.status, result, res, next);      
            if (+req.user.user_id===+req.params.id) {
                req.user={
                user_id:result.user_id,
                login:result.login,
                name:result.name,
                }
                setCookieJWT(result, res);
            };
            const {pingvin, ...data}=result;
            return res.json({user:req.user, data});
        } catch (error) { this.#errValid(error, res, next) }
    }

    delete = async (req, res, next) => {
        try {
            const result = await userService.delete(req.params.id, req.user);
            if (result.message) return this.#error(result.status, result, res, next);
            if(+req.user.user_id===+req.params.id) res.clearCookie('pingvin');
            return res.json(result);
        } catch(error) {this.#err500(error, res, next)}
    }

    getUserWithThings = async (req, res, next) => {
        try {
            const result = await userService.getUserWithThings(req.params.id, req.user);
            if(!result) return this.#error(404, {message:'Такого пользователя не существует!'}, res, next);
            if(result?.message) return this.#error(403, result, res, next);
            return res.json({user:req.user, data:result});
        } catch(error) {this.#err500(error, res, next)}
    }
    
    getByEmail = async (req, res, next) => {
        try {
            const data = req.body?.email
            const email = emailShema.parse(data);
            const result = await userService.getByEmail(email, req.user);
            if (!result) return this.#error(404, {message:'Нет пользователя с такой почтой!'}, res, next);
            if(result?.message) return this.#error(403, result, res, next);    
            return res.json({user:req.user, data:result});
        } catch(error) { return this.#errValid(error, res, next) }
    }

    getByLogin = async (req, res, next) => {
        try {
            const data = req.body?.login;
            const login = loginShema.parse(data);
            const result = await userService.getByLogin(login, req.user);
            if (!result) return this.#error(404, {message:'Нет такого пользователя!'}, res, next);    
            if(result?.message) return this.#error(403, result, res, next);      
            return res.json({user:req.user, data:result});
        } catch(error) { return this.#errValid(error, res, next) }
    }
    
    #error = (st, err, res, next) => {
        debug('>>>>>>>>>>>>>>>>>>>>', st)
        res.status(st);next(err)
    }
    #err500 = (err, res, next) => {res.status(500);next(err)}
    #errValid = (err, res, next) => {
        if (err instanceof ZodError) {
                let parseObj = err.issues.map(issue=>{return `Поле: ${issue.path.join('.')} / Ошибка: ${issue.message}`});
                this.#error(400, {message:parseObj}, res, next);
            } else { this.#err500(err, res, next) }
    }
}

export default new UserController()