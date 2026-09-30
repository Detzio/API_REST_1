const express = require("express");
const productController = require("../controllers/productController");
const validateProduct = require("../middleware/validateProduct");

const router = express.Router();

router
  .route("/")
  .get(productController.listProducts)
  .post(validateProduct(), productController.createProduct);

router
  .route("/:id")
  .get(productController.getProduct)
  .put(validateProduct(), productController.updateProduct)
  .patch(validateProduct({ partial: true }), productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
