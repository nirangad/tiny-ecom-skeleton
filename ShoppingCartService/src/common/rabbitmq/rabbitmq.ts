import ampq from "amqplib";

const rabbitMQ = {
  connect: async (queue: string, url?: string) => {
    const rabbitConnectionURL = url
      ? url
      : process.env.RABBITMQ_URL ?? "amqp://localhost:5672";

    const rabbitConnection = await ampq.connect(rabbitConnectionURL);
    const rabbitChannel = await rabbitConnection.createChannel();
    await rabbitChannel.assertQueue(queue);
    return { connection: rabbitConnection, channel: rabbitChannel };
  },
};
export default rabbitMQ;
