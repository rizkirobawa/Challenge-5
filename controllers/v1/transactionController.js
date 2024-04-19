const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Error handling function
const handleError = (res, statusCode, message) => {
  return res.status(statusCode).json({ status: false, message: message });
};

module.exports = {
  create: async (req, res, next) => {
    try {
      const {
        amount,
        sourceAccountId = req.body.sourceAccount,
        destinationAccountId = req.body.destinationAccount,
      } = req.body;

      const sourceAccount = await prisma.bankAccount.findUnique({
        where: { id: sourceAccountId },
      });

      const destinationAccount = await prisma.bankAccount.findUnique({
        where: { id: destinationAccountId },
      });

      if (!sourceAccount || !destinationAccount) {
        if (!sourceAccount) {
          return handleError(
            res,
            404,
            `Can't find source account with account_id ${sourceAccountId}`
          );
        } else {
          return handleError(
            res,
            404,
            `Can't find destination account with account_id ${destinationAccountId}`
          );
        }
      }

      if (sourceAccount.balance < amount) {
        return handleError(
          res,
          400,
          `The balance in the source account is insufficient`
        );
      }

      await prisma.bankAccount.update({
        where: { id: sourceAccountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      await prisma.bankAccount.update({
        where: { id: destinationAccountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      const transaction = await prisma.transaction.create({
        data: {
          amount: amount,
          sourceAccountId: sourceAccountId,
          destinationAccountId: destinationAccountId,
        },
      });

      res.status(201).json({
        status: true,
        message: `Transaction successfully`,
        data: transaction,
      });
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
        message: "Transaction successfully",
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
