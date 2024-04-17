const router = require("express").Router();
const {
  create,
  index,
  show,
  destroy,
  update,
} = require("../../controllers/v1/accountController");

// API Bank_Account
router.post("/accounts", create);
router.get("/accounts", index);
router.get("/accounts/:id", show);
router.put("/accounts/:id", update);
router.delete("/accounts/:id", destroy);

module.exports = router;
