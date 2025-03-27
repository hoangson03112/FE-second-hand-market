import axios from "axios";

class AccountContext {
  async Login(username, password) {
    if (!username || !password) {
      return { message: "Vui lòng nhập đầy đủ username và password." };
    }

    try {
      const data = await axios.post("http://localhost:2000/eco-market/login", {
        username,
        password,
      });

      if (data.data.status === "success") {
        localStorage.setItem("token", data.data.token);
        window.location.href = "/eco-market/home";
      } else {
        return data.data;
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
        "http://localhost:2000/eco-market/register",
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
        return { message: "Chưa đăng nhập", status: 401, type: "login" };
      }

      const data = await axios.get(
        "http://localhost:2000/eco-market/authentication",
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
    } catch (error) {}
  }
  async Verify(userID, code) {
    if (!userID || !code) {
      return { message: "Vui lòng cung cấp userID và mã xác thực." };
    }

    try {
      const { data } = await axios.post(
        "http://localhost:2000/eco-market/verify",
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
    try {
      const response = await axios.get(
        `http://localhost:2000/eco-market/account/${accountId}`
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching account:", error);
      throw error;
    }
  }
  async changePassword(passwordData) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:2000/eco-market/auth/change-password",
        passwordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  }
  async updateAccountInfo(newInfo) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Bạn chưa đăng nhập!");
        return;
      }

      const response = await axios.put(
        "http://localhost:2000/eco-market/account/update",
        newInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log(response);
      }
    } catch (error) {
      console.error("Lỗi cập nhật tài khoản:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại!");
    }
  }
  async getAccounts() {
    try {
      const response = await axios.get(
        "http://localhost:2000/eco-market/accounts"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching account list:", error);
      throw error;
    }
  }
  async createAccountByAdmin(accountInfo) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Bạn chưa đăng nhập!");
        return;
      }
      const response = await axios.post(
        "http://localhost:2000/eco-market/admin/account/create",
        accountInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  }
  async updateAccountByAdmin(accountId, role, status) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Bạn chưa đăng nhập!");
        return;
      }

      const response = await axios.put(
        `http://localhost:2000/eco-market/admin/account/update/${accountId}`,
        { role, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating account:", error);
      throw error;
    }
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new AccountContext();
