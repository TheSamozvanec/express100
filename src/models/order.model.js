import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Customer from "./customer.model.js";
const Order = sequelize.define('Order',{
    orderId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    customerId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Customer,
            key:'customer_id',
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
    },
    description:{
        type:DataTypes.STRING,
        allowNull:true
    },
    amount: {
        type:DataTypes.DECIMAL(12,2),
        allowNull:false,
        defaultValue: 0,
        validate:{
            min:0
        }
    },
    status:{
        type:DataTypes.ENUM('created','processing','completed','canceled'),
        allowNull:false,
        defaultValue:'created'       
    }
}, {
    tableName:'orders',
    timestamps:false,
    underscored:true
});

Customer.hasMany(Order,{foreignKey:'customer_id',onDelete:'CASCADE'});
Order.belongsTo(Customer,{foreignKey:'customer_id'});

export default Order