const { connectToRabbitMQ, producerQueue } = require("../init.queue")

const sendMailPersonalProducer = async ({nameQueue, message, exchange, routingkey}) => {
    const { conn, channel } = await connectToRabbitMQ();
    await producerQueue({
        channel,
        nameQueue,
        message: JSON.stringify(message),
        routingkey,
        exchange
    })
}

module.exports = {
    sendMailPersonalProducer
}