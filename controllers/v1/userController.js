const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

      let user = await prisma.user.create({
        data: {
          name,
          email,
          password,
          profile: {
            create: { identity_type, identity_number, address },
          },
        },
        include: {
          profile: true,
        },
      });

      res.status(201).json({
        status: true,
        message: "Register Successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
  index: async (req, res, next) => {
    try {
      const { search } = req.query;

      const users = await prisma.user.findMany({
        where: { name: { contains: search, mode: "insensitive" } },
      });

      res.status(200).json({
        status: true,
        message: "OK",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },
  show: async (req, res, next) => {
    try {
      let id = Number(req.params.id);
      let user = await prisma.user.findUnique({
        where: { id: id },
        include: { profile: true },
      });

      if (!user) {
        return handleError(res, 404, `Can't find user with ID ${id}`);
      }

      res.status(200).json({
        status: true,
        message: "OK",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
  destroy: async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const user = await prisma.user.findUnique({
        where: { id: id },
      });

      if (!user) {
        return handleError(res, 404, `User with ID ${id} not found`);
      }

      await prisma.user.delete({
        where: { id: id },
      });

      res.status(200).json({
        status: true,
        message: `User with ID ${id} deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { name, email, password, identity_type, identity_number, address } =
        req.body;

      if (!identity_number || identity_number.length !== 16) {
        return handleError(
          res,
          400,
          "Invalid identity number. Must be exactly 16 characters"
        );
      }
      
      const exist = await prisma.user.findUnique({
        where: { id },
      });
      
      if (!exist) {
        return handleError(res, 404, `User with ID ${id} not found`);
      }

      const user = await prisma.user.update({
        where: { id: id },
        data: {
          name: name,
          email: email,
          password: password,
          profile: {
            update: {
              identity_type: identity_type,
              identity_number: identity_number,
              address: address,
            },
          },
        },
        include: {
          profile: true,
        },
      });


      res.status(200).json({
        status: true,
        message: `Update user with ID ${id} successfully`,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
};
