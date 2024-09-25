import axios from "axios";

class AccountContext {
  async Login(username, password) {
    if (!username || !password) {
      return { message: "Vui lòng nhập đầy đủ username và password." };
    }

    try {
      const { data } = await axios.post(
        "http://localhost:2000/ecomarket/login",
        { username, password }
      );
      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        window.location.href = "/ecomarket/home";
      } else {
        return data;
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return error.response.data;
      } else {
        return "Đã xảy ra lỗi, vui lòng thử lại sau.";
      }
    }
  }

  async Register(username, email, password, phoneNumber, fullName) {
    if (!username || !password || !email || !phoneNumber || !fullName) {
      return { message: "Vui lòng nhập đầy đủ thông tin đăng ký." };
    }

    try {
      const { data } = await axios.post(
        "http://localhost:2000/ecomarket/register",
        { username, password, email, phoneNumber, fullName }
      );

      if (data.status === "success") {
        return data;
      } else {
        return data;
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return error.response.data;
      } else {
        return "Đã xảy ra lỗi, vui lòng thử lại sau.";
      }
    }
  }

  async Authentication() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const { data } = await axios.get(
        "http://localhost:2000/ecomarket/authentication",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.status === "success") {
        return data;
      } else {
        return data;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return "Đã xảy ra lỗi khi xác thực.";
    }
  }

  async Verify(userID, code) {
    if (!userID || !code) {
      return { message: "Vui lòng cung cấp userID và mã xác thực." };
    }

    try {
      const { data } = await axios.post(
        "http://localhost:2000/ecomarket/verify",
        {
          userID,
          code,
        }
      );
      if (data.status === "success") {
        localStorage.setItem("token", data.token);
        return data;
      } else {
        return data;
      }
    } catch (error) {
      return "Đã xảy ra lỗi khi xác thực.";
    }
  }
  async getAccount(accountId) {
    const response = await axios.get(
      `http://localhost:2000/ecomarket/account/${accountId}`
    );
    console.log(response);

    return response;
  }
}

export default new AccountContext();
