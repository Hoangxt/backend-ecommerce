const ampqlib = require('amqplib');
const { set } = require('lodash');
// .env
const amqp_Url_docker = 'amqp://localhost:5672';

const messages = 'New a product: Title - Iphone 12, Price - 1000$';

const runProducer = async () => {
  try {
    const connection = await ampqlib.connect(amqp_Url_docker);
    const channel = await connection.createChannel();
    // notification-exchange direct
    const notificationExchange = 'notificationExchange';
    // assertQueue
    const notiQueue = 'notificationQueueProcess';
    const notificationExchangeDLX = 'notificationExchangeDLX';
    // routingKey
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';

    // 1. create Exchange
    await channel.assertExchange(notificationExchange, 'direct', {
      durable: true, // durable: true, the exchange will survive broker restarts
    });

    // 2. create Queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false, // cho phép các kết nối truy cập vào hàng đợi cùng một lúc
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });

    // 3. bind Queue to Exchange
    await channel.bindQueue(
      queueResult.queue,
      notificationExchange,
      'notificationRoutingKey'
    );

    // 4. send message to queue

    await channel.sendToQueue(queueResult.queue, Buffer.from(messages), {
      expiration: 10000,
    });

    console.log(`Sent message: ${messages}`);
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 1000);
  } catch (error) {
    console.log('Error: ', error.message);
  }
};

runProducer();
