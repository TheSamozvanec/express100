import { Sequelize } from "sequelize";
import { env } from "../env.js";
import expressHandlebars from "express-handlebars";
import { helpers } from "./helpers.js";
import debugLib from "debug";

const debug = debugLib('exp:src:config');
const debugSQL = debugLib ('exp:SQL')

export const handlebars = expressHandlebars.create({
    defaultLayout: 'main', // лейаут по умолчанию main.hbs
    extname: 'hbs', // расширение файла для render 
    helpers // набор функций которые можно использовать в hbs править в модуле
});

export const sequelize = new Sequelize(
    env.POSTGRES_DB,
    env.POSTGRES_USER,
    env.POSTGRES_PASSWORD,
    {
        host:'localhost',
        port: env.POSTGRES_PORT,
        dialect: 'postgres',
        logging:(sql) => debugSQL(sql), // логирование можно выключить (false)
        pool:{
            max:20,
            min:2,
            acquire:30000,
            idle:10000
        }
    }
);
// подключение к db
export async function ConnectDB() {
    try {
        await sequelize.authenticate();
        debug('Подключение к PostgreSQL успешно установлено!');    
        const [results0] = await sequelize.query('SELECT NOW() as current_time');
        debug('Время на сервере БД:', results0[0].current_time);   
    } catch (err){
        debug('Ошибка подключения:', err);
    } 
    if (process.platform==='win32'){
        const rl = readline.createInterface({
                input: stdin,
                output: stdout
            });
        rl.on ('SIGINT', () => process.emit('SIGINT'));
    }
   process.on('SIGINT', async ()=>{
        try {
            await sequelize.close();
            debug('Отключился от postgreSQL');
            process.exit (0);
        } catch(err) {
            console.error(`Проблемы с отключением от базы данных: ${err}`);
            process.exit (98)
        }
   })
}
