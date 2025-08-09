//Create client model sequelize
const { DataTypes } = require('sequelize');

const { db } = require('../db/connection');



// Define the client model
const client = db.define('client', {
    idClient: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    userName: {
        type: DataTypes.STRING(255),
        allowNull: false
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
    }
}, {
    tableName: 'client',
    timestamps: false // Disable createdAt and updatedAt fields
});

module.exports = client;


