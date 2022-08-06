import express from "express";
import dotenv from "dotenv";
import ampq from "amqplib";
import mongoose from "mongoose";
import isAuthenticated from "@nirangad/is-authenticated";

import Product from './models/Product.model';


// MongoDB Connection
const mongoDBURL = process.env.MONGODB_URL ?? "mongodb://localhost:27017";
mongoose.connect(mongoDBURL, () => {
  console.log(`Product Service DB connected`);
});

// DotEnv Configuration
dotenv.config();

// RabbitMQ connection
const rabbitConnectionURL = process.env.RABBITMQ_URL ?? "amqp://localhost:5672";
const rabbitAuthQueue =
  process.env.RABBITMQ_PRODUCT_QUEUE ?? "rabbitmq@product";
const connectRabbitMQ = async () => {
  const rabbitConnection = await ampq.connect(rabbitConnectionURL);
  const rabbitChannel = await rabbitConnection.createChannel();
  rabbitChannel.assertQueue(rabbitAuthQueue);
};

// Express Server
const port = process.env.SERVER_PORT ?? 8081;
const app = express();

app.use(express.json());

app.listen(port, async () => {
  console.log(`Product Service listening on port ${port}`);
  connectRabbitMQ();
});

// curl -X POST http://localhost:8081/product -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZTA5YzRiMWFhNTM2YTRlOWUyMmY4MiIsImVtYWlsIjoibmlyYW5nYWRAZ21haWwuY29tIiwidGltZXN0YW1wIjoxNjU5MDI0MTg0MzUyLCJpYXQiOjE2NTkwMjQxODR9.r0vHG5WP3wJEpoXH41vbwH63_y3z1RrvqJ7FVdu4AiY" | json_pp
// Express Routes
app.get("/product/all", isAuthenticated, (_req, res) => {
  const products = Product.find({});
  return res.json({ status: 1, message: products });
});

app.post("/product", isAuthenticated, async (req, res) => {
  const productPayload = req.body.product;
  return res.json({ status: 1, message: "Welcome to Product create Service" });
});
