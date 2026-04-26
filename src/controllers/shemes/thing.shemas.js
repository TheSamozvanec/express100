import { z } from 'zod';

export const thingShema = z.object({
    user_id: z.int('ID должен быть цеолым числом!')
        .positive('ID должен быть положительным!')
        .min(1, 'ID не может быть меньше 1')
        .optional().nullable(),
    name: z.string()
        .min(3,'Название не меньше 3 символов!')
        .max(16,'Название не более 16 символов!'),
    description: z.string()
        .max(255, 'Не более 255 символов!')
        .optional().nullable()
});

export const thingsShema = z.array(thingShema)
        .min(1,'Нельзя создать "ничего", опиши хотябы 1 вещь')



