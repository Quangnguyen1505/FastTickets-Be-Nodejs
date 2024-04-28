const { Sequelize } = require('sequelize');
require('dotenv').config();

const { PG_HOST, PG_USER, PG_PASSWORD, PG_DATABASE, PG_DIALECT } = process.env;

 
const sequelize = new Sequelize(PG_DATABASE, PG_USER, PG_PASSWORD, {
    host: PG_HOST,
    dialect: PG_DIALECT,
    logging: false,
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