const jwt = require("jsonwebtoken");

const GenerateToken = (id) => {
  return jwt.sign({ _id: id }, "sown", {
    expiresIn: "3h",
  });
};
module.exports = GenerateToken;
