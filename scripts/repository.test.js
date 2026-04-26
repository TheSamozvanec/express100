import debugLib from "debug";
import { sequelize} from "../src/models/index.js";
import userRepository from "../src/repositories/user.repository.js";
import thingRepository from "../src/repositories/thing.repository.js";

const debug=debugLib('exp:tests:repository');
const errors=debugLib('exp:tests:ERROR');
const debUser = debugLib('exp:tests:User');
const debThing = debugLib('exp:tests:Thing')
debug('Тест репозиториев!');
try{
    await sequelize.authenticate()
    debug('Подключение к db');
    debug('-----------------------------------------------------');

    // await User(); 
    await Thing();

} catch (err) {
    errors(err);
} finally {
    await sequelize.close();
    debug('Закрытие соединения с db');
    process.exit(0);
}
async function User() {
    debThing('-----------------------------------------------------');
    debUser('\n\nТесты репозиториев пользователя\n');
    debThing('-----------------------------------------------------');

    // // все пользователи (не админ)
    // const users = await userRepository.getAll();
    // debUser('\nTest №1 getAll\n', users.map(u=>u.toJSON()));
    // debug('-----------------------------------------------------');

    // один пользователь (любой/ не админ)
    const userById = await userRepository.getById(5);
    debUser ('\nTest №2.1 getById\n', userById?.toJSON());
    debug('-----------------------------------------------------');

    // один пользователь по майл (проверка)
    const userByEmail = await userRepository.getByEmail('user01@mail.cheb');
    debUser ('\nTest №2.2 getByEmail\n', userByEmail?.toJSON());
    debug('-----------------------------------------------------');

    // один пользователь по login (проверка)
    const userByLogin = await userRepository?.getByLogin('main');
    debUser ('\nTest №2.3 getByLogin\n', userByLogin?.toJSON());
    debug('-----------------------------------------------------');

    // // создать пользователя
    // const userData = {
    //     login:'user04',
    //     email:'user04@mail.cheb',
    //     password:'zxcv',
    // }
    // const newUser = await userRepository.create(userData);
    // debUser ('\nTest №3 create\n', newUser?.toJSON());
    // debug('-----------------------------------------------------');

    // //изменить пользователя
    // const userUpd = {
    //     // login:'user02',
    //     // email:'oleg@mail.cheb',
    //     name:'Petya',
    //     description:'test from Puk',
    // }
    // const userEdit = await userRepository.update(7,userUpd);
    // debUser ('\nTest №4 update\n', userEdit?.toJSON());
    // debug('-----------------------------------------------------');

    // // удаление (админ / индивидуально)
    // const del = await userRepository.delete(8);
    // debUser ('\nTest №5 delete\n', del?.toJSON());
    // debug('-----------------------------------------------------');

    // // получить всех (только админ)
    // const usersAdm = await userRepository.getAllAdm();
    // debUser ('\nTest №6 getAllAdm\n', usersAdm.map(u=>u.toJSON()));
    // debug('-----------------------------------------------------');

    // один пользователь (админ / индивидуально)
    const userIdAdm = await userRepository.getByIdAdm(5);
    debUser ('\nTest №7.1 getByIdAdm\n', userIdAdm?.toJSON());
    debug('-----------------------------------------------------');

    // пользователь по емайл (админ)
    const userEmailAdm = await userRepository.getByEmailAdm('user02@mail.cheb');
    debUser ('\nTest №7.2 getByEmailAdm\n', userEmailAdm?.toJSON());
    debug('-----------------------------------------------------');

    // пользователь по логину (админ)
    const userLoginAdm = await userRepository.getByLoginAdm('user01');
    debUser ('\nTest №7.3 getByLoginAdm\n', userLoginAdm?.toJSON());
    debug('-----------------------------------------------------');

    //пользователь и его вещи (админ)
    const userWithThings = await userRepository.getUserWithThings(5);
    debUser ('\nTest №8 getUserWithThings\n', userWithThings?.toJSON());
    debug('-----------------------------------------------------');

    // // массив id пользователей тест транзакций
    // const userData = {
    //     name:'Мотаро',
    //     }
    // let transaction = await sequelize.transaction();
    // try {
        
    //     const chek = await userRepository.chekUsers([5,9,6], transaction);

    //     const newUser = await userRepository.create(userData, transaction);

    //     debUser('length:', chekArray.length);
      
    //     if(chekArray.length<3) {

    //         await transaction.rollback();
    //         debUser('>>>>>>>>>>>>>>>>>>МАЛО!!!>>>>>>>>>>>>>>>>');

    //     } else {

    //         await transaction.commit();
    //         debUser ('\nTest №9 getUserWithThings\n', chekArray.map(u=>u.toJSON()));
    //         debUser('USER>>>>>>>>>>>>>>>>',newUser.toJSON())
    //         debug('-----------------------------------------------------');
    //     }
        
    // } catch(err) {
    //     await transaction.rollback()
    //     debUser('>>>>>>>>>>>>>>',transaction.finished)
    //     errors(err)
    // }
}

async function Thing() {
    debThing('-----------------------------------------------------');
    debUser('\n\nТесты репозиториев вещи\n');
    debThing('-----------------------------------------------------');

    // все вещи
    const things = await thingRepository.getAll()
    debThing('\nТест №1 getAll\n', things?.map(t=>t.toJSON()));
    debThing('-----------------------------------------------------');

    // одна вещь
    const thing = await thingRepository.getById(5)
    debThing('\nТест №2 getById\n', thing?.toJSON());
    debThing('-----------------------------------------------------');

    // вещи одного пользователя (админ / индивидуально)
    const thingByUser = await thingRepository.getByUser(6)
    debThing('\nТест №3 thingByUser\n', thingByUser?.map(t=>t.toJSON()));
    debThing('-----------------------------------------------------');
    
    // // создать 1 вещь
    // const thingData = {
    //     user_id:9,
    //     name:'снюхерс',
    //     description:'нюхательный',
    // }
    // const crThing = await thingRepository.create(thingData)
    // debThing('\nТест №4.1 create\n', crThing?.toJSON());
    // debThing('-----------------------------------------------------');

    // // создать много вещей 
    // const thigsArray = [
    //     {
    //         user_id:6,
    //         name:'левая перчатка',
    //         description:'на левую руку лыцаря'
    //     },
    //     {
    //         user_id:6,
    //         name:'правая перчатка',
    //         description:'на правую руку лыцаря'
    //     },
    //     {
    //         user_id:6,
    //         name:'нижняя перчатка',
    //         description:'на нижнюю руку лыцаря'
    //     }
    // ]
    // const manyThings = await thingRepository.createMany(thigsArray);
    // debThing('\nТест №4.2 createMany\n', manyThings?.map(m=>m.toJSON()));
    // debThing('-----------------------------------------------------');

    // // исправить/передать вешь 
    // const editThing = {name:'ручка от батона', description:'зачем ему?'}
    // const updThing = await thingRepository.update(4,editThing);
    // debThing ('\nТест №5 update\n', updThing?.toJSON());
    // debThing('-----------------------------------------------------');

    // // удалить вещь 
    // const delThing = await thingRepository.delete(8)
    // debThing ('\nТест №6 delete\n', delThing?.toJSON());
    // debThing('-----------------------------------------------------');
}