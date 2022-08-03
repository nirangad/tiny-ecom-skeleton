import express from "express";
import { body } from "express-validator";
import dotenv from "dotenv";
import mongoose from "mongoose";

import rabbitMQ from "./common/rabbitmq/rabbitmq";
import logger from "./common/logger/logger";
import validateId from "./common/mongo/idValidation";
import i18nextexpress from "./common/locales/localize";
import isAuthenticated from "@nirangad/is-authenticated";

import Product from "./models/Product.model";

// DotEnv Configuration
dotenv.config();

// Express Server
const port = process.env.SERVER_PORT ?? 8081;
const app = express();
app.use(express.json());

// Localization
app.use(i18nextexpress);

// Logger
app.use(logger());

// RabbitMQ connection
rabbitMQ.connect(process.env.RABBITMQ_PRODUCT_QUEUE ?? "rabbitmq@product");

// MongoDB Connection
const mongoDBURL =
  process.env.MONGODB_URL ?? "mongodb://localhost:27017/shopping-cart-service";
mongoose.connect(mongoDBURL, () => {
  console.log(`Shopping Cart DB connected`);
});

app.listen(port, async () => {
  console.log(`Shopping Cart Service listening on port ${port}`);
});

// Express Routes
app.get("/shopping-cart", isAuthenticated, (req, res) => {
  return res.json({ status: 1, message: req.t("SHOPPINGCART.WELCOME") });
});

app.post("/shopping-cart", isAuthenticated, body("*.*").escape(), async (req, res) => {
  const productPayload = req.body.product;
  return res.json({ status: 1, message: "Welcome to Product create Service" });
});
