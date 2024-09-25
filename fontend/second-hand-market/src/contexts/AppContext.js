import axios from "axios";

class AppContext {
  async fetchProvinces() {
    const data = await axios.get("https://provinces.open-api.vn/api/");
    return data;
  }
}
export default new AppContext();
