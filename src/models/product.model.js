import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
const Product = sequelize.define('Product',{
    productId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING(16),
        allowNull:false
    },
    price:{
        type:DataTypes.DECIMAL(12,12),
    },
    description:{
        type:DataTypes.STRING,
        allowNull:true
    },
}, {
    tableName:'products',
    timestamps:false,
    underscored:true
});

export default Product