import debugLib from "debug";
import {sequelize} from "../src/models/index.js";
import userService from "../src/services/user.service.js";

const debug=debugLib('exp:tests:service');
const errors=debugLib('exp:tests:ERROR');
const debUser = debugLib('exp:tests:User');
const debThing = debugLib('exp:tests:Thing');
debug('Тест сервисов');
try{
    // подключение к db
    sequelize.authenticate();
    debug('Авторизация в базе данных'); 
    debug('-----------------------------------------------------');
    await User();
} catch (err) {
    errors(err);
} finally {
    await sequelize.close();
    debug('Закрытие соединения с db');
    process.exit(0);
}
async function User(){
    // Сервис пользователя
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
    //     login:'user05',
    //     password:'zxcv',
    //     email:'user05@mail.cheb',
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