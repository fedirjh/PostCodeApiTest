const Sequelize = require('sequelize');
const db = require('../db');
const User = require('./User')

const Chat = db.define('Chat', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  from: Sequelize.INTEGER,
  to: Sequelize.INTEGER,
  message:Sequelize.TEXT,
  date: Sequelize.DATE,
  seendate: Sequelize.DATE,
},{
  tableName: 'chats'
});

User.hasMany(Chat, { foreignKey: 'from', as: 'msgsent' });
User.hasMany(Chat, { foreignKey: 'to', as: 'msginbox' });

module.exports = Chat;