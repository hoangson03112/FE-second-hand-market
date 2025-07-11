import ApiService from "./ApiService";

export const getAddresses = async (token) => {
  const res = await ApiService.get("/addresses", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addAddress = async (address, token) => {
  const res = await ApiService.post("/addresses", address, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
