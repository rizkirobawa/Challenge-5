const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  register: async (req, res, next) => {
    try {
      let { name, email, password } = req.body;

      let exist = await prisma.user.findFirst({ where: { email } });
      if ((!name, !email, !password)) {
        return res.status(401).json({
          status: false,
          message: "Input must be required",
          data: null,
        });
      }
      if (exist) {
        return res.status(400).json({
          status: false,
          message: "Email has already been used!",
          data: null,
        });
      }

      let encryptedPassword = await bcrypt.hash(password, 10);
      let userData = {
        name,
        email,
        password: encryptedPassword,
      };
      let user = await prisma.user.create({
        data: userData,
      });
      delete user.password;

      return res.status(201).json({
        status: true,
        message: "Success",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      let { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          status: false,
          message: "Email and password are required!",
          data: null,
        });
      }

      let user = await prisma.user.findFirst({
        where: { email },
      });
      if (!user) {
        return res.status(401).json({
          status: false,
          message: "Invalid email or password!",
          data: null,
        });
      }

      let isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          status: false,
          message: "Invalid email or password",
          data: null,
        });
      }

      delete user.password;
      let token = jwt.sign(user, JWT_SECRET_KEY);

      res.json({
        status: true,
        message: "OK",
        data: { ...user, token },
      });
    } catch (error) {
      next(error);
    }
  },

  verified: async (req, res, next) => {
    try {
      return res.status(200).json({
        status: true,
        message: "Success",
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  },
};
