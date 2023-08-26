const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 50,
  message: "Too many request from this IP please try again later",
});

app.use(rateLimiter);
app.use(express.json());
app.use(xssClean());
app.use(cors());
app.use(morgan("dev"));

const userRouter = require("./routes/user-router");

app.use("/api/v1/auth", userRouter);

app.get("/test", (req, res, next) => {
  res.send("Hello text");
});

app.get("/", async (req, res, next) => {
  console.log("E-commerce server is running".yellow.bold);
  res.status(200).json({
    message: "welcome to the server",
  });
});

app.use((req, res, next) => {
  next(createError(404, "route not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

module.exports = app;
