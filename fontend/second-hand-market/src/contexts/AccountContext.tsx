import ApiService from "../services/ApiService";
import storage from "../utils/storage";

class AccountContext {
  async Register(username, email, password, phoneNumber, fullName) {
    if (!username || !password || !email || !phoneNumber || !fullName) {
      return { message: "Vui lòng nhập đầy đủ thông tin đăng ký." };
    }

    try {
      const data = await ApiService.post("/accounts/register", {
        username,
        password,
        email,
        phoneNumber,
        fullName,
      });

      return data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return error.response.data;
      }
      return { status: "error", message: "Đã xảy ra lỗi, vui lòng thử lại sau." };
    }
  }

  async Authentication() {
    try {
      const token = storage.getToken();
      
      if (!token) {
        return { message: "Chưa đăng nhập", status: 401, type: "login" };
      }

      const data = await ApiService.get("/accounts/auth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.error("Authentication error:", error);
      return { status: "error", message: "Lỗi xác thực" };
    }
  }

  async Verify(userID, code) {
    if (!userID || !code) {
      return { message: "Vui lòng cung cấp userID và mã xác thực." };
    }

    try {
      const data = await ApiService.post("/accounts/verify", {
        userID,
        code,
      });

      if (data.status === "success") {
        storage.setToken(data.token);
        return data;
      }
      return data;
    } catch (error) {
      console.error("Verification error:", error);
      return { status: "error", message: "Đã xảy ra lỗi khi xác thực." };
    }
  }
  async getAccount(accountId) {
    try {
      const response = await ApiService.get(`/accounts/${accountId}`);
      return response;
    } catch (error) {
      console.error("Error fetching account:", error);
      throw error;
    }
  }
  async changePassword(passwordData) {
    try {
      const token = storage.getToken();
      
      if (!token) {
        throw new Error("Chưa đăng nhập");
      }

      const response = await ApiService.put(
        "/accounts/change-password",
        passwordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || "Đổi mật khẩu thất bại");
    }
  }

  async updateAccountInfo(newInfo) {
    try {
      const token = storage.getToken();

      if (!token) {
        throw new Error("Bạn chưa đăng nhập!");
      }

      const response = await ApiService.put("/accounts/update", newInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response;
    } catch (error) {
      console.error("Lỗi cập nhật tài khoản:", error);
      throw new Error(error.response?.data?.message || "Cập nhật thất bại");
    }
  }
  async getAccounts() {
    try {
      const response = await ApiService.get("/accounts/admin/list");
      return response;
    } catch (error) {
      console.error("Error fetching account list:", error);
      throw error;
    }
  }

  async createAccountByAdmin(accountInfo) {
    try {
      const token = storage.getToken();

      if (!token) {
        throw new Error("Bạn chưa đăng nhập!");
      }

      const response = await ApiService.post(
        "/accounts/admin/create",
        accountInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  }

  async updateAccountByAdmin(accountId, role, status) {
    try {
      const token = storage.getToken();

      if (!token) {
        throw new Error("Bạn chưa đăng nhập!");
      }

      const response = await ApiService.put(
        `/accounts/admin/update/${accountId}`,
        { role, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating account:", error);
      throw error;
    }
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new AccountContext();

