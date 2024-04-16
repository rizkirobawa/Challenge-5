const router = require("express").Router();

const User = require("./users.routes")
const Account = require("./accounts.routes")
const Transaction = require("./transactions.routes")

// API
router.use("/api/v1", User)
router.use("/api/v1", Account)
router.use("/api/v1", Transaction)

module.exports = router;