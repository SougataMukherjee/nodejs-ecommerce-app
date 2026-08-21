require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require(
  "./routes/authRoutes"
);

const productRoutes = require(
  "./routes/productRoutes"
);

const cartRoutes = require(
  "./routes/cartRoutes"
);

const orderRoutes = require(
  "./routes/orderRoutes"
);

const userRoutes = require(
  "./routes/userRoutes"
);

const avatarRoutes = require(
  "./routes/avatarRoutes"
);

const authMiddleware = require(
  "./middlewares/authMiddleware"
);

const app = express();

app.use(cors());

app.use(helmet());

app.use(express.json({ limit: "5mb" }));

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use(
  "/api/cart",
  authMiddleware,
  cartRoutes
);

app.use(
  "/api/orders",
  authMiddleware,
  orderRoutes
);

app.use(
  "/api/users",
  authMiddleware,
  userRoutes
);

app.use(
  "/api/avatar",
  authMiddleware,
  avatarRoutes
);

app.get("/", (req, res) => {
  res.json({
    message: "Server Running"
  });
});

app.listen(8080, () => {
  console.log(
    "Server running on port 8080"
  );
});