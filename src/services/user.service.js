import userRepository from "../repositories/user.repository.js";
import thingRepository from "../repositories/thing.repository.js";
class UserService {
    async getAllUsers(){return await userRepository.getAllAdm()}
    async getUserById(id){
        const user = await userRepository.getByIdAdm(id);
        if(!user) throw new Error ('Такого пользователя нет!(id)');
        return user;
    }
    async createUser(userData) {
        const login = await userRepository.getByLogin(userData.login);
        if (login) throw new Error ('Такой пользователь уже есть! (login)');
        const email =await userRepository.getByEmail(userData.email); 
        if (email) throw new Error ('Ящик уже занят! (email)');
        return await userRepository.create(userData);
    }
    async updateUser(id,userData) {
        const user = await userRepository.getByIdAdm(id);
        if (!user) throw new Error ('Такого пользователя нет! (id)');
        if (userData.login && userData.login !==user.login){
            const login = await userRepository.getByLogin(userData.login);
            if(login) throw Error ('Такой пользователь уже есть! (login)');
        }
        if (userData.email && userData.email !== user.email){
            const email =await userRepository.getByEmail(userData.email);
            if (email) throw new Error ('Ящик уже занят! (email)');
        }
        const newUser = await userRepository.update(id,userData)
        const {password, ...result} = newUser.toJSON();
        return result
    }
    async deleteUser(id) {
        const user = await userRepository.getById(id)
        if(!user) return new Error ('Такого пользователя нет! (id)');
        return user
    }
    async getUserWithThings(id) {
        const user = await userRepository.getByIdAdm(id);
        if (!user) return new Error ('Такого пользователя нет! (id)');
        const things = await thingRepository.getByUser(id);
        return {...user.toJSON(), things}
    }
}

export default new UserService()