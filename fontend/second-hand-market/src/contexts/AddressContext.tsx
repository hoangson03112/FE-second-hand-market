import ApiService from "../services/ApiService";

class AddressContext {
  async createAddress(address) {
    const response = await ApiService.post(
      "  /address/create",
      address
    );
    return response;
  }
  async getAddresses() {
    const response = await ApiService.get(
      "  /address"
    );
    return response;
  }
}

const addressContextInstance = new AddressContext();
export default addressContextInstance;

