const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");

describe("test API method POST with endpoint /v1/users", () => {
  let name = "kibowz";
  let email = "kibowz@gmail.com";
  let password = "123456";
  let identity_type = "KTP";
  let identity_number = "8763849102831531";
  let address = "Jalan To The Moon 2025";

  beforeAll(async () => {
    await prisma.transaction.deleteMany();
    await prisma.bankAccount.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
  });

  test("Register Successfully -> success", async () => {
    try {
      let { statusCode, body } = await request(app).post("/api/v1/users").send({
        name,
        email,
        password,
        identity_type,
        identity_number,
        address,
      });

      user = body.data;

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("email");
      expect(body.data).toHaveProperty("password");
      expect(body.data).toHaveProperty("profile");
      expect(body.data.profile).toHaveProperty("identity_type");
      expect(body.data.profile).toHaveProperty("identity_number");
      expect(body.data.profile).toHaveProperty("address");
      expect(body.data.profile).toHaveProperty("user_id");
      expect(body.data.name).toBe(name);
      expect(body.data.email).toBe(email);
      expect(body.data.password).toBe(password);
      expect(body.data.profile.identity_type).toBe(identity_type);
      expect(body.data.profile.identity_number).toBe(identity_number);
      expect(body.data.profile.address).toBe(address);
    } catch (err) {
      throw err;
    }
  });

  test("Email already used! -> error", async () => {
    try {
      let { statusCode, body } = await request(app).post("/api/v1/users").send({
        name,
        email,
        password,
        identity_type,
        identity_number,
        address,
      });
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
    } catch (err) {
      throw err;
    }
  });
  test("Invalid identity_type. Must be KTP, SIM, or Passport -> error", async () => {
    try {
      identity_type = "ATM";
      let { statusCode, body } = await request(app).post("/api/v1/users").send({
        name,
        email: "newKibowz@gmail.com",
        password,
        identity_type,
        identity_number,
        address,
      });
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty("status", false);
      expect(body).toHaveProperty(
        "message",
        "Invalid identity_type. Must be KTP, SIM, or Passport"
      );
    } catch (err) {
      throw err;
    }
  });
  test("Invalid identity number. Must be exactly 16 characters -> error", async () => {
    try {
      let { statusCode, body } = await request(app).post("/api/v1/users").send({
        name,
        email: "newKibowz@gmail.com",
        password,
        identity_type: "KTP",
        identity_number: "918241481",
        address,
      });
      expect(statusCode).toBe(402);
      expect(body).toHaveProperty("status", false);
      expect(body).toHaveProperty(
        "message",
        "Invalid identity number. Must be exactly 16 characters"
      );
    } catch (err) {
      throw err;
    }
  });
  test("Identity number already used! -> error", async () => {
    try {
      identity_type = "KTP";
      identity_number = "8763849102831531";
      let { statusCode, body } = await request(app).post("/api/v1/users").send({
        name,
        email: "newKibowz@gmail.com",
        password,
        identity_type,
        identity_number,
        address,
      });
      expect(statusCode).toBe(403);
      expect(body).toHaveProperty("status", false);
      expect(body).toHaveProperty("message", "Identity number already used!");
    } catch (err) {
      throw err;
    }
  });
});

describe("test API method GET with endpoint /api/v1/users")