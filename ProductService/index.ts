import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import rabbitMQ from "./common/rabbitmq/rabbitmq";
import logger from "./common/logger/logger";
import validateId from "./common/mongo/idValidation";
import isAuthenticated from "@nirangad/is-authenticated";

import Product from "./models/Product.model";

// MongoDB Connection
const mongoDBURL = process.env.MONGODB_URL ?? "mongodb://localhost:27017";
mongoose.connect(mongoDBURL, () => {
  console.log(`Product Service DB connected`);
});

// DotEnv Configuration
dotenv.config();

// Express Server
const port = process.env.SERVER_PORT ?? 8081;
const app = express();
app.use(express.json());

// Logger
app.use(logger());

// RabbitMQ connection
rabbitMQ.connect(process.env.RABBITMQ_PRODUCT_QUEUE ?? "rabbitmq@product");

app.listen(port, async () => {
  console.log(`Product Service listening on port ${port}`);
});

// curl -X POST http://localhost:8081/product -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZTA5YzRiMWFhNTM2YTRlOWUyMmY4MiIsImVtYWlsIjoibmlyYW5nYWRAZ21haWwuY29tIiwidGltZXN0YW1wIjoxNjU5MDI0MTg0MzUyLCJpYXQiOjE2NTkwMjQxODR9.r0vHG5WP3wJEpoXH41vbwH63_y3z1RrvqJ7FVdu4AiY" | json_pp
// Express Routes
app.get("/product", isAuthenticated, (_req, res) => {
  return res.json({ status: 1, message: "Welcome to Product Service" });
});

app.get("/product/all", isAuthenticated, async (_req, res) => {
  Product.find({}, (err: any, products: any) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 0, message: "Something went wrong" });
    }
    return res.json({ status: 1, message: products });
  });
});

app.get("/product/:id", isAuthenticated, validateId, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json({ status: 1, message: product });
  }
  return res.json({ status: 0, message: "Product does not exist" });
});

app.delete("/product/:id", isAuthenticated, validateId, async (req, res) => {
  Product.deleteOne(
    { _id: req.params.id },
    (err: any, data: { deletedCount: number }) => {
      if (err) {
        return res.json({
          status: 0,
          message: `Something went wrong`,
        });
      }

      if (data.deletedCount == 0) {
        return res.json({
          status: 0,
          message: `Product does not exists`,
        });
      }

      return res.json({
        status: 1,
        message: `Product deleted: ${req.params.id}`,
      });
    }
  );
});

app.post("/product", isAuthenticated, async (req, res) => {
  const productPayload = req.body.product;
  Product.create(productPayload, (err: any, product: any) => {
    if (err) {
      res.status(500);
      if (err.code == 11000) {
        return res.json({
          status: 0,
          message: {
            error: "Mentioned fields in Product must be unique",
            fields: err.keyValue,
          },
        });
      }
      return res.json({ status: 0, message: "Something went wrong" });
    }
    return res.json({ status: 1, message: product });
  });
});

app.put("/product/:id", isAuthenticated, validateId, async (req, res) => {
  const productPayload = req.body.product;
  Product.findOne({ _id: req.params.id }, (err: any, product: any) => {
    if (err) {
      console.log("Error: ", err.reason);
      return res
        .status(500)
        .json({ status: 0, message: "Something went wrong" });
    }

    if (!product) {
      return res.json({ status: 0, message: "Product does not exist" });
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
              error: "Mentioned fields in Product must be unique",
              fields: err.keyValue,
            },
          });
        }
        return res.json({ status: 0, message: "Something went wrong" });
      }
      return res.json({ status: 1, message: product });
    });
  });
});
