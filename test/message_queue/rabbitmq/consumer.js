const ampqlib = require('amqplib');
// .env
const amqp_Url_docker = 'amqp://localhost:5672';

const receiveQueue = async () => {
  try {
    // 1. connect to RabbitMQ server
    const conn = await ampqlib.connect(amqp_Url_docker);
    // 2. create channel
    const channel = await conn.createChannel();
    // 3. create name queue
    const nameQueue = 'test-topic';
    // 4. create queue
    await channel.assertQueue(nameQueue, { durable: false }); // durable: true => queue is persistent
    // 5. send message to queue
    await channel.consume(
      nameQueue,
      (msg) => {
        console.log(`Received message: ${msg.content.toString()}`);
      },
      {
        // ack một client đã nhận được message hay chưa
        noAck: true, // noAck: true => auto send ack to RabbitMQ server
      }
    );
    // 6. close conn and channel
    await channel.close();
  } catch (error) {
    console.log('Error: ', error.message);
  }
};

receiveQueue();
