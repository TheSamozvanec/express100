import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
const User = sequelize.define('User',{
    user_id:{
        type:DataTypes.INTEGER, // целое
        primaryKey:true, // первичный ключ
        autoIncrement:true // автоинкремент (для pk)
    },
    login:{
        type:DataTypes.STRING(16),
        allowNull:false, // null - запрещен
        unique:true, // уникальный
        validate:{ // валидация
            notEmpty:true, // не пустое
            len:[3,16] // от 3 до 16 символов
        }
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false // без валидации будет хеш
    },
    name:{
        type:DataTypes.STRING(16),
        allowNull:true
    },
    email:{
        type:DataTypes.STRING(128),
        allowNull:false,
        unique:true,
        validate:{
            isEmail:true // проверка на соответствие email
        }
    },
    description:{
        type:DataTypes.STRING,
        allowNull:true
    },
    is_admin:{
        type:DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull:false,
    }
}, {
    tableName:'users', // имя таблици в базе данных
    timestamps:false, // поле времени создания (не нужно)
    underscored:true // в базе поля в snake
});

export default User