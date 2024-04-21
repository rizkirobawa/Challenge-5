const router = require("express").Router();
const {
  create,
  index,
  show,
  destroy,
  update,
} = require("../../controllers/v1/accountController");
const { restrict } = require("../../middlewares/auth.middleware");

// API Bank_Account
router.post("/accounts", restrict, create);
router.get("/accounts", restrict, index);
router.get("/accounts/:id", restrict, show);
router.put("/accounts/:id", restrict, update);
router.delete("/accounts/:id", restrict, destroy);

module.exports = router;
