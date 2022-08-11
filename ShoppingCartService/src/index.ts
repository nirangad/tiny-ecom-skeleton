import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Connection, Channel } from "amqplib";

import rabbitMQ from "./common/rabbitmq/rabbitmq";
import logger from "./common/logger/logger";
import fetchCurrentUser from "./common/mongo/fetchCurrentUser";
import i18nextexpress from "./common/locales/localize";
import isAuthenticated from "@nirangad/is-authenticated";

import shoppingCartService from "./services/ShoppingCart.service";

// DotEnv Configuration
dotenv.config();

// Express Server
const port = process.env.SHOPPINGCART_SERVER_PORT ?? 8082;
const app = express();
app.use(express.json());

// Localization
app.use(i18nextexpress);

// Logger
app.use(logger());

const startServer = async () => {};
startServer();

// RabbitMQ connection
let rabbitInstance: { connection: Connection; channel: Channel; queue: string };
rabbitMQ
  .connect(process.env.RABBITMQ_SHOPPINGCART_QUEUE ?? "rabbitmq@shoppingcart")
  .then((data) => {
    rabbitInstance = data;
  });

// MongoDB Connection
const mongoDBURL =
  process.env.SHOPPINGCART_MONGODB_URL ??
  "mongodb://localhost:27017/shopping-cart-service";
mongoose.connect(mongoDBURL, () => {
  console.log(`Shopping Cart DB connected`);
});

app.listen(port, async () => {
  console.log(`Shopping Cart Service listening on port ${port}`);
});

// Express Routes
app.get("/shopping-cart", isAuthenticated, (req, res) => {
  return res.json({ status: 1, message: req.t("SHOPPING_CART.WELCOME") });
});

app.get(
  "/shopping-cart/active",
  isAuthenticated,
  fetchCurrentUser,
  async (req: any, res) => {
    const currentUser = req.currentUser;
    const shoppingCart = await shoppingCartService.read(currentUser);
    if (!shoppingCart) {
      return res
        .status(404)
        .json({ status: 0, message: req.t("SHOPPING_CART.ERROR.NO_CART") });
    }

    return res.json({ status: 1, message: { shoppingCart } });
  }
);

app.post(
  "/shopping-cart",
  isAuthenticated,
  fetchCurrentUser,
  async (req: any, res) => {
    const currentUser = req.currentUser;
    let shoppingCart;
    let shoppingCartData = {
      user: currentUser,
      items: req.body.shoppingCart,
    };
    shoppingCart = await shoppingCartService.create(shoppingCartData);

    if (!shoppingCart) {
      return res.status(500).json({ status: 0, message: req.t("HTTP_500") });
    }

    return res.json({
      status: 1,
      message: shoppingCart,
    });
  }
);

app.put(
  "/shopping-cart",
  isAuthenticated,
  fetchCurrentUser,
  async (req: any, res) => {
    const currentUser = req.currentUser;

    const shoppingCartData = {
      id: req.body.shoppingCart.id,
      user: currentUser,
      items: req.body.shoppingCart.items,
    };

    const shoppingCart = await shoppingCartService.update(shoppingCartData);

    if (!shoppingCart) {
      return res
        .status(404)
        .json({ status: 0, message: req.t("SHOPPING_CART.ERROR.NO_CART") });
    }

    return res.json({
      status: 1,
      message: shoppingCart,
    });
  }
);

app.delete(
  "/shopping-cart",
  isAuthenticated,
  fetchCurrentUser,
  async (req: any, res) => {
    const currentUser = req.currentUser;
    const data: { deletedCount: number } = await shoppingCartService.remove(
      currentUser
    );

    if (data.deletedCount == 0) {
      return res.status(404).json({
        status: 0,
        message: req.t("SHOPPING_CART.ERROR.NO_CART"),
      });
    }

    return res.json({
      status: 1,
      message: req.t("SHOPPING_CART.CART_DELETED"),
    });
  }
);

app.post(
  "/shopping-cart/checkout",
  isAuthenticated,
  fetchCurrentUser,
  async (req: any, res) => {
    const currentUser = req.currentUser;
    const queued = await shoppingCartService.checkout(
      currentUser,
      rabbitInstance
    );

    if (!queued) {
      return res.status(404).json({
        status: 0,
        message: req.t("SHOPPING_CART.ERROR.NO_CART"),
      });
    }

    return res.json({
      status: 1,
      message: req.t("SHOPPING_CART.CHECKOUT_SUCCESS"),
    });
  }
);
