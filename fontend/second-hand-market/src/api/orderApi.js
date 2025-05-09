import axios from "axios";
const API_URL = "http://localhost:2000/eco-market/orders";

export const createOrder = async (orderPayload, token) => {
  const res = await axios.post(API_URL, orderPayload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}; 