//Create user model sequelize
const { DataTypes } = require('sequelize');

const { db } = require('../db/connection');



// Define the user model
const User = db.define('user', {
    idUser: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    dni: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    imgProfile: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    isMember: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    registrationDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(150),
        allowNull: false
    }
}, {
    tableName: 'user',
    timestamps: false // Disable createdAt and updatedAt fields
});

User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
};


module.exports = User;


