const router = require("express").Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require("../controllers/cartController");

router.get("/", getCart);

router.post("/", addToCart);

router.patch("/:id", updateCartItem);

router.delete("/", clearCart);

router.delete("/:id", removeFromCart);

module.exports = router;