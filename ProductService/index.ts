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
  process.env.MONGODB_URL ?? "mongodb://localhost:27017/product-service";
mongoose.connect(mongoDBURL, () => {
  console.log(`Product Service DB connected`);
});

app.listen(port, async () => {
  console.log(`Product Service listening on port ${port}`);
});

// Express Routes
app.get("/product", isAuthenticated, (req, res) => {
  return res.json({ status: 1, message: req.t("PRODUCT.WELCOME") });
});

app.get("/product/all", isAuthenticated, async (req, res) => {
  Product.find({}, (err: any, products: any) => {
    if (err) {
      return res.status(500).json({ status: 0, message: req.t("HTTP_500") });
    }
    return res.json({ status: 1, message: products });
  });
});

app.get("/product/:id", isAuthenticated, validateId, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json({ status: 1, message: product });
  }
  return res.json({ status: 0, message: req.t("PRODUCT.ERROR.NO_PRODUCT") });
});

app.delete("/product/:id", isAuthenticated, validateId, async (req, res) => {
  Product.deleteOne(
    { _id: req.params.id },
    (err: any, data: { deletedCount: number }) => {
      if (err) {
        return res.json({
          status: 0,
          message: req.t("HTTP_500"),
        });
      }

      if (data.deletedCount == 0) {
        return res.json({
          status: 0,
          message: req.t("PRODUCT.ERROR.NO_PRODUCT"),
        });
      }

      return res.json({
        status: 1,
        message: `${req.t("PRODUCT.DELETED")}: ${req.params.id}`,
      });
    }
  );
});

app.post(
  "/product",
  isAuthenticated,
  body("*.*").escape(),
  async (req, res) => {
    const productPayload = req.body.product;
    Product.create(productPayload, (err: any, product: any) => {
      if (err) {
        res.status(400);
        if (err.code == 11000) {
          return res.json({
            status: 0,
            message: {
              error: req.t("PRODUCT.ERROR.UNIQUE_FIELDS"),
              fields: err.keyValue,
            },
          });
        }
        return res.json({ status: 0, message: req.t("HTTP_500") });
      }
      return res.json({ status: 1, message: product });
    });
  }
);

app.put(
  "/product/:id",
  isAuthenticated,
  validateId,
  body("*.*").escape(),
  async (req, res) => {
    const productPayload = req.body.product;
    Product.findOne({ _id: req.params!.id }, (err: any, product: any) => {
      if (err) {
        return res.status(500).json({ status: 0, message: req.t("HTTP_500") });
      }

      if (!product) {
        return res.status(404).json({
          status: 0,
          message: req.t("PRODUCT.ERROR.NO_PRODUCT"),
        });
      }

      Object.keys(productPayload).forEach(function (key) {
        if (productPayload[key] !== null || productPayload[key] !== undefined) {
          product[key] = productPayload[key];
        }
      });

      product.save((err: any, product: any) => {
        if (err) {
          res.status(500);
          if (err.code == 11000) {
            return res.json({
              status: 0,
              message: {
                error: req.t("PRODUCT.ERROR.UNIQUE_FIELDS"),
                fields: err.keyValue,
              },
            });
          }
          return res.json({ status: 0, message: req.t("HTTP_500") });
        }
        return res.json({ status: 1, message: product });
      });
    });
  }
);
