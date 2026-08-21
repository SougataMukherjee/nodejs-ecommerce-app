import axios from "./axios";

export const getOrders = () => axios.get("/orders").then((res) => res.data);

export const createOrder = (order) => axios.post("/orders", order).then((res) => res.data);

export const updateOrderStatus = (id, status) =>
  axios.patch(`/orders/${id}`, { status }).then((res) => res.data);
