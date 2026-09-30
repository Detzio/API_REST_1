const Product = require("../models/Product");

async function listProducts(req, res) {
  const products = await Product.find().sort({ createdAt: -1 });
  res.status(200).json({ data: products });
}

async function getProduct(req, res) {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: { message: "Produit introuvable." } });
  }

  return res.status(200).json({ data: product });
}

async function createProduct(req, res) {
  const product = await Product.create(req.body);
  res.location(`/api/products/${product.id}`);
  res.status(201).json({ data: product });
}

async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: { message: "Produit introuvable." } });
  }

  product.set(req.body);
  await product.save();
  return res.status(200).json({ data: product });
}

async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ error: { message: "Produit introuvable." } });
  }

  return res.status(200).json({
    message: "Produit supprimé.",
    data: product,
  });
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
