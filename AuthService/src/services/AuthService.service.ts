import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.model";

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

const getUser = async (params: any, withPassword: boolean = false) => {
  if (withPassword) {
    return User.findOne(params, "+password");
  }
  return User.findOne(params);
};

const getAllUsers = async () => {
  return User.find({});
};

const validateLogin = (
  given: string,
  checkWith: string
): Promise<boolean> | boolean => {
  const valid = checkPassword(given, checkWith);
  return valid;
};

const generateToken = async (
  value: {
    id: string;
    email: string;
    timestamp: number;
  },
  secret: string,
  expiresIn: string = "10h"
): Promise<string | null> => {
  const token = jwt.sign(value, secret, { expiresIn });
  if (!token) {
    return null;
  }

  return token;
};

const deleteUser = async (
  email: String,
  callback: (err: any, data: { deletedCount: number }) => void
) => {
  User.deleteOne({ email }, callback);
};

export default {
  getUser,
  getAllUsers,
  validateLogin,
  generateToken,
  hashPassword,
  deleteUser,
};
