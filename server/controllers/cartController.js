const axios = require("axios");

const DB_URL = "http://localhost:5000";

exports.getCart = async (req, res) => {
  const userId = req.user.id;
  const { data } = await axios.get(
    `${DB_URL}/cart?userId=${userId}`
  );

  res.json(data);
};

exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { data } = await axios.post(
    `${DB_URL}/cart`,
    { ...req.body, userId }
  );

  res.status(201).json(data);
};

exports.updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const { data: item } = await axios.get(`${DB_URL}/cart/${req.params.id}`);

  if (item.userId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { data } = await axios.patch(
    `${DB_URL}/cart/${req.params.id}`,
    req.body
  );
  res.json(data);
};

exports.removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { data: item } = await axios.get(`${DB_URL}/cart/${req.params.id}`);

  if (item.userId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await axios.delete(`${DB_URL}/cart/${req.params.id}`);

  res.json({ message: "Removed" });
};

exports.clearCart = async (req, res) => {
  const userId = req.user.id;
  const { data: items } = await axios.get(`${DB_URL}/cart?userId=${userId}`);
  await Promise.all(
    items.map((item) => axios.delete(`${DB_URL}/cart/${item.id}`))
  );
  res.json({ message: "Cart cleared" });
};