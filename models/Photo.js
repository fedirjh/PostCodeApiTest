const Sequelize = require('sequelize');
const db = require('../db');

const Photo = db.define('Photo', {
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
  tableName: 'photos'
});

module.exports = Photo;