const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let token = "";

describe("test API metho POST with endpoint /api/v1/auth/register", () => {
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

  test("register user -> success", async () => {
    try {
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name,
          email,
          password,
          identity_type,
          identity_number,
          address,
        });

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("email");
      expect(body.data).toHaveProperty("profile");
      expect(body.data.profile).toHaveProperty("identity_type");
      expect(body.data.profile).toHaveProperty("identity_number");
      expect(body.data.profile).toHaveProperty("address");
      expect(body.data.profile).toHaveProperty("user_id");
      expect(body.data.name).toBe(name);
      expect(body.data.email).toBe(email);
      expect(body.data.profile.identity_type).toBe(identity_type);
      expect(body.data.profile.identity_number).toBe(identity_number);
      expect(body.data.profile.address).toBe(address);
    } catch (err) {
      throw err;
    }
  });

  test("register user -> error (Email already used)", async () => {
    try {
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/register")
        .send({
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

  test("register user -> error (input required)", async () => {
    try {
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/register")
        .send({
          email: "test1212@gmail.com",
          identity_type,
          identity_number: "4856213987456123",
        });

      console.log("body", body);
      expect(statusCode).toBe(405);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
    } catch (err) {
      throw err;
    }
  });
  test("Invalid identity_type. Must be KTP, SIM, or Passport -> error", async () => {
    try {
      identity_type = "ATM";
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/register")
        .send({
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
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/register")
        .send({
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
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/register")
        .send({
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

describe("test API metho POST with endpoint /api/v1/auth/login", () => {
  let email = "kibowz@gmail.com";
  let password = "123";

  test("login user -> success", async () => {
    try {
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email,
          password,
        });

      token = body.data.token;

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("email");
      expect(body.data).toHaveProperty("token");
    } catch (err) {
      throw err;
    }
  });

  test("login user -> error (email or password is required)", async () => {
    try {
      newEmail = "";
      newPassword = "1234";
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: newEmail,
          password: newPassword,
        });
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty(
        "message",
        "Email and password are required!"
      );
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });

  test("login user -> error (invalid email or password)", async () => {
    try {
      newEmail = "ndik@gmail.com";
      newPassword = "123";
      let { statusCode, body } = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: newEmail,
          password: newPassword,
        });
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
});

describe("test API method GET withendpoint /api/v1/authenticated", () => {
  test("login is verified -> success", async () => {
    try {
      let { statusCode, body } = await request(app)
        .get("/api/v1/auth/authenticate")
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("email");
    } catch (err) {
      throw err;
    }
  });

  test("login is verified -> error (jwt malformed)", async () => {
    try {
      let newToken = "mdigmnidqwmigqigq";
      let { statusCode, body } = await request(app)
        .get("/api/v1/auth/authenticate")
        .set("Authorization", `Bearer ${newToken}`);

      expect(statusCode).toBe(403);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message", "jwt malformed");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });

  test("login is verified -> error (token not provided)", async () => {
    try {
      let newToken = "";
      let { statusCode, body } = await request(app)
        .get("/api/v1/auth/authenticate")
        .set("Authorization", `Bearer ${newToken}`);

      expect(statusCode).toBe(409);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message", "token not provided");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
});
