const router = require("express").Router();
const {
  store,
  create,
  index,
  show,
  destroy,
} = require("../../controllers/v1/transactionController");

// API Transactions
router.post("/transactions", create);
router.get("/transactions", index);
router.get("/transactions/:id", show);
router.delete("/transactions/:id", destroy);

module.exports = router;
