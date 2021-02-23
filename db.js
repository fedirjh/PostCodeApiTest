const Sequelize = require('sequelize');
const config = require('./config');

module.exports =  new Sequelize(config.DB, config.DB_USER, config.DB_PASS, {
  host: config.DB_URI,
  dialect: config.DB_TYPE,
  define: {
    timestamps: false,
    freezeTableName: true
  },
});