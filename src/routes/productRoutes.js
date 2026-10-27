const express = require("express");
const productController = require("../controllers/productController");
const authenticateToken = require("../middleware/authenticateToken");
const validateProduct = require("../middleware/validateProduct");

const router = express.Router();

router
  .route("/")
  .get(productController.listProducts)
  .post(authenticateToken, validateProduct(), productController.createProduct);

router
  .route("/:id")
  .get(productController.getProduct)
  .put(authenticateToken, validateProduct(), productController.updateProduct)
  .patch(
    authenticateToken,
    validateProduct({ partial: true }),
    productController.updateProduct,
  )
  .delete(authenticateToken, productController.deleteProduct);

module.exports = router;
