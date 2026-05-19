import ApiService from "./ApiService";

export const getAddresses = async () => {
  return await ApiService.get("/addresses");
};

export const addAddress = async (address) => {
  return await ApiService.post("/addresses/create", address);
};

export const updateAddress = async (id, address) => {
  return await ApiService.put(`/addresses/${id}`, address);
};

export const deleteAddress = async (id) => {
  return await ApiService.delete(`/addresses/${id}`);
};
