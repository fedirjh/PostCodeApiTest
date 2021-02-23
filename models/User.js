const Sequelize = require('sequelize');
const db = require('../db');
const House = require('./User')

const User = db.define('User', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(80),
        defaultValue: ''
    },
    surname: {
        type: Sequelize.STRING(80),
        defaultValue: ''
    },
    email: {
        type: Sequelize.STRING(80),
        defaultValue: ''
    }
}, {
    tableName: 'users'
});

module.exports = User;