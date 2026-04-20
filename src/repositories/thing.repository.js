import {Thing, User} from "../models/index.js"
import debugLib from "debug"

const debug = debugLib('exp:repository:Thing');
class ThigRepository {
    async getAll() {return await Thing.findAll()}

    async getById(id) {return await Thing.findByPk(id)}

    async getByUser(user_id) {return await Thing.findAll({where:{user_id}})}

    async create(thingData) {
        if(!thingData.user_id) return null;
        const user = await User.findByPk(thingData.user_id);
        if(!user) return null;
        return await Thing.create(thingData);
    }

    async createMany(thingArray) { // валидация массива на верхних уровнях
        return await Thing.bulkCreate(thingArray,{ 
            validate:true, // внутренняя валидация из модели
            individualHooks:true
        });
    }

    async update(id, thingData){
        const thing = await Thing.findByPk(id);
        if(!thing) return null;
        return await thing.update(thingData);
    }

    async delete (id) {
        const thing = await Thing.findByPk(id);
        if(!thing) return null;
        await thing.destroy();
        return thing;
    }
}

export default new ThigRepository()
