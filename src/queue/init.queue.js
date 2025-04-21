const amqp = require('amqplib');

let conn = null;
let channel = null;

const connectToRabbitMQ = async () => {
    try {
        if (conn && channel) return { conn, channel };
        conn = await amqp.connect('amqp://guest:guest@localhost:5672');
        // const conn = await amqp.connect({
        //     protocol: 'amqp',
        //     hostname: '34.142.197.249',
        //     port: 30001,
        //     username: 'guest',
        //     password: 'guest', // Đảm bảo mật khẩu chính xác
        //     vhost: '/',
        //   });
        if(!conn) throw new Error('Connection not established')

        channel = await conn.createChannel();
        console.log("connect rabbitmq success")
        return {conn, channel}
        
    } catch (error) {
        console.error(error);
    }
}

const consumerQueue = async ({ channel, nameQueue }) => {
    try {
        await channel.assertQueue(nameQueue, {
            durable: true
        });
        console.log("Waiting for message.... ");
        channel.consume(nameQueue, ( msg ) => {
            console.log(`Message received:: ${nameQueue}::`, msg.content.toString());
        }, {
            noAck: true
        })
    } catch (error) {
        console.error(error);        
    }
}

const producerQueue = async ({ channel, nameQueue, message, exchange, routingkey }) => {
    try {
        await channel.assertExchange(exchange, 'direct', {
            durable: true
        });

        await channel.assertQueue(nameQueue, {
            durable: true
        });

        await channel.bindQueue(nameQueue, exchange, routingkey);

        channel.publish(exchange, routingkey, Buffer.from(message), {
            persistent: true
        });

        console.log(`✅ Message sent to exchange [${exchange}] with routingKey [${routingkey}]:`, message);

        // setTimeout(() => {
        //     conn.close();
        //     process.exit(0);
        // }, 500);
    } catch (error) {
        console.error("❌ Producer error:", error);
    }
};

module.exports = {
    connectToRabbitMQ,
    consumerQueue,
    producerQueue
}