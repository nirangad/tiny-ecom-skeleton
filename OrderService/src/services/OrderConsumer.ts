import { Channel, Connection, Message } from "amqplib";
import mongoose from "mongoose";
import rabbitMQ from "../common/rabbitmq/rabbitmq";
import orderService from "./Order.service";

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
            rabbitInstance.channel.ack(message as Message);
            const { shoppingCart, user } = JSON.parse(
              message.content.toString()
            );
            console.log(
              "[ORDER CONSUMER] Message read: ",
              "Shopping Cart: ",
              shoppingCart._id,
              ", User: ",
              user._id
            );
            orderService.create(shoppingCart, user);
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

// MongoDB Connection
const mongoDBURL =
  process.env.ORDER_MONGODB_URL ?? "mongodb://localhost:27017/order-service";
mongoose.connect(mongoDBURL, () => {
  console.log(`Consumer connected to Order DB`);
});

start();
