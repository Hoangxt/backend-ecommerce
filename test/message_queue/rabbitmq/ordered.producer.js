const ampqlib = require('amqplib');
// .env
const amqp_Url_docker = 'amqp://localhost:5672';

async function consumerOrderedMessage() {
  const connection = await ampqlib.connect(amqp_Url_docker);
  const channel = await connection.createChannel();

  const queueName = 'orderedQueueMessage';
  await channel.assertQueue(queueName, {
    durable: true, // durable: true, the queue will survive broker restarts
  });

  for (let i = 0; i < 10; i++) {
    const message = `Ordered-Queue-Message:: ${i}`;
    console.log(`Sent message: ${message}`);
    channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true,
    });
  }

  setTimeout(() => {
    connection.close();
  }, 1000);
}

consumerOrderedMessage().catch((err) => console.error(err));
