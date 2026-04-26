import thingService from "../services/thing.service.js";
import { ZodError } from "zod";
import { thingShema, thingsShema } from "./shemes/thing.shemas.js";
import debugLib from "debug";

const debug = debugLib('exp:src:controller:--THING--')

class ThingController {
    getAll = async (req, res, next) => {
        try {
            res.json({user:req.user, data: await thingService.getAll()});
        } catch(error) {this.#err500(error, res, next)}
    }

    getById = async (req, res, next) => {
        try {
            const data = await thingService.getById(req.params?.id);
            if (!data) return this.#error(404, {message:'Нет такого!'}, res, next);
            res.json({user:req.user, data});
        } catch(error) {this.#err500(error, res, next)}
    }

    getByUser = async (req, res, next) => {
        try {
            const data = await thingService.getByUser(req.user);        
            res.json({user:req.user, data});
        } catch(error) {this.#err500(error, res, next)}
    }

    create = async (req, res, next) => {
        try {
            const validData = thingShema.parse(req.body);
            const thing = await thingService.create (req.user, validData);
            if(!thing) return this.#error (404,{message:'Не получилось! Такого пользователя нет (user_id)!'}, res, next)
            res.json({user:req.user, data:thing});
        } catch (error) { this.#errValid(error, res, next) }
    }

    createMany = async (req, res, next) => {
        try {
            const validData = thingsShema.parse(req.body);
            const data = await thingService.createMany(req.user, validData);
            if (data.message) return this.#error (404, data, res, next); 
            res.json({user:req.user, data});
        } catch (error) { this.#errValid(error, res, next) }
    }

    update = async (req, res, next) => {
        try {
            const validData = thingShema.parse(req.body);
            validData.thing_id=req.params.id;
            const data = await thingService.update(req.user, validData);
            if (data.message) return this.#error(data.status, data, res, next);
            res.json({user:req.user, data})
        } catch (error) { this.#errValid(error, res, next) }    
    } 

    delete = async (req, res, next) => {
        try {
            const data = await thingService.delete(req.params.id, req.user);
            if(!data) return this.#error(404, {message:'Такой вещи нет!'}, res, next);
            if(data.message) return this.#error(403, data, res, next);
            res.json({user:req.user, data});
        } catch(error) {this.#err500(error, res, next)}
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

export default new ThingController()