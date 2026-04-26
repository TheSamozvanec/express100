import debugLib from "debug";
import userRepository from "../repositories/user.repository.js";
import { getJWT } from "./getJWT.js";
import { sequelize } from "../config/database.js";

const debug=debugLib('exp:src:service:-USER-');
class UserService { // usr - только для выяснения прав
    async getAll(usr){
        if (usr?.is_admin) return (await userRepository.getAllAdm()).map(u=>u.toJSON());
        return (await userRepository.getAll()).map(u=>u.toJSON());
    }

    async getUById(id, usr){
        let user
        if (usr.is_admin || usr.user_id===id) {
            user = await userRepository.getByIdAdm(id);
        } else {user = await userRepository.getById(id)};
        
        if(!user) return {message:'Такого пользователя нет!(id)'};
        return user.toJSON();
    }

// попытка использовать транзакцию (вроде сработало)
    async update(id, usr, data) {
        const {password:pass, ...userData} = data

        if (+usr.user_id!==+id && !usr.is_admin) return {message:'Доступ запрещен!!!', status:403}

        const transaction = await sequelize.transaction();
        try { 
            const user = await userRepository.getByIdAdm(id, transaction);

            if (!user) throw {message:'Такого пользователя нет! (id)', status:404};

            if (userData.login && userData.login !==user.login){
                const login = await userRepository.getByLogin(userData.login, transaction);
                if(login) throw {message:'Такой пользователь уже есть! (login)', status:409};
            }

            if (userData.email && userData.email !== user.email){
                const email = await userRepository.getByEmail(userData.email, transaction);
                if (email) throw {message:'Ящик уже занят! (email)', status:409};
            }
            if (!usr.is_admin) userData.is_admin=false;
            const newUser = await userRepository.update(id, userData, transaction);
            await transaction.commit();
            const {password, ...result} = newUser?.toJSON();           
            result.pingvin = getJWT(result);
            return result

        } catch (err) { 
            await transaction.rollback();
            return err
        }        
    }
    
    async delete(id, usr) {
        if (+usr.user_id!==+id && !usr.is_admin) return {message:'Доступ запрещен!!!', status:403}
        const chek = await userRepository.getById(id);
        if (!chek) return {message:'Такого пользователя нет!', status:404}
        await userRepository.delete(id);
        return {user_id:id,user:'deleted'}
    }

    async getUserWithThings(id,usr) {
        if (usr.user_id!==id && !usr.is_admin) return {message:'Доступ запрещен!!!'}
        return (await userRepository.getUserWithThings(id))?.toJSON();
    }

    async getByEmail(email, usr) {
        if (!usr.is_admin) return {message:'Доступ запрещён!!!'} 
        return (await userRepository.getByEmailAdm(email))?.toJSON()
    }

    async getByLogin(login, usr) {
        if (!usr.is_admin) return {message:'Доступ запрещён!!!'}
        return (await userRepository.getByLoginAdm(login))?.toJSON()
    }
}

export default new UserService()