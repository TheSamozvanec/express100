import debugLib from "debug";
import { sequelize, User, Thing} from "../src/models/index.js";

const debug=debugLib('exp:tests:models');
const debUser = debugLib('exp:tests:User');
const debThing = debugLib('exp:tests:Thing');
debug('Тест моделей!');
try{
    await sequelize.authenticate();
    debug('Соединение с db!');
    debug('-----------------------------------------------------');
    // все пользователи
    const users = await User.findAll();
    debUser('\nТест №1 User.findAll()\n', users.map(u=>u.toJSON()));

    const users0 = await User.findAll({attributes:['user_id','login']});
    debUser('\nТест №1.1 User.findAll([attr!])\n', users0.map(u=>u.toJSON()));
    debug('-----------------------------------------------------');
    //один пользователь
    const user = await User.findByPk(5); 
    debUser('\nТест №2 User.findByPk()\n', user?.toJSON());
    debug('-----------------------------------------------------');

    const user0 = await User.findByPk(5,{attributes:['user_id', 'login']});//
    debUser('\nТест №2.1 User.findByPk([attr!])\n', user0?.toJSON());
    debug('-----------------------------------------------------');

    // // создать вещь для пользователя (использует user из Теста №2)
    // const thing = await user.createThing({name:'hot dog', description:'test'});
//один пользователь и его вещи
    const userWithThings = await User.findByPk(5, {include:[Thing]});
    debUser('\nТест №3. User.findByPk(1, {include:[Thing]})\n', userWithThings?.toJSON());
    debug('-----------------------------------------------------');

// Тесты для Thing - вещи пользователей

//все вещи
    const things = await Thing.findAll();
    debThing('\nТест №1 Thing.findAll()\n', things.map(t=>t.toJSON()));
    debug('-----------------------------------------------------');

//одна вещь
    const thing =await Thing.findByPk(3);
    debThing('\nТест №2 Thing.findByPk(3)\n', thing.toJSON());
    debug('-----------------------------------------------------');

//вещь и её хозяин
    const ownerOfThing = await Thing.findByPk(5,{
        include:{
            model: User,
            attributes:{exclude:['password']}
        }
    });
    debThing('\nТест №3 Thing.findByPk(6,{include:[User]})\n', ownerOfThing.toJSON());

} catch (err) {
    debug(err);

} finally {
    await sequelize.close();
    debug('Закрытие соединения с db');
    process.exit(0);
}