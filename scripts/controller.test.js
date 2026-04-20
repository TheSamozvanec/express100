import debugLib from "debug";
import {sequelize} from "../src/models/index.js";
import userController from "../src/controllers/user.controller.js";

const debug=debugLib('exp:tests:controller');
const errors=debugLib('exp:tests:ERROR');
const debUser = debugLib('exp:tests:User');
const debThing = debugLib('exp:tests:Thing');
debug('Тест контроллеров');
try{
    // подключение к db
    sequelize.authenticate();
    debug('Авторизация в базе данных'); 
    debug('-----------------------------------------------------');

    await User();
   // await Things();

} catch (err) {
    errors(err);
} finally {
    await sequelize.close();
    debug('Закрытие соединения с db');
    process.exit(0);
}
async function User(){
    debug('-----------------------------------------------------');
    debUser('\n\nТест кнтроллера пользователя\n')
    debug('-----------------------------------------------------');
    const adm = {
        user_id:5,
        login:'main',
        name:'Samozvanec',
        is_admin:true
    }
    const usr = {
        user_id:7,
        login:'user02',
        name:'Petya',
    }
    const utest = {
        login:'Puser007',
        email:'Puser007@mail.cheb',
        password:'qwer',
        name:'Мотя',
        description:'не еврейский',
        is_admin:true
    }
    let test
    const req = {
        user:{...adm}, // adm / usr
        params:{id:19}, // номер
        body:{email:'user05@mail.cheb', login:'user004'} // ...utest / email / login
    }
    const res ={
        statusCode:200,
        flag:false,
        json(obj){
            if(!this.flag) this.statusCode=200
            debUser ('\n\nТест №', test, 'status:', this.statusCode, '\n',obj);
            this.flag=false
            debug('-----------------------------------------------------');
        },
        send(obj){
            if(!this.flag) this.statusCode=200;
            debUser ('\n\nТест №', test, 'status:', this.statusCode, '\n',obj);
            this.flag=false
            debug('-----------------------------------------------------');
        },
        status(n){
            this.flag=true;
            this.statusCode=n;
            return this;
        }
    }
    const next = (error)=> {
        debUser ('\n\nТест №',test,'\n',error)
        debug('-----------------------------------------------------');
    }
    // все пользователи
    test='1 getAll'
    await userController.getAll(req, res, next);

    // один пользователь
    test ='2 getById'
    await userController.getById(req, res, next);

    // // создать
    // test ='3 create'
    // await userController.create(req, res, next);

    // // изменить 
    // test = '4 update'
    // await userController.update(req, res, next);

    // // удалить
    // test = '5 delete'
    // await userController.delete(req, res, next);

    // вещи пользователя (админ!!!)
    test = '6 getUserWithThings'
    await userController.getUserWithThings(req, res, next);

    // пользователь по email (админ!!!)
    test = '7 getByEmail'
    await userController.getByEmail(req, res, next);

    // пользователь по login (админ!!!)
    test = '8 getByLogin'
    await userController.getByLogin(req, res, next);
    
}
async function Things() {
    debug('-----------------------------------------------------');
    debThing('\n\nТест кнтроллера вещщи\n')
    debug('-----------------------------------------------------'); 
}