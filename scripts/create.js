import { sequelize } from '../src/config/database.js';
import debugLib from 'debug';
import '../src/models/index.js'; // импортируем модели для регистрации

const debug = debugLib('exp:create');

async function syncDatabase() {
  try {
    // force: true - удаляет существующие таблицы и создаёт заново
    // ВНИМАНИЕ! Удалит ВСЕ данные!
    await sequelize.sync({ force: true });
    
    debug('✅ База данных синхронизирована!');
    debug('📋 Таблицы созданы:', await sequelize.getQueryInterface().showAllTables());
    
  } catch (error) {
    debug('❌ Ошибка синхронизации:', error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

syncDatabase();