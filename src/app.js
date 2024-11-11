const express = require('express');
const app = express();
require('dotenv').config();
var morgan = require('morgan');
var helmet =require('helmet');
var compression = require('compression')
const cors = require('cors');
const dbconn = require('./db/init.postgresql');
const cookieParser = require('cookie-parser')
const swaggerUi = require('swagger-ui-express');


//init middelwares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
// app.use(cors({
//     origin: 'http://localhost:4200', 
//     credentials: true 
// }));
app.use(cors({
    origin: '*', 
    credentials: true 
}));
app.use(cookieParser());

//init swagger ui
const { openApiDoc } = require('./config/swaggerDoc.config');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));

//init db
dbconn();

//init passport
require('./config/passportAuth.config');

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