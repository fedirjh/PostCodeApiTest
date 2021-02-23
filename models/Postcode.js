const Sequelize = require('sequelize');
const db = require('../db');

const Postcode = db.define('Postcode', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  postcode: Sequelize.STRING(10),
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT
},{
  tableName: 'postcodes'
});

module.exports = Postcode;