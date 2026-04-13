import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
const User = sequelize.define('User',{
    userId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    login:{
        type:DataTypes.STRING(16),
        allowNull:false,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
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
            isEmail:true
        }
    },
    description:{
        type:DataTypes.STRING,
        allowNull:true
    },
}, {
    tableName:'users',
    timestamps:false,
    underscored:true
});

export default User