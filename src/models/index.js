import { sequelize } from "../config/database.js";
import User from "./user.model.js";
import Thing from "./thing.model.js";
import Customer from "./customer.model.js";
import Order from "./order.model.js";
import Product from "./product.model.js";
import OrderProduct from "./orderProduct.model.js";

export {sequelize, User, Thing, Customer, Order, Product, OrderProduct}
