const express = require('express');
const app = express();
require('dotenv').config();
var morgan = require('morgan');
var helmet =require('helmet');
var compression = require('compression')
const cors = require('cors');
const dbconn = require('./dbs/init.postgresql');
const cookieParser = require('cookie-parser')
const swaggerUi = require('swagger-ui-express');
const initIoRedis = require('./dbs/init.redis');
const { connectToRabbitMQ } = require('./queue/init.queue');

//init middelwares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

app.use(cors({
    origin: '*', 
    credentials: true 
}));
app.use(cookieParser());

//init swagger ui
const { openApiDoc } = require('./config/swaggerDoc.config');
const { producerSendToExchange } = require('./queue/services/sendMailBooking');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));

//init db
dbconn();

//init db
initIoRedis.init({
    IOREDIS_IS_ENABLED: true
})

//init rabbitmq
connectToRabbitMQ()

//init passport
require('./config/passportOAuth-gg.config');
require('./config/passportOauth-fb.config');

//init routes
app.use('/', require('./routes'))

//handling error
app.use(( req, res, next ) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use(( error, req, res, next ) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: "error",
        message: error.message,
        stack: error.stack,
        code: statusCode
    })
});

module.exports = app;