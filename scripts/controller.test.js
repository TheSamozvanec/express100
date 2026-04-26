import debugLib from "debug";
import {sequelize} from "../src/models/index.js";
import userController from "../src/controllers/user.controller.js";
import authController from "../src/controllers/auth.controller.js";
import thingController from "../src/controllers/thing.controller.js";


const debug=debugLib('exp:tests:controller');
const errors=debugLib('exp:tests:ERROR');
const debUser = debugLib('exp:tests:User');
const debThing = debugLib('exp:tests:Thing');
const debAuth = debugLib('exp:tests:Auth');

//________________входные данные req (эмуляция)
const adm = {
        user_id:5,
        login:'main',
        name:'Samozvanec',
        is_admin:true
    }
const usr = {
        user_id:16,
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
const ttest =[
    {
        name:'test thing15',
        description:'test many adm',
        user_id:5
    },
    {
        name:'test thing16',
        description:'test many adm',
        user_id:8
    },
    {
        name:'test thing17',
        description:'test many adm',
        user_id:9
    }
    
] 
   
//__________________псевдофункции (эмуляция)
let test
const req = {
        user:{...usr}, // adm / usr
        params:{id:25}, // номер
        body:{name:'ножка от коня', description:'чтоб отпинываться', user_id:25}
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
            debUser('status:', this.statusCode, 'flag>>>>>>>', this.flag);
            return this;
        },

        cookie (name, token, params) {
            debAuth ('SEND COOKIE: ', name, token, params);
        },

        clearCookie (name) {
            debAuth ('CLEAR COOKIE', name)
        }
    }
const next = (error)=> {
        debUser ('\n\nТест №',test,'\n','status:'+res.statusCode,'next(err) Error:'+error.message);
        res.flag=false;
        debug('-----------------------------------------------------');
    }

debug('Тест контроллеров');
try{
    // подключение к db
    sequelize.authenticate();
    debug('Авторизация в базе данных'); 
    debug('-----------------------------------------------------');

    // await User();
    await Things();
    // await Auth();

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
    test='1 getAll'
    // await thingController.getAll(req, res, next);

    test='2 getById'
    await thingController.getById(req, res, next);

    test='3 getByUser'
    await thingController.getByUser(req, res, next);

    test='4 create'
    // await thingController.create(req, res, next);

    test='5 createMany'
    // await thingController.createMany(req, res, next);

    test='6 update'
    // await thingController.update(req, res, next);

    test='7 delete'
    await thingController.delete(req, res, next);
}
async function Auth() {
debug('-----------------------------------------------------');
debAuth('\n\nТест кнтроллера пользователя\n')
debug('-----------------------------------------------------');

    test=1
    await authController.signIn(req, res, next)
    
}
