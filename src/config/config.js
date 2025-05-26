require('dotenv').config();

const { PG_HOST ,PG_USER, PG_PASSWORD, PG_DATABASE, PG_DIALECT, PG_PORT } = process.env;
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
        payment: {
            accessKey: 'F8BBA842ECF85',
            secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
            orderInfo: 'pay with MoMo',
            partnerCode: 'MOMO',
            redirectUrl: 'http://localhost:3000/payment-success',
            ipnUrl: 'https://edac-2402-800-63eb-1ecf-d0c4-78b4-aa1f-3dcd.ngrok-free.app/v1/api/payment/callback', 
            requestType: 'payWithMethod',
            extraData: '',
            orderGroupId: '',
            autoCapture: true,
            lang: 'vi',
        }
    }
}