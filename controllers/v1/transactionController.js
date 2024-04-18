const { PrismaClient } = require("@prisma/client");
const { destroy } = require("./accountController");
const prisma = new PrismaClient();

// Error handling function
const handleError = (res, statusCode, message) => {
  return res.status(statusCode).json({ status: false, message: message });
};

module.exports = {
  create: async (req, res, next) => {
    try {
      const amount = req.body.amount;
      const sourceAccountId = Number(req.body.sourceAccount);
      const destinationAccountId = Number(req.body.destinationAccount);

      const sourceAccount = await prisma.bankAccount.findUnique({
        where: { id: sourceAccountId },
      });
      const destinationAccount = await prisma.bankAccount.findUnique({
        where: { id: destinationAccountId },
      });

      if (!sourceAccount || !destinationAccount) {
        return handleError(
          res,
          404,
          `Can't find source or destination account`
        );
      }

      if (sourceAccount.balance < amount) {
        return handleError(
          res,
          400,
          `The balance in the source account is insufficient`
        );
      }

      const updateSourceAccount = await prisma.bankAccount.update({
        where: { id: sourceAccountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      const updateDestinationAccount = await prisma.bankAccount.update({
        where: { id: destinationAccountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      const createTransaction = await prisma.transaction.create({
        data: {
          amount: amount,
          sourceAccountId: sourceAccountId,
          destinationAccountId: destinationAccountId,
        },
      });

      res.status(201).json({
        status: true,
        message: `Transaction successsfully`,
        data: createTransaction,
        // sourceAccount: updateSourceAccount,
        // destinationAccount: updateDestinationAccount,
        // transaction: createTransaction,
      });

      console.log("Source Account:", sourceAccount);
      console.log("Destination Account:", destinationAccount);
    } catch (err) {
      next(err);
    }
  },
  index: async (req, res, next) => {
    try {
      let transaction = await prisma.transaction.findMany();

      res.status(200).json({
        status: true,
        message: "OK",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  },
  show: async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const transaction = await prisma.transaction.findUnique({
        where: { id: id },
        include: {
          sourceAccount: true,
          destinationAccount: true,
        },
      });

      if (!transaction) {
        return handleError(res, 404, `Can't find transaction with ID ${id}`);
      }

      res.status(200).json({
        status: true,
        message: "Transaction successsfully",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  },
  destroy: async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      let transaction = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!transaction) {
        return handleError(res, 404, `Can't find transaction with ID ${id}`);
      }

      await prisma.transaction.delete({ where: { id } });

      res.status(200).json({
        status: true,
        message: `Transaction with ID ${id} deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  },
};
