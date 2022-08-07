import express from "express";
import { body } from "express-validator";
import dotenv from "dotenv";
import mongoose from "mongoose";

import rabbitMQ from "./common/rabbitmq/rabbitmq";
import logger from "./common/logger/logger";
import fetchCurrentUser from "./common/mongo/fetchCurrentUser";
import i18nextexpress from "./common/locales/localize";
import isAuthenticated from "@nirangad/is-authenticated";

import ShoppingCart from "./models/ShoppingCart.model";
import shoppingCartService from "./services/ShoppingCart.service";

// DotEnv Configuration
dotenv.config();

// Express Server
const port = process.env.SERVER_PORT ?? 8082;
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
  return res.json({ status: 1, message: req.t("SHOPPING_CART.WELCOME") });
});

app.get(
  "/shopping-cart/active",
  isAuthenticated,
  fetchCurrentUser,
  async (req: any, res) => {
    const currentUser = req.currentUser;
    ShoppingCart.findOne(
      { user: currentUser._id },
      (err: any, shoppingCart: any) => {
        if (err) {
          return res
            .status(500)
            .json({ status: 0, message: req.t("HTTP_500") });
        }

        if (!shoppingCart) {
          return res
            .status(404)
            .json({ status: 0, message: req.t("SHOPPING_CART.ERROR.NO_CART") });
        }
        return res.json({ status: 1, message: { shoppingCart } });
      }
    );
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
    shoppingCartService
      .remove(currentUser)
      .then((data: { deletedCount: number }) => {
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
      });
  }
);
