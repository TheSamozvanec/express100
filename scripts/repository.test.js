import debugLib from "debug";
import { sequelize } from "../src/models/index.js";
import userRepository from "../src/repositories/user.repository.js";

const debug=debugLib('exp:tests:repository');
const errors=debugLib('exp:tests:ERROR');
const debUser = debugLib('exp:tests:User');
debug('Тест репозиториев!');
try{
    await sequelize.authenticate()
    debug('Подключение к db');
    debug('-----------------------------------------------------');
    // // все пользователи (не админ)
    // const users = await userRepository.getAll();
    // debUser('1. getAll', users.map(u=>u.toJSON()));
    // debug('-----------------------------------------------------');
    // // один пользователь (любой/ не админ)
    const userById = await userRepository.getById(4);
    debUser ('2.1 getById', userById?.toJSON());
    // // один пользователь по майл (проверка)
    // const userByEmail = await userRepository.getByEmail('user01@mail.cheb');
    // debUser ('2.2 getByEmail', userByEmail?.toJSON());
    // // один пользователь по login (проверка)
    // const userByLogin = await userRepository?.getByLogin('main');
    // debUser ('2.3 getByLogin', userByLogin?.toJSON());
    // создать пользователя
    // const userData = {
    //     login:'user04',
    //     email:'user04@mail.cheb',
    //     password:'zxcv',
    // }
    // const newUser = await userRepository.create(userData);
    // debUser ('3 create', newUser?.toJSON());
    debug('-----------------------------------------------------');
    //изменить пользователя
    const userUpd = {
        login:'user01',
       // email:'',
        name:'',
        description:'test2',
    }
    const userEdit = await userRepository.update(2,userUpd);
    debUser ('4 update', userEdit?.toJSON());
    debug('-----------------------------------------------------');
} catch (err) {
    errors(err);
} finally {
    await sequelize.close();
    debug('Закрытие соединения с db');
    process.exit(0);
}