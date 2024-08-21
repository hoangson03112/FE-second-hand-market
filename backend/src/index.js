const express = require("express");
const route = require("./routes");
const db = require("./config/db/index");
const app = express();
const cors = require('cors');

app.use(cors());
db.connect();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));

route(app);
app.listen(2000, () => console.log("Server is running on port 2000"));
