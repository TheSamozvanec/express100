import debugLib from "debug";
import thingRepository from "../repositories/thing.repository.js";
import userRepository from "../repositories/user.repository.js";

const debug = debugLib('exp:service:-THING-');

class ThingService {
    async getAll(){return (await thingRepository.getAll())?.map(t=>t.toJSON())}

    async getById(id){return (await thingRepository.getById(id))?.toJSON()}

    async getByUser(usr){
        return (await thingRepository.getByUser(usr.user_id))?.map(t=>t.toJSON())
    }

    async create (usr, data) {
        const thingData = {...data}
        if (!usr.is_admin) thingData.user_id=usr.user_id;
        if (usr.is_admin && !thingData.user_id) thingData.user_id=usr.user_id;

        return (await thingRepository.create(thingData))?.toJSON();
    }

    async createMany (usr, thingsArray) {
        if (usr.is_admin) return this.#createMany(usr.user_id, thingsArray);
        const result = thingsArray.map(({name, description})=>{
            return {name, description, user_id:usr.user_id}
        });
        return (await thingRepository.createMany(result))?.map(t=>t.toJSON());
    }
    async #createMany (id,thingsArray) {   
        const result = thingsArray.map(({name, description, user_id})=>{
            if(user_id) return {name, description, user_id} 
            return {name, description, user_id:id}
        });
        const idArray = [...new Set(thingsArray.map(t=>t.user_id))];
        const hasIds = (await userRepository.chekUsers(idArray))?.map(h=>h.user_id);
        const missingIds = idArray.filter(id=> !hasIds.includes(id));
        if (missingIds.length>0) return {message:'Нет пользователей с ID: ' + missingIds.join(', ')}
        return (await thingRepository.createMany(result))?.map(t=>t.toJSON());   
    }

    async update(usr, data) {
        const {user_id, thing_id, ...thingData} = data 
        if (data.user_id){
            const user = await userRepository.getById(data.user_id);
            if (!user) return {message:"Пользователь, которому передается вещь (user_id), не существует!", status:422}
        }
        if (usr.is_admin) return this.#update(thing_id, {user_id, ...thingData});
        const thing = await thingRepository.getById(thing_id);
        if (!thing) return {message:'Нет такой вещи!', status:404}
        if (thing?.user_id!==usr.user_id) return {message:'Не твоё - не трогай!', status:403}
        return (await thing.update({user_id, ...thingData}))?.toJSON();
    }
// на доработку
    async #update (thing_id, thingData) {
        const thing = (await thingRepository.update(thing_id, thingData))?.toJSON();
        if (!thing) return {message:'Нет такой вещи!', status:404}
        return thing
    }

    async delete (id, usr) {
        if (usr.is_admin) return (await thingRepository.delete(id))?.toJSON();
        const thing = await thingRepository.getById(id);
        if (thing.user_id!==usr.user_id) return {message:'Не твоё - не трогай!'}
        await thing?.destroy();
        return thing?.toJSON();
    }

}

export default new ThingService()