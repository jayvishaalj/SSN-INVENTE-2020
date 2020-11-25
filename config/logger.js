const winston = require("winston");
const { format } = winston;
var WinstonGraylog2 = require("winston-graylog2");
const path = require("path");

const logFormat = format.printf(
  (info) => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
);
const timezoned = () => {
  return new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
};

const getLabel = function (callingModule) {
  const parts = callingModule.filename.split(path.sep);
  return path.join(parts[parts.length - 2], parts.pop());
};

module.exports = (callingModule) => {
  const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      format.label({ label: getLabel(callingModule) }),
      format.timestamp({
        format: timezoned,
      }),
      format.metadata({
        fillExcept: ["message", "level", "timestamp", "label"],
      }),
      logFormat
    ),
    defaultMeta: { service: "user-service" },
    transports: [
      new winston.transports.File({ filename: "combined.log" }),
      new WinstonGraylog2({
        name: "Graylog",
        level: "info",
        // silent: false,
        // handleExceptions: false,
        prelog: function (msg) {
          return msg.trim();
        },
        graylog: {
          servers: [{ host: "graylog", port: 12201 }],
          // hostname: "graylog",
          facility: "INVENTE",
          // bufferSize: 1400,
        },
        staticMeta: { env: "development" },
      }),
    ],
  });
  return logger;
};
