const axios = require("axios");
const DB_URL = require("../config/db");

exports.getAvatarByUserId = async (userId) => {
  const { data } = await axios.get(`${DB_URL}/avatars?userId=${userId}`);
  return data.length > 0 ? data[0] : null;
};

exports.createAvatar = async (avatarData) => {
  const { data } = await axios.post(`${DB_URL}/avatars`, avatarData);
  return data;
};

exports.updateAvatar = async (id, avatarData) => {
  const { data } = await axios.patch(`${DB_URL}/avatars/${id}`, avatarData);
  return data;
};
