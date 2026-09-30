const { after, before, beforeEach, test } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const app = require("../src/app");
const Product = require("../src/models/Product");

let mongoServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

beforeEach(async () => {
  await Product.deleteMany({});
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
    .expect("Content-Type", /json/)
    .expect(201);

  const id = created.body.data._id;
  assert.equal(created.body.data.name, validProduct.name);

  await request(app).get(`/api/products/${id}`).expect(200);
  await request(app).get("/api/products").expect(200);

  await request(app)
    .patch(`/api/products/${id}`)
    .send({ price: 79.9 })
    .expect(200);
  assert.equal((await Product.findById(id)).price, 79.9);

  const replacement = { ...validProduct, name: "Clavier remplacé" };
  await request(app).put(`/api/products/${id}`).send(replacement).expect(200);
  assert.equal((await Product.findById(id)).name, replacement.name);

  const deleted = await request(app).delete(`/api/products/${id}`).expect(204);
  assert.equal(deleted.text, "");
  await request(app).get(`/api/products/${id}`).expect(404);
});

test("refuse un prix négatif et un remplacement incomplet", async () => {
  await request(app)
    .post("/api/products")
    .send({ ...validProduct, price: -1 })
    .expect(400);

  await request(app)
    .put("/api/products/507f1f77bcf86cd799439011")
    .send({ name: "Incomplet" })
    .expect(400);
});
