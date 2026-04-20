import { z } from 'zod';
import userService from '../services/user.service.js';
import debugLib from 'debug';

const debug = debugLib('exp:src:controller:user')
const createUserShema = z.object({
    login: z.string()
        .min(3,'Логин не менее 3 символов!')
        .max(16,'Логин не более 16 символов')
        .regex(/^[a-zA-Z0-9_]+$/, 'Логин может содержать только буквы, цифры и подчёркивание'),
    email: z.email('неверный формат email!'),
    password: z.string()
        .min(4, 'Пароль не менее 4 символов!'), // 4 только на время тестов!!!
    name: z.string()
        .max(16,'Имя не более 16 символов')
        .regex(/^[a-zA-Zа-яёА-ЯЁ]+$/,'Имя должно быть только из букв!')
        .optional().nullable(),
    description: z.string()
        .max(255, 'Описание слишком длинное (не более 255 символов)!')
        .optional().nullable()
});
const emailShema = z.email('неверный вормат email');
const loginShema = z.string()
        .min(3,'Логин не менее 3 символов!')
        .max(16,'Логин не более 16 символов')
        .regex(/^[a-zA-Z0-9_]+$/, 'Логин может содержать только буквы, цифры и подчёркивание')

const updateUserShema = z.object({
    login: z.string()
        .min(3,'Логин не менее 3 символов!')
        .max(16,'Логин не более 16 символов!')
        .regex(/^[a-zA-Z0-9_]+$/, 'Логин может содержать только буквы, цифры и подчёркивание!')
        .optional().nullable(),
    email: z.email('неверный формат email!')
        .optional().nullable(),
    password: z.string()
        .min(4, 'Пароль не менее 4 символов!') // 4 только на время тестов!!!
        .optional().nullable(),
    name: z.string()
        .max(16,'Имя не более 16 символов!')
        .regex(/^[a-zA-Zа-яёА-ЯЁ]+$/,'Имя должно быть только из букв!')
        .optional().nullable(),
    description: z.string()
        .max(255, 'Описание слишком длинное (не более 255 символов)!')
        .optional().nullable(),
    is_admin: z.boolean().optional()
}).refine(data=>Object.keys(data).length>0,{message:'Должно быть хотябы одно поле для обновления!!!'});

class UserController {   
    async getAll(req, res, next){
        try {
            res.json(await userService.getAll(req.user));
        } catch(error) {next({status:500, error})}     
    }

    async getById (req, res, next) {
        try {
        const result = await userService.getUById(req.params.id, req.user);
        if (result.message) return res.status(404).send(result);
        return res.json(result);
        } catch(error) {next({status:500, error})} 
    }

    async create(req, res, next){
        try {
            const validData = createUserShema.parse(req.body);
            const result = await userService.create(validData);
            if (result?.message) return res.status(409).send(result)
            return res.status(201).json(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                let parseObj = error.issues.map(issue=>{
                   return `Поле: ${issue.path.join('.')} / Ошибка: ${issue.message}`  
                });

                res.status(400).json(parseObj);
            } else {
                next({status:500, error});
            }
        }
    }

    async update(req, res, next){
        try {
            const validData = updateUserShema.parse(req.body);
            const result = await userService.update(req.params.id,req.user,validData);
            if (result?.message) return res.status(result.status).send(result);
            return res.json(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                let parseObj = error.issues.map(issue=>{
                   return `Поле: ${issue.path.join('.')} / Ошибка: ${issue.message}`  
                });

                res.status(400).json(parseObj)
            } else {
                next({status:500, error});
            }
        }
    }

    async delete (req, res, next) {
        try {
            const result = await userService.delete(req.params.id, req.user);
            if (result.message) return res.status(result.status).send(result);
            return res.json(result)
        } catch(error) {next({status:500, error})}
    }

    async getUserWithThings (req, res, next) {
        try {
            const result = await userService.getUserWithThings(req.params.id, req.user);
            if(!result) return res.status(404).send({message:'Такого пользователя не существует!'})
            if(result?.message) return res.status(403).send(result)
            return res.json(result);
        } catch(error) {next({status:500, error})}
    }
    
    async getByEmail (req, res, next) {
        try {
            const data = req.body?.email
            const email = emailShema.parse(data);
            const result = await userService.getByEmail(email, req.user);
            if (!result) return res.status(404).send({message:'Нет пользователя с такой почтой!'})
            return res.json(result)
        } catch(error) {
            if (error instanceof z.ZodError) {
                let parseObj = error.issues.map(issue=>{
                   return `Ошибка: ${issue.message}`  
                });

                res.status(400).json(parseObj)
            } else {
                next({status:500, error});
            }
        }
    }

    async getByLogin (req, res, next) {
        try {
            const data = req.body?.login
            const login = loginShema.parse(data);
            const result = await userService.getByLogin(login, req.user);
            if (!result) return res.status(404).send({message:'Нет такого пользователя!'})
            return res.json(result)
        } catch(error) {
            if (error instanceof z.ZodError) {
                let parseObj = error.issues.map(issue=>{
                   return `Ошибка: ${issue.message}`  
                });

                res.status(400).json(parseObj)
            } else {
                next({status:500, error});
            }
        }
    }
}

export default new UserController()