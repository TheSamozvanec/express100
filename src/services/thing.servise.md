Доработка!
В админскую ручку createMany необходимо сделать транзакцию: 
1 - создать транзакцию (sequelize.transactiom())
2 - создать коллекцию Set чтобы исключить попвторения ID пользователей для которых создаются вещи (Set только для проверки наличия пользователей)
3 - отправить Set на проверку в chekUsers с транзакцией (необходима ручка в user.repository.js)
4 - сравнить Set и ответ, если есть отклонения - rollback и отпарвка ошибки в виде массива не существующих польтзователей
5 - отправить массив вещей (не Set, а именно исходник!) для создания
6 - commit() 
7 - ответ

Примерный код

async createMany(thingsArray, currentUser) {
    const transaction = await sequelize.transaction();
    try {
        // Проверки (можно делать в рамках транзакции)
        const prepared = await this.prepareThings(thingsArray, transaction);
        const created = await thingRepository.createMany(prepared, transaction);
        await transaction.commit();
        return created;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

// thing.repository.js
async createMany(thingsArray, transaction = null) {
    return await Thing.bulkCreate(thingsArray, { transaction });
}

Проверка пользователей (код необходимо разграничить по ответственности, часть кода внести в репозиторий user.repository)

const userIds = [...new Set(thingsArray.map(t => t.user_id))];
const users = await User.findAll({ // эту часть вынес в репозиторий!
    where: { user_id: userIds },
    attributes: ['user_id'],
    transaction
});
        
const existingIds = users.map(u => u.user_id);
const missingIds = userIds.filter(id => !existingIds.includes(id));
        
if (missingIds.length > 0) {
    throw new Error(`Пользователи с ID ${missingIds.join(', ')} не найдены`);
}

Есть идея, снабдить все ручки репозиториев возможностью транзакций по примеру приведенному выше для createMany()