import debugLib from "debug";
import {sequelize} from "../src/models/index.js";
import userService from "../src/services/user.service.js";
import thingService from "../src/services/thing.service.js";
import authService from "../src/services/auth.service.js";
import { email } from "zod";


const debug=debugLib('exp:tests:service');
const errors=debugLib('exp:tests:ERROR');
const debUser = debugLib('exp:tests:User');
const debThing = debugLib('exp:tests:Thing');
const debAuth = debugLib ('exp:tests:Auth');

debug('Тест сервисов');
try{
    // подключение к db
    sequelize.authenticate();
    debug('Авторизация в базе данных'); 
    debug('-----------------------------------------------------');
    // await User();
    await Things();
    //await Auth()
} catch (err) {
    errors(err);
} finally {
    await sequelize.close();
    debug('Закрытие соединения с db');
    process.exit(0);
}
async function User() {
    debug('-----------------------------------------------------');
    debUser('\n\nСервис пользователя\n');
    debug('-----------------------------------------------------');
    // данные о пользователе (мок)
    const usr = {
        user_id:6,  // важная настройка сервиса User
        login:'main', // необязательная настройка сервиса
        name:'Samozvanec', // не обязательная настройка сервиса
        //is_admin:true // Самая важная настройка (если нет - не админ)
    }

    // все пользователи   
    const users = await userService.getAll(usr);
    debUser('\nТест №1 getAll\n',users);
    debug('-----------------------------------------------------');

    // один пользователь
    const user = await userService.getUById(6, usr);
    debUser('\nТест №2 getById\n', user);
    debug('-----------------------------------------------------');

    // // сздать пользователя
    // const newUsr = {
    //     login:'user050',
    //     password:'zxcv',
    //     email:'user050@mail.cheb',
    //     name:'',
    //     description:'',
    //     //is_admin:true,
    // }
    // const newUser = await userService.create(newUsr);
    // debUser('\nТест №3 create\n', newUser);
    // debug('-----------------------------------------------------');

    // // изменить 
    // const editUser={
    //     login:'user05',
    //     password:'1111',
    //     email:'user05@mail.cheb',
    //     name:'USER555',
    //     description:'TEST test 555',
    //     is_admin:true,
    // }
    // const resUser = await userService.update(17,usr, editUser);
    // debUser('\nТест №4 update\n', resUser);
    // debug('-----------------------------------------------------');

    // //удалить 
    // const delUser = await userService.delete(15,usr);
    // debUser('\nТест №5 delete\n', delUser);
    // debug('-----------------------------------------------------');

    // //удалить 
    // const delUser = await userService.delete(15,usr);
    // debUser('\nТест №5 delete\n', delUser);
    // debug('-----------------------------------------------------');
    
    // все вещи пользователя (админ / персонально)
    const userWithThings = await userService.getUserWithThings(6,usr);
    debUser('\nТест №6 getUserWithThings\n', userWithThings);
    debug('-----------------------------------------------------');

    // все вещи пользователя (админ / персонально)
    const userByEmail = await userService.getByEmail('user05@mail.cheb',usr);
    debUser('\nТест №7 getByEmail\n', userByEmail);
    debug('-----------------------------------------------------');

    // все вещи пользователя (админ / персонально)
    const userByLogin = await userService.getByLogin('user01',usr);
    debUser('\nТест №8 getByLogin\n', userByLogin);
    debug('-----------------------------------------------------');
}
async function Things() {
    debug('-----------------------------------------------------');
    debThing('\n\nСервис вещей\n');
    debug('-----------------------------------------------------');
    const usr = {
        user_id:5,  // важная настройка сервиса User
        login:'main', // необязательная настройка сервиса
        name:'Samozvanec', // не обязательная настройка сервиса
        is_admin:true // Самая важная настройка (если нет - не админ)
    }

    //все вещи
    const things = await thingService.getAll();
    debThing('\nТест №1 getAll\n', things);
    debug('-----------------------------------------------------');

    //одна вещь
    const thing = await thingService.getById(4);
    debThing('\nТест №2 getById\n', thing);
    debug('-----------------------------------------------------');

    //вещи пользователя
    const thingsByUser = await thingService.getByUser(usr);
    debThing('\nТест №3 getByUser\n', thingsByUser);
    debug('-----------------------------------------------------');

    // // создать вещь (админ - любому / пользователь - себе)
    // const thingData = {
    //     user_id:16,
    //     name:'чего блин?',
    //     description:'Угадал!'
    // }
    // const crThing = await thingService.create(usr,thingData);
    // debThing('\nТест №4.1 create\n', crThing);
    // debug('-----------------------------------------------------');

    // // создать много вещей (админ - любому / пользователь - себе)
    // const thingsArray = [
    //     {name:'первый нах!', description:'1/3', user_id:6},
    //     {name:'вотрой нах!', description:'2/3', user_id:7},
    //     {name:'третий нах!', description:'3/3',}
    // ]
    // const crArray = await thingService.createMany(usr,thingsArray);
    // debThing('\nТест №4.2 createMany\n',crArray);
    // debug('-----------------------------------------------------');

    // // изменить вещь
    // const updThingData = {
    //   thing_id:24,
    //   user_id:7,
    //   name:'хуйня',
    //   description:'хуй пойми как это объяснить'  
    // }
    // const updThing = await thingService.update(usr, updThingData);
    // debThing('\nТест №5 update\n', updThing);
    // debug('-----------------------------------------------------');

    // удаление (пользователь - только свои)
    const delThing = await thingService.delete(23, usr)
    debThing('\nТест №6 delete\n', delThing);
    debug('-----------------------------------------------------');

}
async function Auth() {
    debug('-----------------------------------------------------');
    debUser('\n\nСервис авторизации\n');
    debug('-----------------------------------------------------');
    // данные о пользователе (мок)
    const usr = {
     //   user_id:6,  // важная настройка сервиса User
        login:'Puser777', // необязательная настройка сервиса
        email:'user777@puser.su',
        //name:'Samozvanec', // не обязательная настройка сервиса
        password:'qwer'
        //is_admin:true // Самая важная настройка (если нет - не админ)
    }
    // const sigIn = await authService.sigIn(usr);
    // debAuth('\n\nТест №1 sigIn\n', sigIn);
    // debug('-----------------------------------------------------');

    const sigOut = await authService.signOut(usr)
    debAuth('\n\nТест №2 sigOut\n', sigOut);
    debug('-----------------------------------------------------');


}