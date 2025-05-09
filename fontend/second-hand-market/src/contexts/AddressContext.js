import axios from "axios";
import authService from "../services/authService";

class AddressContext {
  async createAddress(address) {
    const token = authService.getToken();
    const response = await axios.post(
      "http://localhost:2000/eco-market/address/create",
      address,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
  async getAddresses() {
    const token = authService.getToken();
    const response = await axios.get(
      "http://localhost:2000/eco-market/address",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}

export default new AddressContext();
