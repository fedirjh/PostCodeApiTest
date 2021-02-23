const Sequelize = require('sequelize');
const db = require('../db');

const School = db.define('School', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: Sequelize.STRING(100),
  postcode_id: Sequelize.INTEGER,
},{
  tableName: 'schools'
});

module.exports = School;