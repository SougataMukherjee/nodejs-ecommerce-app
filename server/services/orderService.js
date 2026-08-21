const axios = require("axios");
const DB_URL = require("../config/db");

exports.getOrders = async () => {
  const { data } = await axios.get(`${DB_URL}/orders`);
  return data;
};

exports.createOrder = async (orderData) => {
  const { data } = await axios.post(`${DB_URL}/orders`, orderData);
  return data;
};

exports.updateOrderStatus = async (id, status) => {
  const { data } = await axios.patch(`${DB_URL}/orders/${id}`, { status });
  return data;
};
