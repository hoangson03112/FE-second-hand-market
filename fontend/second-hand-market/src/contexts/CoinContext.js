import axios from "axios";

const coinService = {
  async checkIn() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { message: "Vui lòng đăng nhập", status: 401 };
      }

      const { data } = await axios.post(
        "http://localhost:2000/eco-market/coins/check-in",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { status: "error", message: "Lỗi kết nối" };
    }
  },

  async getBalance() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { balance: 0 };
      }

      const { data } = await axios.get(
        "http://localhost:2000/eco-market/coins/balance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    } catch (error) {
      console.error("Lỗi khi lấy số dư xu:", error);
      return { balance: 0 };
    }
  },

  async useCoins(amount) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { message: "Vui lòng đăng nhập", status: 401 };
      }

      const { data } = await axios.post(
        "http://localhost:2000/eco-market/coins/use",
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { status: "error", message: "Lỗi kết nối" };
    }
  },
};

export default coinService;