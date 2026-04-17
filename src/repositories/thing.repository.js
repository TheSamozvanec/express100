import {Thing} from "../models/index.js"

class ThigRepository {
    async getAll() {return await Thing.findAll()}
    async getById(id) {return await Thing.findByPk(id)}
    async getByUser(user_id) {return await Thing.findOne({where:{user_id}})}
    async create(thingData) {return await Thing.create(thingData)}
    async update(id, thingData){
        const thing = await Thing.findByPk(id);
        if(!thing) return null
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
