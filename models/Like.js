const Sequelize = require('sequelize');
const db = require('../db');
const User = require('./User')

const Like = db.define('Like', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  a: Sequelize.INTEGER,
  b: Sequelize.INTEGER,
  like: Sequelize.TINYINT,
  date: Sequelize.DATE,
},{
  tableName: 'likes'
});

User.hasMany(Like, { foreignKey: 'a', as: 'likes' });
User.hasMany(Like, { foreignKey: 'b', as: 'liked' });

module.exports = Like;