const Sequelize = require('sequelize');
const db = require('../db');
const User = require('./User')

const People = db.define('People', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    user_id: Sequelize.INTEGER,
    age: Sequelize.INTEGER,
    sex: Sequelize.CHAR(3)
},{
    tableName: 'people'
});

People.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(People, { foreignKey: 'user_id', as: 'people' });

module.exports = People;