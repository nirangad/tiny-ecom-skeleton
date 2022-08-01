import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rabbitMQ from "./common/rabbitmq/rabbitmq";
import logger from "./common/logger/logger";
import isAuthenticated from "@nirangad/is-authenticated";

import User from "./models/User.model";

// DotEnv Configuration
dotenv.config();

// Express Server
const port = process.env.SERVER_PORT || "8080";
const app = express();
app.use(express.json());

// Logger
app.use(logger());

// RabbitMQ connection
rabbitMQ.connect(process.env.RABBITMQ_AUTH_QUEUE ?? "rabbitmq@auth");

// MongoDB Connection
const mongoDBURL = process.env.MONGODB_URL || "mongodb://localhost:27017";
mongoose.connect(mongoDBURL, () => {
  console.log(`Auth Service DB connected`);
});

// Hashing
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(6);
  return await bcrypt.hash(password, salt);
};

const checkPassword = async (
  password: string,
  hashed: string
): Promise<boolean> => {
  const valid = await bcrypt.compare(password, hashed);
  return valid;
};

app.listen(port, () => {
  console.log(`Auth Service listening on port ${port}`);
});

// Express Routes
app.get("/auth", (_req, res) => {
  return res.json({ status: 1, message: "Welcome to Auth Service" });
});

app.delete("/auth", isAuthenticated, (req: any, res) => {
  const authUser = req.user;
  User.deleteOne(
    { email: authUser.email },
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
          message: `User does not exists`,
        });
      }

      return res.json({
        status: 1,
        message: `User deleted: ${authUser.email}`,
      });
    }
  );
});

app.get("/auth/users/all", isAuthenticated, async (_req, res) => {
  const users = await User.find({});
  return res.json({ status: 1, message: users });
});

//curl -d '{ "email": "nirangad@gmail.com", "password": "abcd1234" }' -H "Content-Type: application/json" -X POST http://localhost:8080/auth/login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    return res.json({ status: 0, message: "Email and Password required" });
  }

  User.findOne({ email }, "+password", async (err: any, user: any) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 0, message: "Something went wrong" });
    }

    const valid = await checkPassword(password, user?.password || "");
    if (valid) {
      user.token = "";
      const token = jwt.sign(
        { id: user.id, email: user.email, timestamp: Date.now() },
        process.env.SECRET_KEY ||
          JSON.stringify({ id: user.id, email: user.email }),
        { expiresIn: "10h" }
      );

      if (!token) {
        return res.json({
          status: 0,
          message: "Authentication failed due to server error. Try again later",
        });
      }

      user!.token = token;
      await user.save();
      user.password = undefined;

      return res.json({
        status: 1,
        message: { user },
      });
    } else {
      return res.json({ status: 0, message: "Incorrect Email or Password" });
    }
  });
});

app.post("/auth/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.json({ status: 0, message: "User already exists" });
  } else {
    let user = new User({ email, password, firstName, lastName });
    user.password = await hashPassword(password);
    await user.save();
    user.password = undefined;

    return res.json({
      status: 1,
      message: { user },
    });
  }
});
