const express = require("express");
const route = require("./routes");
const db = require("./config/db/index");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);
io.on("connection", (socket) => {
  console.log("A user connected");

  // Gửi lại danh sách tin nhắn khi có người kết nối
  socket.emit("loadMessages", messages);

  // Lắng nghe sự kiện gửi tin nhắn
  socket.on("sendMessage", (message) => {
    messages.push(message); // Lưu tin nhắn vào array
    io.emit("newMessage", message); // Gửi tin nhắn đến tất cả người dùng
  });

  
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.use(cors());
app.use(express.json());
db.connect();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(cookieParser());

route(app);
app.listen(2000, () => console.log("Server is running on port 2000"));
