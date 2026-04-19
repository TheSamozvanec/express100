import debugLib from "debug";
import userRepository from "../repositories/user.repository.js";
//import thingRepository from "../repositories/thing.repository.js";

const debug=debugLib('exp:service:User');
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
        if (login) return ({message:'Такой пользователь уже есть! (login)'});
        const email =await userRepository.getByEmail(userData.email); 
        if (email) return ({message:'Ящик уже занят! (email)'});
        return (await userRepository.create(userData)).toJSON();
    }
    async update(id, usr, data) {
        const {password:pass, ...userData} = data
        debug('Edit User data\n', userData,'\nпопытка изменить пароль:', pass);
        if (usr.user_id!==id && !usr.is_admin) return {message:'Доступ запрещен!!!'}
        const user = await userRepository.getByIdAdm(id);
        if (!user) return {message:'Такого пользователя нет! (id)'};
        if (userData.login && userData.login !==user.login){
            const login = await userRepository.getByLogin(userData.login);
            if(login) return {message:'Такой пользователь уже есть! (login)'};
        }
        if (userData.email && userData.email !== user.email){
            const email =await userRepository.getByEmail(userData.email);
            if (email) return {message:'Ящик уже занят! (email)'};
        }
        if (!usr.is_admin) userData.is_admin=false;
        const newUser = await userRepository.update(id,userData);
        debug('Result user data\n', newUser.toJSON());
        const {password, ...result} = newUser.toJSON();
        return result
    }
    async delete(id, usr) {
        if (usr.user_id!==id && !usr.is_admin) return {message:'Доступ запрещен!!!'}
        const user = await userRepository.delete(id)
        if(!user) return {message:'Такого пользователя не существует!'};
        return user.toJSON();
    }

    async getUserWithThings(id,usr) {
        if (usr.user_id!==id && !usr.is_admin) return {message:'Доступ запрещен!!!'}
        return (await userRepository.getUserWithThings(id)).toJSON()
    }

    async getByEmail(email, usr) {
        if (!usr.is_admin) return {message:'Доступ запрещён!!!'}
        return (await userRepository.getByEmailAdm(email)).toJSON()
    }

    async getByLogin(login, usr) {
        if (!usr.is_admin) return {message:'Доступ запрещён!!!'}
        return (await userRepository.getByLoginAdm(login)).toJSON()
    }
}

export default new UserService()