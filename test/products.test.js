const { after, before, beforeEach, test } = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const app = require("../src/app");
const Product = require("../src/models/Product");

let mongoServer;
let accessToken;

const credentials = {
  username: "test-user",
  password: "test-password",
};

before(async () => {
  process.env.AUTH_USERNAME = credentials.username;
  process.env.AUTH_PASSWORD = credentials.password;
  process.env.JWT_SECRET = "test-jwt-secret-with-enough-entropy";
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

beforeEach(async () => {
  await Product.deleteMany({});
  const response = await request(app)
    .post("/api/auth/login")
    .send(credentials)
    .expect(200);
  accessToken = response.body.access_token;
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const validProduct = {
  name: "Clavier mécanique",
  description: "Clavier compact",
  price: 89.9,
  category: "Informatique",
};

test("crée, consulte, liste, modifie partiellement, remplace et supprime un produit", async () => {
  const created = await request(app)
    .post("/api/products")
    .send(validProduct)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect("Content-Type", /json/)
    .expect(201);

  const id = created.body.data._id;
  assert.equal(created.body.data.name, validProduct.name);

  await request(app).get(`/api/products/${id}`).expect(200);
  await request(app).get("/api/products").expect(200);

  await request(app)
    .patch(`/api/products/${id}`)
    .send({ price: 79.9 })
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(200);
  assert.equal((await Product.findById(id)).price, 79.9);

  const replacement = { ...validProduct, name: "Clavier remplacé" };
  await request(app)
    .put(`/api/products/${id}`)
    .send(replacement)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(200);
  assert.equal((await Product.findById(id)).name, replacement.name);

  const deleted = await request(app)
    .delete(`/api/products/${id}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(204);
  assert.equal(deleted.text, "");
  await request(app).get(`/api/products/${id}`).expect(404);
});

test("authentifie un utilisateur et retourne un jeton valable cinq minutes", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send(credentials)
    .expect(200);

  const payload = jwt.decode(response.body.access_token);
  assert.equal(response.body.token_type, "Bearer");
  assert.equal(response.body.expires_in, 300);
  assert.equal(payload.exp - payload.iat, 300);
});

test("refuse les identifiants invalides et protege toutes les ecritures", async () => {
  await request(app)
    .post("/api/auth/login")
    .send({ username: credentials.username })
    .expect(400);

  await request(app)
    .post("/api/auth/login")
    .send({ username: credentials.username, password: "incorrect" })
    .expect(401);

  const protectedRequests = [
    request(app).post("/api/products").send(validProduct),
    request(app)
      .put("/api/products/507f1f77bcf86cd799439011")
      .send(validProduct),
    request(app)
      .patch("/api/products/507f1f77bcf86cd799439011")
      .send({ price: 10 }),
    request(app).delete("/api/products/507f1f77bcf86cd799439011"),
  ];

  for (const protectedRequest of protectedRequests) {
    const response = await protectedRequest.expect(401);
    assert.match(response.headers["www-authenticate"], /^Bearer/);
  }

  const expiredToken = jwt.sign(
    { sub: credentials.username },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "-1s" },
  );
  await request(app)
    .post("/api/products")
    .set("Authorization", `Bearer ${expiredToken}`)
    .send(validProduct)
    .expect(401);

  await request(app).get("/api/products").expect(200);
});

test("refuse un prix négatif et un remplacement incomplet", async () => {
  await request(app)
    .post("/api/products")
    .send({ ...validProduct, price: -1 })
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(400);

  await request(app)
    .put("/api/products/507f1f77bcf86cd799439011")
    .send({ name: "Incomplet" })
    .set("Authorization", `Bearer ${accessToken}`)
    .expect(400);
});
