var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const hbs = require("hbs");
const flash = require("connect-flash");
const session = require("express-session");
const router = require("./routes/router");
const redis = require("redis");
const redisStore = require("connect-redis")(session);
const wLogger = require("./config/logger")(module);

var app = express();
const redisClient = redis.createClient({
  host: "redis",
  port: 6379,
  no_ready_check: true,
  password: "jay_vishaal_j_144",
});
const {
  SESS_LIFETIME = 1000 * 60 * 60,
  SESS_NAME = "invente",
  SESS_SECRET = "jayvishaaljsession*14",
  NODE_ENV = "devlopment",
} = process.env;
const IN_PROD = NODE_ENV === "development";

redisClient.on("connect", () => {
  global.console.log("connected");
  wLogger.log("info", "Redis Connected Successfully");
});
redisClient.on("error", (err) => {
  wLogger.log("error", `Redis Connection Error ${JSON.stringify(err)}`);
  console.log("Redis error: ", err);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

hbs.registerPartials(path.join(__dirname, "views/partials"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    name: SESS_NAME,
    secret: SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: IN_PROD, maxAge: SESS_LIFETIME, sameSite: true },
    store: new redisStore({
      host: "redis",
      port: 6379,
      client: redisClient,
      ttl: 86400,
    }),
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;
