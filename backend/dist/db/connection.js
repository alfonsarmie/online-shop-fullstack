"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize_1 = require("sequelize");
const db = new sequelize_1.Sequelize(process.env.DB_NAME || 'online_shop_fullstack_rowing', process.env.DB_USERNAME || '', process.env.DB_PASSWORD || '', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
});
const connectDB = async () => {
    try {
        await db.authenticate();
        console.log('Database connection established.');
    }
    catch (error) {
        console.error('Could not connect to database:', error);
    }
};
exports.connectDB = connectDB;
exports.default = db;
//# sourceMappingURL=connection.js.map