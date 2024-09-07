const nodemailer = require("nodemailer");
const Account = require("../models/Account");

const generateVerificationCode = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

// Tạo transporter cho dịch vụ email
const transporter = nodemailer.createTransport({
  service: "Gmail", // Hoặc dùng các dịch vụ email khác như Yahoo, Outlook
  auth: {
    user: "rtwf0311@gmail.com", // Thay bằng email của bạn
    pass: "xuwy ptin nsju noyu", // Thay bằng mật khẩu email của bạn
  },
});

const sendVerificationEmail = (userEmail, verificationCode) => {
  const mailOptions = {
    from: "rtwf0311@gmail.com",
    to: userEmail,
    subject: "Mã xác thực tài khoản",
    text: `Mã xác thực của bạn là: ${verificationCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Lỗi khi gửi email:", error);
    } else {
      console.log("Email đã được gửi:", info.response);
    }
  });
};

module.exports = {
  generateVerificationCode,
  sendVerificationEmail,
};
