import express from "express";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Channel, Connection } from "amqplib";

import rabbitMQ from "./common/rabbitmq/rabbitmq";
import logger from "./common/logger/logger";
import validateId from "./common/mongo/idValidation";
import i18nextexpress from "./common/locales/localize";
import isAuthenticated from "@nirangad/is-authenticated";

import User from "./models/User.model";

// DotEnv Configuration
dotenv.config();

// Express Server
const port = process.env.SERVER_PORT || "8080";
const app = express();
app.use(express.json());

// Localization
app.use(i18nextexpress);

// Logger
app.use(logger());

// RabbitMQ connection
let rabbitInstance: { connection: Connection; channel: Channel; queue: string };
rabbitMQ
  .connect(process.env.RABBITMQ_AUTH_QUEUE ?? "rabbitmq@auth")
  .then((data) => {
    rabbitInstance = data;
  });

// MongoDB Connection
const mongoDBURL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/auth-service";
mongoose.connect(mongoDBURL, () => {
  console.log(`Auth Service DB connected`);
});

app.listen(port, () => {
  console.log(`Auth Service listening on port ${port}`);
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

// Express Routes
app.get("/auth", (req, res) => {
  return res.json({ status: 1, message: req.t("AUTH.WELCOME") });
});

app.delete("/auth", isAuthenticated, (req: any, res) => {
  const authUser = req.user;
  User.deleteOne(
    { email: authUser.email },
    (err: any, data: { deletedCount: number }) => {
      if (err) {
        return res.status(500).json({
          status: 0,
          message: req.t("HTTP_500"),
        });
      }

      if (data.deletedCount == 0) {
        return res.status(404).json({
          status: 0,
          message: req.t("AUTH.ERROR.NO_USER"),
        });
      }

      return res.json({
        status: 1,
        message: `${req.t("AUTH.USER_DELETED")}: ${authUser.email}`,
      });
    }
  );
});

app.get("/auth/users/all", isAuthenticated, async (_req, res) => {
  const users = await User.find({});
  return res.json({ status: 1, message: users });
});

app.get("/auth/users/current", isAuthenticated, async (req: any, res) => {
  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return res
      .status(404)
      .json({ status: 0, message: req.t("AUTH.ERROR.NO_USER") });
  }
  return res.json({ status: 1, message: user });
});

app.get(
  "/auth/users/:id",
  isAuthenticated,
  validateId,
  async (req: any, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: 0, message: req.t("AUTH.ERROR.NO_USER") });
    }
    return res.json({ status: 1, message: user });
  }
);

app.post("/auth/login", body("email").isEmail(), async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res
      .status(400)
      .json({ status: 0, message: req.t("ERROR.VALIDATION") });
  }

  const { email, password } = req.body;
  if (!password || !email) {
    return res.status(400).json({
      status: 0,
      message: req.t("AUTH.ERROR.REQUIRED.EMAIL_PASSWORD"),
    });
  }

  User.findOne({ email }, "+password", async (err: any, user: any) => {
    if (err) {
      return res.status(500).json({ status: 0, message: req.t("HTTP_500") });
    }

    const valid = await checkPassword(password, user?.password || "");
    if (valid) {
      const token = jwt.sign(
        { id: user.id, email: user.email, timestamp: Date.now() },
        process.env.SECRET_KEY ||
          JSON.stringify({ id: user.id, email: user.email }),
        { expiresIn: "10h" }
      );

      if (!token) {
        return res.status(500).json({
          status: 0,
          message: req.t("HTTP_500"),
        });
      }
      user.password = undefined;

      return res.json({
        status: 1,
        message: { user, token },
      });
    } else {
      return res.status(400).json({
        status: 0,
        message: req.t("AUTH.ERROR.INCORRECT_CREDENTIALS"),
      });
    }
  });
});

app.post(
  "/auth/register",
  body("email").isEmail().normalizeEmail(),
  body("password").not().isEmpty(),
  body("firstName").not().isEmpty().trim().escape(),
  body("lastName").not().isEmpty().trim().escape(),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        status: 0,
        message: `${req.t(
          "AUTH.ERROR.REQUIRED.MANDATORY_FIELDS"
        )} - email, password, firstName & lastName`,
      });
    }
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ status: 0, message: req.t("AUTH.ERROR.USER_EXISTS") });
    } else {
      let user = new User({ ...req.body });
      user.password = await hashPassword(password);
      await user.save();
      user.password = undefined;

      return res.json({
        status: 1,
        message: { user },
      });
    }
  }
);
