const Sequelize = require('sequelize');
const db = require('../db');
const User = require('./User')
const Postcode = require('./Postcode')
const Address = require('./Address')

const House = db.define('House', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  user_id: Sequelize.INTEGER,
  postcode_id: Sequelize.INTEGER,
  address_id: Sequelize.INTEGER,
  updated: Sequelize.DATE,
  propertytype: Sequelize.TINYINT,
}, {
  tableName: 'houses'
});

House.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(House, { foreignKey: 'user_id', as: 'house' });

House.belongsTo(Postcode, { foreignKey: 'postcode_id', as: 'postcode' })
Postcode.hasMany(House, { foreignKey: 'postcode_id', as: 'house' });

House.belongsTo(Address, { foreignKey: 'address_id', as: 'address' })
Address.hasOne(House, { foreignKey: 'address_id', as: 'house' });

module.exports = House;