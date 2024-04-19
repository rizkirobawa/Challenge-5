const router = require("express").Router();
const {
  register,
  login,
  verified,
} = require("../../controllers/v1/authController");
const  {restrict}  = require("../../middlewares/auth.middleware");

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/authenticate", restrict, verified);

module.exports = router;
