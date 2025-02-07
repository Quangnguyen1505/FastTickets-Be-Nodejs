const { Sequelize } = require('sequelize');
require('dotenv').config();

const { database, dialect, host, password, username } = require('../config/config');

const sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: dialect,
    logging: (msg) => {
      console.log(`Sequelize log: ${msg}`); // Log thông tin của Sequelize
  },
    timezone: '+07:00'
});

const dbconn = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

module.exports = dbconn