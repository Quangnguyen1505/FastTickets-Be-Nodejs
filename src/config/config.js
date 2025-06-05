require('dotenv').config();

const { 
    PG_HOST,
    PG_USER, 
    PG_PASSWORD, 
    PG_DATABASE, 
    PG_DIALECT, 
    PG_PORT,
    URL_RABBITMQ,
    URL_HOST_GRPC_SERVER,
    MOMO_ACCESS_KEY,
    MOMO_SECRET_KEY,
    MOMO_PARTNER_CODE,
    MOMO_REDIRECT_URL,
    MOMO_IPN_URL
} = process.env;
module.exports = {
    development: {
        username: PG_USER,
        password: PG_PASSWORD,
        database: PG_DATABASE,
        host: PG_HOST,
        port: PG_PORT,
        dialect: PG_DIALECT,
        logging: false,
        timezone: '+07:00',
        role_user: 1,
        urlRabbitMQ: URL_RABBITMQ,
        urlHostGrpcServer: URL_HOST_GRPC_SERVER,
        payment: {
            accessKey: MOMO_ACCESS_KEY,
            secretKey: MOMO_SECRET_KEY,
            orderInfo: 'pay with MoMo',
            partnerCode: MOMO_PARTNER_CODE,
            redirectUrl: MOMO_REDIRECT_URL,
            ipnUrl: MOMO_IPN_URL,
            requestType: 'payWithMethod',
            extraData: '',
            orderGroupId: '',
            autoCapture: true,
            lang: 'vi',
        }
    }
}