update работает без транзакции - необходима транзакция на уровне service и удаление ненужного кода в репозитории!!!

const user = await User.findByPk(id);
        if(!user) return null;

Этот код лишний егонеобходимо реализовать в service в транзакции

delete тоже самое!!!