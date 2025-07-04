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
    URL_PORT_SERVER_GRPC,
    MOMO_ACCESS_KEY,
    MOMO_SECRET_KEY,
    MOMO_PARTNER_CODE,
    MOMO_REDIRECT_URL,
    MOMO_IPN_URL,
    VNPAY_SECURE_SECRET,
    VNPAY_TMN_CODE,
    VNPAY_IP_ADDR,
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
        urlPortServerGrpc: URL_PORT_SERVER_GRPC,
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
        },
        paymentVnpay: {
            tmnCode: VNPAY_TMN_CODE,
            secureSecret: VNPAY_SECURE_SECRET,
            vnpayHost: 'https://sandbox.vnpayment.vn',
            queryDrAndRefundHost: 'https://sandbox.vnpayment.vn',
            hashAlgorithm: 'SHA512',
            endpoints: {
                paymentEndpoint: 'paymentv2/vpcpay.html',
                queryDrRefundEndpoint: 'merchant_webapi/api/transaction', // Endpoint tra cứu & hoàn tiền
                getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list', // Endpoint lấy danh sách ngân hàng
            },
            vnp_IpAddr: VNPAY_IP_ADDR,
        }
    }
}