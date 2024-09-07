const express = require("express");
const route = require("./routes");
const db = require("./config/db/index");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(express.json());
db.connect();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(cookieParser());

route(app);
app.listen(2000, () => console.log("Server is running on port 2000"));
