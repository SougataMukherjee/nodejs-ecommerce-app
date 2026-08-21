const axios = require("axios");
const DB_URL = require("../config/db");

exports.getUsers = async () => {
  const { data } = await axios.get(`${DB_URL}/users`);
  return data;
};