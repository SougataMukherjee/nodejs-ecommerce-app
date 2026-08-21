const axios = require("axios");
const DB_URL = require("../config/db");

exports.getProducts = async (query = {}) => {
  const params = new URLSearchParams();
  if (query.category) params.append("category", query.category);
  if (query.title) params.append("title_like", query.title);
  const { data } = await axios.get(`${DB_URL}/products?${params.toString()}`);
  return data;
};

exports.getProduct = async (id) => {
  const { data } = await axios.get(`${DB_URL}/products/${id}`);
  return data;
};

exports.createProduct = async (productData) => {
  const { data } = await axios.post(`${DB_URL}/products`, productData);
  return data;
};

exports.deleteProduct = async (id) => {
  await axios.delete(`${DB_URL}/products/${id}`);
  return { message: "Product deleted" };
};
