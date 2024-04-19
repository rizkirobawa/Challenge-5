const router = require("express").Router();
const User = require("./users.routes");
const Account = require("./accounts.routes");
const Transaction = require("./transactions.routes");
const Auth = require("./auth.routes")

const swaggerUI = require("swagger-ui-express");
const yaml = require("yaml");
const fs = require("fs");
const path = require("path");

const swagger_path = path.resolve(__dirname, "../../docs/bank-api-docs.yaml");
const file = fs.readFileSync(swagger_path, "utf-8");

const swaggerDocument = yaml.parse(file);
router.use(
  "/api/v1/bank-api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument)
);

// API
router.use("/api/v1", User);
router.use("/api/v1", Account);
router.use("/api/v1", Transaction);

// Auth
router.use("/api/v1", Auth);

module.exports = router;
