import winston from "winston";
import expressWinston from "express-winston";

export default () => {
  return expressWinston.logger({
    transports: [
      new winston.transports.File({
        dirname: "logs",
        filename: "access.log",
        level: "info",
      }),
      new winston.transports.File({
        dirname: "logs",
        filename: "error.log",
        level: "error",
      }),
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: true,
    msg: "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}",
    expressFormat: true,
    colorize: false,
  });
};
