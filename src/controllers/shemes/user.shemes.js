import { z } from 'zod';
import { env } from '../../env.js';
import { parseExpiresIn } from '../../config/functions.js';

export const createUserShema = z.object({
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
export const emailShema = z.email('неверный вормат email');
export const loginShema = z.string()
        .min(3,'Логин не менее 3 символов!')
        .max(16,'Логин не более 16 символов')
        .regex(/^[a-zA-Z0-9_]+$/, 'Логин может содержать только буквы, цифры и подчёркивание')

export const updateUserShema = z.object({
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

export const setCookieJWT = (result, res) => {
    const {pingvin} = result;
    res.cookie('pingvin', pingvin, {
        httpOnly: true,   // Защита от XSS
        secure: false,     // НЕ Только HTTPS
        sameSite: 'strict', // Защита от CSRF
        maxAge: parseExpiresIn(env.JWT_EXPIRES_IN)   // парсер       
         });
}