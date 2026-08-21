const router = require("express").Router();
const { getOrders, createOrder, updateOrderStatus } = require("../controllers/orderController");

router.get("/", getOrders);
router.post("/", createOrder);
router.patch("/:id", updateOrderStatus);

module.exports = router;
