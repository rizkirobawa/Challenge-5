const router = require("express").Router();
const {
  register,
  login,
  verified,
} = require("../../controllers/v1/authController");
const  {restrict}  = require("../../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/authenticated", restrict, verified);

module.exports = router;
