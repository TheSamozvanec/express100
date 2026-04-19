
import Thing from "../models/thing.model.js"
import User from "../models/user.model.js"

class UserRepository {
    async getAll() {return await User.findAll({attributes:['user_id','login','name']})}
    async getById(id) {return await User.findByPk(id,{attributes:['user_id','login','name']})}
    async getByEmail(email) {return await User.findOne({where:{email}, attributes:['user_id','login','email']})}
    async getByLogin(login) {return await User.findOne({where:{login}, attributes:['user_id','login','name']})}

    async create(userData) {return await User.create(userData)}
    async update(id, userData){
        const user = await User.findByPk(id);
        if(!user) return null;
        return await user.update(userData);
    }
    async delete (id) {
        const user = await User.findByPk(id);
        if(!user) return null;
        await user.destroy();
        return user;
    }
// admin repository
    async getAllAdm() {return await User.findAll(
        {
            attributes:{
                exclude:['password']
            }
        })
    }//только админ

    async getByIdAdm(id) {return await User.findByPk(id,{attributes:{exclude:['password']}})}// личный запрос/ админ

    async getByEmailAdm(email) {return await User.findOne({where:{email},attributes:{exclude:['password']}})}//только админ

    async getByLoginAdm(login) {return await User.findOne({where:{login}, attributes:{exclude:['password']}})}//только админ

    async getUserWithThings(id) {return await User.findByPk(id,{
        attributes:{
            exclude:['password']
        } 
        ,include:{
            model:Thing,
            attributes:{
                exclude:['user_id']
            } 
        }
    })}//личный запрос/ админ
}

export default new UserRepository()