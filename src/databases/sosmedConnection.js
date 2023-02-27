const Sequelize = require('sequelize');
const config = require('../config/config.json')

const {
    host,
    port,
    username,
    password,
    database,
    dialect,
} = config.sosmedConnection

const sosmedConnection = new Sequelize(database, username, password, {
    host: host,
    port: port,
    dialect: dialect
})

module.exports = sosmedConnection