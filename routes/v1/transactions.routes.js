const router = require("express").Router();
const {
  store,
  create,
  index,
  show,
  destroy,
} = require("../../controllers/v1/transactionController");
const { restrict } = require("../../middlewares/auth.middleware");

// API Transactions with restrict
router.post("/transactions", restrict, create);
router.get("/transactions", restrict, index);
router.get("/transactions/:id", restrict, show);
router.delete("/transactions/:id", restrict, destroy);

module.exports = router;
