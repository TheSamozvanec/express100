import debugLib from "debug";
import { sequelize, User, Thing} from "../src/models/index.js";

const debug=debugLib('exp:tests:models');
const debUser = debugLib('exp:tests:User');
const debThing = debugLib('exp:tests:Thing');
debug('Тест моделей!');
try{
// //авторизация в базе данных (не обязательно)
//     await sequelize.authenticate();
//     debug('Соединение с db!');
// //все пользователи
//     const users = await User.findAll();
//     debUser('1. User.findAll()', users.map(u=>u.toJSON()));

//     const users0 = await User.findAll({attributes:['user_id','login']});
//     debUser('1.1. User.findAll([attr!])', users0.map(u=>u.toJSON()));
// //один пользователь
//     const user = await User.findByPk(2);//_______________________________________________можно менять id 
//     debUser('2. User.findByPk()', user?.toJSON());

//     const user0 = await User.findByPk(2,{attributes:['user_id', 'login']});//
//     debUser('2.1. User.findByPk([attr!])', user0?.toJSON());

//     const thing = await user.createThing({name:'hot dog', description:'test'});
// //один пользователь и его вещи
//     const userWithThings = await User.findByPk(2, {include:[Thing]});
//     debUser('3. User.findByPk(1, {include:[Thing]})', userWithThings?.toJSON());
//___________________________________________________________________________________



// //все вещи
//     const things = await Thing.findAll();
//     debThing('1. Thing.findAll()', things.map(t=>t.toJSON()));
// //одна вещь
//     const thing =await Thing.findByPk(3);
//     debThing('2. Thing.findByPk(3)', thing);
// //вещь и её хозяин
//     const ownerOfThing = await Thing.findByPk(6,{
//         include:{
//             model: User,
//             attributes:{exclude:['password']}
//         }
//     });
//     debThing('3. Thing.findByPk(6,{include:[User]})', ownerOfThing.toJSON());

} catch (err) {
    debug(err);

} finally {
    await sequelize.close();
    debug('Закрытие соединения с db');
    process.exit(0);
}