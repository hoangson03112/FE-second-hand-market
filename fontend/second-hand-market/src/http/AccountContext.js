import axios from "axios";

class AccountContext {
  async Login(username, password) {
    try {
      const response = await axios.post(
        "http://localhost:2000/ecomarket/login",
        { username, password }
      );
      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.token);
        window.location.href = "/ecomarket/home";
      } else {
        return response.data;
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return error.response.data;
      } else {
        return "Đã xảy ra lỗi, vui lòng thử lại sau.";
      }
    }
  }

  async Register(username, email, password, phoneNumber) {
    try {
      const response = await axios.post(
        "http://localhost:2000/ecomarket/register",
        { username, password, email, phoneNumber }
      );
      if (response.data.status === "success") {
        return response.data;
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return error.response.data;
      }
    }
  }
  async Authentication() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await axios.get(
        "http://localhost:2000/ecomarket/authentication",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
          },
        }
      );

      if (response.data.status === "success") {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return error;
    }
  }
  async Verify(userID, code) {
    try {
      const response = await axios.post(
        "http://localhost:2000/ecomarket/verify",
        {
          userID,
          code,
        }
      );
      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.token);
        return response.data;
      }
    } catch (error) {}
  }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new AccountContext();
