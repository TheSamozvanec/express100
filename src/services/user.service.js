import debugLib from "debug";
import userRepository from "../repositories/user.repository.js";

const debug=debugLib('exp:src:service:User');
class UserService {
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

    async create(newUser) {
        const {is_admin, ...userData} = newUser // удаляем попытку создать админа
        debug('userData:\n',newUser);
        const login = await userRepository.getByLogin(userData.login);
        if (login) return ({message:'Такой пользователь уже есть! (login)', status:409});
        const email =await userRepository.getByEmail(userData.email); 
        if (email) return ({message:'Ящик уже занят! (email)', status:409});
        return (await userRepository.create(userData)).toJSON();
    }

    async update(id, usr, data) {
        const {password:pass, ...userData} = data
        if (usr.user_id!==id && !usr.is_admin) return {message:'Доступ запрещен!!!', status:403}
        const user = await userRepository.getByIdAdm(id);
        if (!user) return {message:'Такого пользователя нет! (id)', status:404};
        if (userData.login && userData.login !==user.login){
            const login = await userRepository.getByLogin(userData.login);
            if(login) return {message:'Такой пользователь уже есть! (login)', status:409};
        }
        if (userData.email && userData.email !== user.email){
            const email =await userRepository.getByEmail(userData.email);
            if (email) return {message:'Ящик уже занят! (email)', status:409};
        }
        if (!usr.is_admin) userData.is_admin=false;
        const newUser = await userRepository.update(id,userData);
        const {password, ...result} = newUser.toJSON();
        return result
    }
    
    async delete(id, usr) {
        if (+usr.user_id!==+id && !usr.is_admin) return {message:'Доступ запрещен!!!', status:403}
        const user = await userRepository.delete(id)
        if(!user) return {message:'Такого пользователя не существует!', status:404};
        return user.toJSON();
    }

    async getUserWithThings(id,usr) {
        if (usr.user_id!==id && !usr.is_admin) return {message:'Доступ запрещен!!!'}
        return (await userRepository.getUserWithThings(id))?.toJSON()
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