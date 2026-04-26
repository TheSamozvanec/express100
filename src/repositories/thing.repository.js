import {Thing, User} from "../models/index.js"
import debugLib from "debug"

const debug = debugLib('exp:src:repository:Thing');
class ThigRepository {
    async getAll(transaction=null) {return await Thing.findAll({transaction})}

    async getById(id, transaction=null) {return await Thing.findByPk(id,{transaction})}

    async getByUser(user_id, transaction=null) {return await Thing.findAll({transaction, where:{user_id}})}

    async create(thingData, transaction=null) {
        if(!thingData.user_id) return null;
        // лишний код!!! вынести в сервисы!!!
        const user = await User.findByPk(thingData.user_id);
        if(!user) return null;

        return await Thing.create(thingData, {transaction});
    }

    async createMany(thingArray, transaction=null) { // валидация массива на верхних уровнях
        return await Thing.bulkCreate(thingArray,{ 
            transaction,
            validate:true, // внутренняя валидация из модели
            individualHooks:true
        });
    }

    async update(id, thingData, transaction=null){
        const thing = await Thing.findByPk(id, {transaction});
        if(!thing) return null;
        return await thing.update(thingData, {transaction});
    }

    async delete (id, transaction=null) {

        const thing = await Thing.findByPk(id, {transaction});
        if(!thing) return null;
        await thing.destroy({transaction});
        return thing;
    }
}

export default new ThigRepository()
