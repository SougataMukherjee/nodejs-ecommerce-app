import api from "./axios";

export const getCart = () =>
  api.get("/cart");

export const addToCart = (product) =>
  api.post("/cart", product);

export const updateCartItem = (id, data) =>
  api.patch(`/cart/${id}`, data);

export const removeFromCart = (id) =>
  api.delete(`/cart/${id}`);

export const clearCart = () =>
  api.delete("/cart");
