const express = require("express");

const app = express();
app.get("/login", (req, res) => {
  res.send("Login!");
});

app.get("/register", (req, res) => {
  res.send("Register!");
});

app.listen(2000, () => console.log("Server is running on port 2000"));
