const router = require("express").Router();
const {
  register,
  index,
  show,
  update,
  destroy,
} = require("../../controllers/v1/userController");
const { restrict } = require("../../middlewares/auth.middleware");

// API Endpoint users with restrict
router.post("/users", register);
router.get("/users", restrict, index);
router.get("/users/:id", restrict, show);
router.put("/users/:id", restrict, update);
router.delete("/users/:id", restrict, destroy);

module.exports = router;
