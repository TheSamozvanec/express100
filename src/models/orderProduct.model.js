import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Order from "./order.model.js";
import Product from "./product.model.js";

const OrderProduct = sequelize.define('OrderProduct',{
    productId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        references:{
            model:Product,
            key:'product_id',
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
    },
    orderId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        references:{
            model:Order,
            key:'order_id'
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
    },
    quantity: {
        type:DataTypes.INTEGER,
        defaultValue:1,
        allowNull:false,
        validate:{
            min:0
        }
    },
}, {
    tableName:'order_product',
    timestamps:false,
    underscored:true
});

Product.hasMany(OrderProduct,{foreignKey:'product_id',onDelete:'CASCADE'});
OrderProduct.belongsTo(Product,{foreignKey:'product_id'});

Order.hasMany(OrderProduct,{foreignKey:'order_id',onDelete:'CASCADE'});
OrderProduct.belongsTo(Order,{foreignKey:'order_id'});


export default OrderProduct