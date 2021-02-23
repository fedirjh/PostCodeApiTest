const Sequelize = require('sequelize');
const db = require('../db');

const Busstop = db.define('busstop', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: Sequelize.STRING(10),
    lat: Sequelize.DECIMAL(11, 8),
    lon: Sequelize.DECIMAL(11, 8)
},{
    tableName: 'busstops'
});

module.exports = Busstop;