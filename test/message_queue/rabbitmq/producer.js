const ampqlib = require('amqplib');
const { set } = require('lodash');
// .env
const amqp_Url_docker = 'amqp://localhost:5672';

const messages = 'New a product: Title - Iphone 12, Price - 1000$';

const runProducer = async () => {
  try {
    const connection = await ampqlib.connect(amqp_Url_docker);
    const channel = await connection.createChannel();

    const queueName = 'test-topic';
    await channel.assertQueue(queueName, { durable: false });

    // send message to queue
    await channel.sendToQueue(queueName, Buffer.from(messages));
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
