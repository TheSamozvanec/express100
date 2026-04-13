import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
const Customer = sequelize.define('Customer',{
    customerId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING(16),
        allowNull:false
    },
    email:{
        type:DataTypes.STRING(128),
        allowNull:false,
        unique:true,
        validate:{
            isEmail:true
        }
    },
}, {
    tableName:'customers',
    timestamps:false,
    underscored:true
});

export default Customer