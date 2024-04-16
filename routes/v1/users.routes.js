const router = require("express").Router();
const {
  register,
  index,
  show,
  update,
  destroy,
} = require("../../controllers/v1/userController");

// API Endpoint users
router.post("/users", register);
router.get("/users", index);
router.get("/users/:id", show);
router.put("/users/:id", update);
router.delete("/users/:id", destroy);

module.exports = router;