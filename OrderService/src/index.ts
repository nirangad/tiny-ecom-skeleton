import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Connection, Channel } from "amqplib";

import rabbitMQ from "./common/rabbitmq/rabbitmq";
import logger from "./common/logger/logger";
import fetchCurrentUser from "./common/mongo/fetchCurrentUser";
import i18nextexpress from "./common/locales/localize";
import isAuthenticated from "@nirangad/is-authenticated";

// DotEnv Configuration
dotenv.config();

// Express Server
const port = process.env.ORDER_SERVER_PORT ?? 8082;
const app = express();
app.use(express.json());

// Localization
app.use(i18nextexpress);

// Logger
app.use(logger());

// RabbitMQ connection
let rabbitInstance: { connection: Connection; channel: Channel; queue: string };
rabbitMQ
  .connect(process.env.RABBITMQ_ORDER_QUEUE ?? "rabbitmq@order")
  .then((data) => {
    rabbitInstance = data;
  });

// MongoDB Connection
const mongoDBURL =
  process.env.ORDER_MONGODB_URL ??
  "mongodb://localhost:27017/order-service";
mongoose.connect(mongoDBURL, () => {
  console.log(`Order DB connected`);
});

app.listen(port, async () => {
  console.log(`Order Service listening on port ${port}`);
});