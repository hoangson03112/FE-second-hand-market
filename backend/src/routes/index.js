const router = require("./site");

function route(app) {
  app.use("/ecomarket", router);

}

module.exports = route;
