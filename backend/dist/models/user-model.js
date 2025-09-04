"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class User extends sequelize_1.Model {
    toJSON() {
        const values = Object.assign({}, this.get());
        delete values.password; // Delete password from the object
        return values;
    }
}
User.init({
    idUser: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    dni: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    surname: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    imgProfile: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    role: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'client'
    },
    isMember: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    registrationDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    status: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: false,
        defaultValue: 'pending'
    }
}, {
    sequelize: connection_1.default,
    tableName: 'user',
    timestamps: false
});
exports.default = User;
//# sourceMappingURL=user-model.js.map