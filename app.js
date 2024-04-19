const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const router = require("./routes/v1");

app.use(express.urlencoded());

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(router);

// 404 error handling
app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: "Bad Request",
    data: null,
  });
});

// 500 error handling
app.use((err, req, res, next) => {
  res.status(500).json({
    status: false,
    message: err.message || "Internal Server Error",
    data: null,
  });
});

module.exports = app;
