import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./user.model.js";
const Thing = sequelize.define('Thing',{
    thing_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:User,
            key: 'user_id'
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
    },
    name:{
        type:DataTypes.STRING(16),
        allowNull:false,
        validate:{
            notEmpty:true,
            len:[3,16]
        }
    },
    description:{
        type:DataTypes.STRING,
        allowNull:true
    },
},{
    tableName:'things',
    timestamps:false,
    underscored:true
});

User.hasMany(Thing,{foreignKey:'user_id',onDelete:'CASCADE'});
Thing.belongsTo(User,{foreignKey:'user_id'});

export default Thing