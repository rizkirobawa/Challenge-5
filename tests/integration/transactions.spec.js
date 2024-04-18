const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");

let user;
let account;
let account2;
let transaction;

describe("test API method POST with endpoint /api/v1/transactions", () => {
  beforeAll(async () => {
    await prisma.transaction.deleteMany();
    user = await prisma.user.findMany();
    account = await prisma.bankAccount.findMany();
    console.log("Account list:", account);
  });

  test("create new transaction -> success", async () => {
    account2 = await prisma.bankAccount.findFirst({
      where: { bank_account_number: "143947622227195" },
    });

    if (!account2) {
      account2 = await prisma.bankAccount.create({
        data: {
          bank_name: "Jago",
          bank_account_number: "143947622227195",
          balance: 6000000,
          user_id: user[0].id,
        },
      });
    }

    try {
      let amount = 100000;
      let sourceAccountId = account[0].id;
      let destinationAccountId = account2.id;

      let { statusCode, body } = await request(app)
        .post("/api/v1/transactions")
        .send({
          amount,
          sourceAccountId,
          destinationAccountId,
        });

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("amount");
      expect(body.data).toHaveProperty("sourceAccountId");
      expect(body.data).toHaveProperty("destinationAccountId");
      expect(body.data.amount).toBe(amount);
      expect(body.data.sourceAccountId).toBe(sourceAccountId);
      expect(body.data.destinationAccountId).toBe(destinationAccountId);
    } catch (err) {
      throw err
    }
  });

  // test("create new transaction -> error (Can't find source or destination account) ", async () => {
  //   try {
  //     let amount = 100000;
  //     let sourceAccountId = account[0].id + 100;
  //     let destinationAccountId = account2.id;

  //     let { statusCode, body } = await request(app)
  //       .post("/api/v1/transactions")
  //       .send({
  //         amount,
  //         sourceAccountId,
  //         destinationAccountId,
  //       });

  //     expect(statusCode).toBe(404);
  //     expect(body).toHaveProperty("status");
  //     expect(body).toHaveProperty(
  //       "message",
  //       `Can't find source or destination account`
  //     );
  //   } catch (err) {
  //     throw err;
  //   }
  // });
});

// describe("test API method DELETE with endpoint /api/v1/transactions/:id", () => {
//   beforeAll(async () => {
//     transaction = await prisma.transaction.findMany();
//   });

//   console.log("transaction list: ", transaction);
//   test("delete transaction -> success", async () => {
//     try {
//       let { statusCode, body } = await request(app).delete(
//         `/api/v1/transactions/${transaction[0].id}`
//       );

//       expect(statusCode).toBe(200);
//       expect(body).toHaveProperty("status");
//       expect(body).toHaveProperty("message", `Transaction with ID ${transaction.id} deleted successfully`);
//     } catch (err) {
//       throw err;
//     }
//   });
// });