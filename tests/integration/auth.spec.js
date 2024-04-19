const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = require("../../app");
const request = require("supertest");
let token = "";

describe("test API metho POST with endpoint /api/v1/register", () => {
  let name = "anakdewa";
  let email = "anakdewa@gmail.com";
  let password = "123456";

  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  test("register user -> success", async () => {
    try {
      let { statusCode, body } = await request(app)
        .post("/api/v1/register")
        .send({
          name,
          email,
          password,
        });

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("user");
      expect(body.data.user).toHaveProperty("id");
      expect(body.data.user).toHaveProperty("name");
      expect(body.data.user).toHaveProperty("email");
    } catch (err) {
      throw err;
    }
  });

  test("register user -> error (email already used)", async () => {
    try {
      let { statusCode, body } = await request(app)
        .post("/api/v1/register")
        .send({
          name,
          email,
          password,
        });
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });

  test("register user -> error (input required)", async () => {
    try {
      let { statusCode, body } = await request(app)
        .post("/api/v1/register")
        .send({
          name,
          email,
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

describe("test API metho POST with endpoint /api/v1/login", () => {
  let email = "anakdewa@gmail.com";
  let password = "123456";

  test("login user -> success", async () => {
    try {
      let { statusCode, body } = await request(app).post("/api/v1/login").send({
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
      newPassword = "123";
      let { statusCode, body } = await request(app).post("/api/v1/login").send({
        email: newEmail,
        password: newPassword,
      });
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message", "Email and password are required!");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });

  test("login user -> error (invalid email or password)", async () => {
    try {
      newEmail = "ndik@gmail.com";
      newPassword = "123";
      let { statusCode, body } = await request(app).post("/api/v1/login").send({
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
        .get("/api/v1/authenticated")
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
        .get("/api/v1/authenticated")
        .set("Authorization", `Bearer ${newToken}`);

      expect(statusCode).toBe(401);
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
        .get("/api/v1/authenticated")
        .set("Authorization", `Bearer ${newToken}`);

      expect(statusCode).toBe(402);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message", "token not provided");
      expect(body).toHaveProperty("data");
    } catch (err) {
      throw err;
    }
  });
});
