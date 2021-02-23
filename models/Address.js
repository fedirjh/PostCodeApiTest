const Sequelize = require('sequelize');
const db = require('../db');

const Address = db.define('address', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    district: Sequelize.STRING(60),
    locality: Sequelize.STRING(60),
    street: Sequelize.STRING(60),
    site: Sequelize.STRING(60),
    site_number:Sequelize.STRING(20),
    site_description:Sequelize.STRING(60),
    site_subdescription:Sequelize.STRING(60),
    postcode_id: Sequelize.INTEGER
},{
    tableName: 'addresses'
});

module.exports = Address;