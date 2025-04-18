const { Sequelize } = require('sequelize');
const logger = require('../loggers/winston.log');
require('dotenv').config();

// const { database, dialect, host, password, username } = require('../config/config');
const { PG_HOST, PG_USER, PG_PASSWORD, PG_DATABASE, PG_DIALECT } = process.env;

const sequelize = new Sequelize(PG_DATABASE, PG_USER, PG_PASSWORD, {
  host: PG_HOST,
  dialect: PG_DIALECT,
  logging: (msg) => {
    console.log(`Sequelize log: ${msg}`); // Log thông tin của Sequelize
  },
    timezone: '+07:00',
});

const dbconn = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        logger.info(`Connection has been established successfully.`);
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        logger.error(`Unable to connect to the database ${error}`);
      }
}

module.exports = dbconn