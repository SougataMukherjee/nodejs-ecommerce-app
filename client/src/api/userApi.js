import axios from "./axios";

export const getUsers = () => axios.get("/users").then((res) => res.data);
