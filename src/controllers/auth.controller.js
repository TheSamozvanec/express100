import debugLib from 'debug';
import {ZodError} from "zod"
import authService from '../services/auth.service.js';
import { createUserShema, setCookieJWT } from './shemes/user.shemes.js';


const debug = debugLib('exp:src:controller:--AUTH--');

class AuthController {
    signIn = async (req, res, next) => {
        try {
                const result = await authService.signIn(req.body);
                if (result?.message) return this.#error (401, result, res, next);
                setCookieJWT(result,res);
                res.send (req.body.login+' Авторизован');
        } catch (error) {this.#err500(error, res, next)}
    }
    signOut = async (req, res, next) => {
        try {
          const validData = createUserShema.parse(req.body);
          const result = await authService.signOut(validData);
          if(result?.message) return this.#error(409, result, res, next);
          setCookieJWT(result, res)
          return res.status(201).json(result.payload);
        } catch (error) {this.#errValid(error, res, next)}
    }
    check = async (req, res, next) => { // тест только на постман 
        try{ 
                return res.json({user:req.user});
        } catch (error) {this.#err500(error, res, next)}
    }

    logaut = async (req, res, next) => {
        try {
                res.clearCookie('pingvin');
                res.status(204).send();
        } catch (error) {this.#err500(error, res, next)}
    }

    #error = (st, err, res, next) => {res.status(st);next(err)}
    #err500 = (err, res, next) => {res.status(500);next(err)}
    #errValid = (err, res, next) => {
            if (err instanceof ZodError) {
                    let parseObj = err.issues.map(issue=>{return `Поле: ${issue.path.join('.')} / Ошибка: ${issue.message}`});
                    this.#error(400, {message:parseObj}, res, next);
                } else { this.#err500(err, res, next) }
        }
}

export default new AuthController()