import api from "./axios";

export const getAvatar = () => api.get("/avatar").then((res) => res.data);
export const updateAvatar = (image) => api.put("/avatar", { image }).then((res) => res.data);
