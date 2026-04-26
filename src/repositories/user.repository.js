
import debuglib from "debug"
import Thing from "../models/thing.model.js"
import User from "../models/user.model.js"

const debug = debuglib('exp:src:repository:User')
class UserRepository {

    async getAll(transaction = null) {return await User.findAll({transaction, attributes:['user_id','login','name']})}

    async getById(id, transaction = null) {return await User.findByPk(id,{transaction, attributes:['user_id','login','name']})}

    async getByEmail(email, transaction = null) {return await User.findOne({transaction, where:{email}, attributes:['user_id','login','email']})}

    async getByLogin(login, transaction = null) {return await User.findOne({transaction, where:{login}, attributes:['user_id','login','name']})}

    async create(userData, transaction = null) {return await User.create(userData, {transaction})}
    async update(id, userData, transaction = null){ 
        const [count, raws] = await User.update(userData, {
            transaction, 
            where:{user_id:id},
            returning:true
        });
        return raws[0]
    }

    async delete (id, transaction = null) {      
        const delUsr = await User.destroy({transaction,where:{user_id:id}});
        return delUsr;
    }
// admin repository

    async getAllAdm(transaction = null) {return await User.findAll(
        {
            transaction,
            attributes:{
                exclude:['password']
            }
        })
    }//только админ

    async getByIdAdm(id, transaction = null) {return await User.findByPk(id,{transaction, attributes:{exclude:['password']}})}// личный запрос/ админ

    async getByEmailAdm(email, transaction = null) {return await User.findOne({transaction, where:{email},attributes:{exclude:['password']}})}//только админ

    async getByLoginAdm(login, transaction = null) {return await User.findOne({transaction, where:{login}, attributes:{exclude:['password']}})}//только админ

    async getUserWithThings(id, transaction = null) {return await User.findByPk(id,{
        transaction,
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
    async chekLogin (login, transaction = null) {
        return await User.findOne({
            transaction,
            where:{login}, 
            attributes:[
                'user_id',
                'login',
                'password',
                'name',
                'is_admin'
            ]
            
        });
    } // для авторизации (служебная)

    async chekUsers (idArray, transaction = null) {
        return await User.findAll({
            transaction,
            where:{user_id:idArray}, 
            attributes: ['user_id']
        })
    } // проверка массива пользователей (служебная)
}

export default new UserRepository()