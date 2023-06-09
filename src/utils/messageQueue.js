const amqplib = require("amqplib");
const { MESSAGE_BROKER_URL, EXCHANGE_NAME } = require("../config/serverConfig");

const createChannel = async () => {
  try {
    // Setup a connection to the rabbitMQ server
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    // Create a channel
    const channel = await connection.createChannel();
    // Once the channel is created, message broker also helps to distribute the messages to message queue
    await channel.assertExchange(EXCHANGE_NAME, "direct", false); // Setup exchange distributor
    return channel;
  } catch (error) {
    console.log(error);
  }
};

const subscribeMessage = async (channel, service, binding_key) => {
  try {
    const applicationQueue = await channel.assertQueue("REMINDER_QUEUE");

    channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key); // Pass binding key

    channel.consume(applicationQueue.queue, (msg) => {
      console.log("received data");
      console.log(msg.content.toString());
      //   const payload = JSON.parse(msg.content.toString());
      //   service(payload);
      // Acknowledge that the message has been delivered by the subscriber
      channel.ack(msg);
    });
  } catch (error) {
    throw error;
  }
};

const publishMessage = async (channel, binding_key, message) => {
  try {
    await channel.assertQueue("REMINDER_QUEUE");
    await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
  } catch (error) {
    throw error;
  }
};

module.exports = {
  subscribeMessage,
  createChannel,
  publishMessage,
};
