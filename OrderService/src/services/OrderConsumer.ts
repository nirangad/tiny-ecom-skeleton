import { Channel, Connection, Message } from "amqplib";
import rabbitMQ from "../common/rabbitmq/rabbitmq";

require("dotenv").config();

const orderQueue = process.env.RABBITMQ_ORDER_QUEUE || "rabbitmq@order";

async function start() {
  try {
    let rabbitInstance: {
      connection: Connection;
      channel: Channel;
      queue: string;
    };
    rabbitMQ
      .connect(orderQueue)
      .then((data) => {
        rabbitInstance = data;

        rabbitInstance.channel.consume(orderQueue, (message) => {
          if (message) {
            console.log("[ORDER CONSUMER] Message acknwolegded: ", message);
            rabbitInstance.channel.ack(message as Message);
            console.log(
              "[ORDER CONSUMER] Message content: ",
              JSON.parse(message.content.toString())
            );
          }
        });
      })
      .catch((err) => {
        console.error("[ORDER CONSUMER] Error at Promise: ", err);
        process.exit(1);
      });
  } catch (err) {
    console.error("[ORDER CONSUMER] Error at catch block ", err);
    process.exit(1);
  }
}

start();
