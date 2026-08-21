import api from "./axios";

export const getProducts = (params = {}) =>
  api.get("/products", { params });

export const getProduct = (id) =>
  api.get(`/products/${id}`);

export const createProduct = (product) =>
  api.post("/products", product);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);