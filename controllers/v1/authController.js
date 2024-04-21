const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;

// Error handling function
const handleError = (res, statusCode, message) => {
  return res.status(statusCode).json({ status: false, message: message });
};

module.exports = {
  register: async (req, res, next) => {
    try {
      let { name, email, password, identity_type, identity_number, address } =
        req.body;
      let createUser = await prisma.user.findFirst({
        where: { email },
      });

      if (createUser) {
        return handleError(res, 400, "Email already used!");
      }

      existingUser = await prisma.user.findFirst({
        where: { profile: { identity_number } },
      });

      if (!["KTP", "SIM", "Passport"].includes(identity_type)) {
        return handleError(
          res,
          401,
          "Invalid identity_type. Must be KTP, SIM, or Passport"
        );
      }

      if (!identity_number || identity_number.length !== 16) {
        return handleError(
          res,
          402,
          "Invalid identity number. Must be exactly 16 characters"
        );
      }

      if (existingUser) {
        return handleError(res, 403, "Identity number already used!");
      }

      if (
        !name ||
        !email ||
        !password ||
        !identity_type ||
        !identity_number ||
        !address
      ) {
        return res.status(405).json({
          status: false,
          message: "input must be required",
          data: null,
        });
      }

      let encryptedPassword = await bcrypt.hash(password, 10);
      let user = await prisma.user.create({
        data: {
          name,
          email,
          password: encryptedPassword,
          profile: {
            create: { identity_type, identity_number, address },
          },
        },
        include: {
          profile: true,
        },
      });
      delete user.password;

      return res.status(201).json({
        status: true,
        message: "Success",
        data: user ,
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
      // if (!isPasswordCorrect) {
      //   return res.status(401).json({
      //     status: false,
      //     message: "Invalid email or password",
      //     data: null,
      //   });
      // }

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
