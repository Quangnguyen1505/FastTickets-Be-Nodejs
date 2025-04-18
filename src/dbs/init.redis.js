const Redis = require('ioredis');
const logger = require('../loggers/winston.log');

let clients = {}, statusConnectIoRedis = {
    CONNECT: "connect",
    END: "end",
    RECONNECT: "reconnecting",
    ERROR: "error"
}

const handleEventConnection = ({
    connectionRedis
}) => {
    connectionRedis.on(statusConnectIoRedis.CONNECT, () => {
        logger.info(`connection Io-redis - connection status: connected`);
    })

    connectionRedis.on(statusConnectIoRedis.END, () => {
        logger.debug(`connection Io-redis - connection status: disconnected`);
    })

    connectionRedis.on(statusConnectIoRedis.RECONNECT, () => {
        logger.info(`connection Io-redis - connection status: reconnecting`);
    })

    connectionRedis.on(statusConnectIoRedis.ERROR, (err) => {
        logger.info(`connection Io-redis - connection status: error ${err}`);
    })
}

const init = ({
    IOREDIS_IS_ENABLED,
    IOREDIS_HOST = process.env.REDIS_CACHE_HOST,
    IOREDIS_PORT = process.env.REDIS_PORT
}) => {
    if(IOREDIS_IS_ENABLED){
        if(!clients.instanceConnect){
            const instanceRedis = new Redis({
                host: IOREDIS_HOST,
                port: IOREDIS_PORT
            })
            clients.instanceConnect = instanceRedis;
            handleEventConnection({
                connectionRedis: instanceRedis
            })   
        }
        return clients.instanceConnect
    }
}

const getIoRedis = () => clients

const closeIoRedis = () => {

}

module.exports = {
    init,
    getIoRedis,
    closeIoRedis
}

