require('dotenv').config();
const { PG_HOST ,PG_USER, PG_PASSWORD, PG_DATABASE, PG_DIALECT } = process.env;
module.exports = {
    development: {
        username: PG_USER,
        password: PG_PASSWORD,
        database: PG_DATABASE,
        host: PG_HOST,
        dialect: PG_DIALECT,
        logging: false,
        timezone: '+07:00'
    }
}