const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let token = "";
let user;
let account;
console.log("token: ", token);

describe("test API method POST with endpoint /api/v1/accounts", () => {
  beforeAll(async () => {
    await prisma.transaction.deleteMany();
    await prisma.bankAccount.deleteMany();
    user = await prisma.user.findMany();
    try {
      let email = "kibowz@gmail.com";
      let password = "123";
      let { body } = await request(app)
        .post("/api/v1/auth/login")
        .send({ email, password });
      token = body.data.token;
    } catch (error) {
      console.error("Error login:", error);
    }
  });

  test("Created Bank Account -> success", async () => {
    try {
      let bank_name = "Mandiri";
      let bank_account_number = "2234331221123333";
      let balance = 1500000;
      let user_id = user[0].id;
      let { statusCode, body } = await request(app)
        .post("/api/v1/accounts")
        .send({
          bank_name,
          bank_account_number,
          balance,
          user_id,
        })
        .set("Authorization", `Bearer ${token}`);

      account = body.data;

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty(
        "message",
        "Bank Account created successfully"
      );
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("bank_name", bank_name);
      expect(body.data).toHaveProperty(
        "bank_account_number",
        bank_account_number
      );
      expect(body.data).toHaveProperty("balance", balance);
      expect(body.data).toHaveProperty("user_id", user_id);
    } catch (err) {
      throw err;
    }
  });

  test("Created Bank Account -> error (Bank account number already used )", async () => {
    try {
      let bank_name = "Mandiri";
      let bank_account_number = "2234331221123333";
      let balance = 1500000;
      let user_id = user[0].id;

      let { statusCode, body } = await request(app)
        .post("/api/v1/accounts")
        .send({ bank_name, bank_account_number, balance, user_id })
        .set("Authorization", `Bearer ${token}`);
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty(
        "message",
        "Bank account number already used!"
      );
    } catch (err) {
      throw err;
    }
  });

  test("Created Bank Account -> error (user not found)", async () => {
    try {
      let bank_name = "BTN";
      let bank_account_number = "2234331221123244";
      let balance = 1500000;
      let user_id = 1233;

      let { statusCode, body } = await request(app)
        .post("/api/v1/accounts")
        .send({ bank_name, bank_account_number, balance, user_id })
        .set("Authorization", `Bearer ${token}`);
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty(
        "message",
        `User with ID ${user_id} not found`
      );
    } catch (err) {
      throw err;
    }
  });
});

describe("test API method GET with endpoint /api/v1/accounts", () => {
  test("Get all account -> success", async () => {
    try {
      let { statusCode, body } = await request(app)
        .get("/api/v1/accounts")
        .set("Authorization", `Bearer ${token}`);
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data[0]).toHaveProperty("id");
      expect(body.data[0]).toHaveProperty("bank_name");
      expect(body.data[0]).toHaveProperty("bank_account_number");
      expect(body.data[0]).toHaveProperty("balance");
      expect(body.data[0]).toHaveProperty("user_id");
    } catch (err) {
      throw err;
    }
  });

  test("Get detail account by id -> success", async () => {
    try {
      let { statusCode, body } = await request(app)
        .get(`/api/v1/accounts/${account.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("bank_name");
      expect(body.data).toHaveProperty("bank_account_number");
      expect(body.data).toHaveProperty("balance");
      expect(body.data).toHaveProperty("user_id");
      expect(body.data).toHaveProperty("user");
      expect(body.data.user).toHaveProperty("id");
      expect(body.data.user).toHaveProperty("name");
      expect(body.data.user).toHaveProperty("email");
      expect(body.data.user).toHaveProperty("password");
      expect(body.data.user).toHaveProperty("profile");
      expect(body.data.user.profile).toHaveProperty("id");
      expect(body.data.user.profile).toHaveProperty("identity_type");
      expect(body.data.user.profile).toHaveProperty("identity_number");
      expect(body.data.user.profile).toHaveProperty("address");
      expect(body.data.user.profile).toHaveProperty("user_id");
    } catch (err) {
      throw err;
    }
  });

  test("Get detail account by id -> error (account not found)", async () => {
    try {
      let { statusCode, body } = await request(app)
        .get(`/api/v1/accounts/${1233}`)
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status", false);
      expect(body).toHaveProperty(
        "message",
        `Can't find account with ID ${1233}`
      );
    } catch (err) {
      throw err;
    }
  });
});

describe(`test API method PUT with endpoint /api/v1/accounts/:id`, () => {
  beforeAll(async () => {
    user = await prisma.user.findMany();
  });

  test("Update account data -> success", async () => {
    try {
      let newBankName = "BNI";
      let { statusCode, body } = await request(app)
        .put(`/api/v1/accounts/${account.id}`)
        .send({
          bank_name: newBankName,
        })
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("bank_name");
      expect(body.data).toHaveProperty("bank_account_number");
      expect(body.data).toHaveProperty("balance");
      expect(body.data).toHaveProperty("user_id");
      expect(body.data.bank_name).toBe(newBankName);
    } catch (err) {
      throw err;
    }
  });

  test("Update account data -> error (account not found)", async () => {
    try {
      let newBankName = "BNI";
      let { statusCode, body } = await request(app)
        .put(`/api/v1/accounts/${1233}`)
        .send({ bank_name: newBankName })
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status", false);
      expect(body).toHaveProperty(
        "message",
        `Account with ID ${1233} not found`
      );
    } catch (err) {
      throw err;
    }
  });
});

describe("test API method DELETE with endpoint /api/v1/accounts/:id", () => {
  // test("Delete account by id -> success", async () => {
  //     try {
  //         let {statusCode, body} = await request(app).delete(`/api/v1/accounts/${account.id}`).set("Authorization", `Bearer ${token}`)

  //         expect(statusCode).toBe(200)
  //         expect(body).toHaveProperty("status")
  //         expect(body).toHaveProperty("message", `Account with ID ${account.id} deleted successfully`)
  //     } catch (err) {
  //         throw err
  //     }
  // })

  test("Delete account by id -> error (account not found)", async () => {
    try {
      let { statusCode, body } = await request(app)
        .delete(`/api/v1/accounts/${1233}`)
        .set("Authorization", `Bearer ${token}`);
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("status", false);
      expect(body).toHaveProperty(
        "message",
        `Account with ID ${1233} not found`
      );
    } catch (err) {
      throw err;
    }
  });
});
