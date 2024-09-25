const Account = require("../models/Account");
const jwt = require("jsonwebtoken");
const GenerateToken = require("../util/token");
const {
  generateVerificationCode,
  sendVerificationEmail,
} = require("../util/verifiEmail");

class AccountController {
  async Login(req, res) {
    try {
      let data = req.body;
      const account = await Account.findOne({
        username: data.username,
        password: data.password,
      });

      if (account) {
        if (account.status === "active") {
          const token = GenerateToken(account._id);
          return res.json({
            status: "success",
            message: "Login successful",
            token,
          });
        }
        if (account.status === "inactive") {
          return res.json({
            status: "inactive",
            message: "Tài khoản chưa được kích hoạt",
          });
        }
      } else {
        return res.status(401).json({
          status: "login",
          message: "Sai tên đăng nhập hoặc mật khẩu",
        });
      }
    } catch (error) {
      return res.status(500).json({ status: "error", message: "Server error" });
    }
  }

  // Xử lý đăng ký
  async Register(req, res) {
    try {
      const data = req.body;

      const username = await Account.findOne({ username: data.username });
      const email = await Account.findOne({ email: data.email });
      const phoneNumber = await Account.findOne({
        phoneNumber: data.phoneNumber,
      });

      if (username) {
        return res.status(401).json({ status: "error", type: "username" });
      }

      if (email) {
        return res.status(401).json({ status: "error", type: "email" });
      }

      if (phoneNumber) {
        return res.status(401).json({ status: "error", type: "phoneNumber" });
      }

      const verificationCode = generateVerificationCode();
      await sendVerificationEmail(data.email, verificationCode);

      const newAccount = new Account(data);
      await newAccount.save();

      await Account.updateOne(
        { _id: newAccount._id },
        { verificationCode, codeExpires: Date.now() + 15 * 60 * 1000 } // 15 phút hết hạn
      );

      return res.status(201).json({
        status: "success",
        message: "Code sent successfully",
        accountID: newAccount._id,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: "error", message: "Server error" });
    }
  }

  async Authentication(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ status: "error", message: "No token provided" });
      }

      const data = jwt.verify(token, "sown");
      const account = await Account.findById(data._id);

      return res.json({
        status: "success",
        account: {
          fullName: account?.fullName,
          avatar: account?.avatar,
          cart: account?.cart,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "error", message: "Server error" });
    }
  }
  async Verify(req, res) {
    const account = await Account.findOne({ _id: req.body.userID });
    const token = GenerateToken(account._id);
    if (!account) {
      return res.status(404).json({
        status: "error",
        message: "Account not found",
      });
    }
    if (
      account.verificationCode === req.body.code &&
      Date.now() < account.codeExpires
    ) {
      account.status = "active";
      account.verificationCode = undefined; // Xóa mã xác thực sau khi thành công
      account.codeExpires = undefined; // Xóa thời gian hết hạn sau khi thành công
      await account.save();

      return res.status(200).json({
        status: "success",
        message: "Account successfully verified",
        token,
      });
    } else {
      // Mã xác thực không hợp lệ hoặc đã hết hạn

      return res.status(400).json({
        status: "error",
        message: "Invalid or expired verification code",
      });
    }
  }

  async createAccountByAdmin(req, res) {
    try {
      let data = req.body;

      const username = await Account.findOne({
        username: data.username,
      });
      const email = await Account.findOne({
        email: data.email,
      });
      const phoneNumber = await Account.findOne({
        phoneNumber: data.phoneNumber,
      });

      if (username) {
        return res.status(401).json({
          status: "error",
          type: "username",
        });
      }

      if (email) {
        return res.status(401).json({
          status: "error",
          type: "email",
        });
      }

      if (phoneNumber) {
        return res.status(401).json({
          status: "error",
          type: "phoneNumber",
        });
      }

      const newAccount = new Account(data);
      await newAccount.save();

      return res.status(201).json({
        status: "success",
        message: "Code sent successfully",
        accountID: newAccount._id,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "error", message: "Server error" });
    }
  }
  async updateAccountByAdmin(req, res) {
    try {
      const { userId } = req.params;
      const {
        username,
        email,
        role,
        password,
        phoneNumber,
        status,
        addresses,
      } = req.body;

      // Tạo một đối tượng chứa các trường sẽ được cập nhật
      const updateFields = {};

      // Kiểm tra từng trường có được gửi trong body không, nếu có thì thêm vào đối tượng updateFields
      if (username) updateFields.username = username;
      if (email) updateFields.email = email;
      if (role) updateFields.role = role;
      if (password) updateFields.password = password;
      if (phoneNumber) updateFields.phoneNumber = phoneNumber;
      if (status) updateFields.status = status;
      if (addresses) updateFields.addresses = addresses;

      // Nếu không có trường nào được gửi, trả về lỗi
      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: "No fields to update" });
      }

      // Tìm và cập nhật thông tin tài khoản
      const updatedAccount = await Account.findByIdAndUpdate(
        userId,
        {
          $set: updateFields,
        },
        { new: true }
      );

      if (!updatedAccount) {
        return res.status(404).json({ message: "Account not found" });
      }

      res.status(200).json({
        message: "Account updated successfully",
        account: updatedAccount,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
  async getAccountsByAdmin(req, res) {
    try {
      // Lấy tất cả các tài khoản từ cơ sở dữ liệu
      const accounts = await Account.find();

      // Nếu không tìm thấy tài khoản nào
      if (accounts.length === 0) {
        return res.status(404).json({ message: "No accounts found" });
      }

      // Trả về danh sách tài khoản
      res.status(200).json({
        message: "Accounts retrieved successfully",
        accounts: accounts,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
  async getAccountById(req, res) {
    const accountId = req.params.id;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    try {
      const account = await Account.findById(accountId).select("-password");

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      return res.status(200).json(account);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new AccountController();
