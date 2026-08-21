const router = require("express").Router();

const {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct
} = require(
  "../controllers/productController"
);

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.delete("/:id", deleteProduct);

module.exports = router;