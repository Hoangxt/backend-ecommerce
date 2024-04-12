const ampqlib = require('amqplib');
const { set } = require('lodash');
// .env
const amqp_Url_docker = 'amqp://localhost:5672';

async function consumerOrderedMessage() {
  const connection = await ampqlib.connect(amqp_Url_docker);
  const channel = await connection.createChannel();

  const queueName = 'orderedQueueMessage';
  await channel.assertQueue(queueName, {
    durable: true, // durable: true, the queue will survive broker restarts
  });

  // set the number of messages that the server will deliver, 1 message at a time
  // set prefetch to 1 ensure only one ack at a time
  channel.prefetch(1);

  channel.consume(queueName, (msg) => {
    const message = msg.content.toString();

    setTimeout(() => {
      console.log(`Processed: ${message}`);
      channel.ack(msg);
    }, Math.random() * 1000);
  });
}

consumerOrderedMessage().catch((err) => console.error(err));
