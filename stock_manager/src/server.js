const express = require("express");

//Routes
const usersRoutes = require("./routes/users");
const staffRoutes = require("./routes/staff");
const productsRoutes = require("./routes/products");
const purchasesRoutes = require("./routes/purchases");
const suppliersRoutes = require("./routes/suppliers");

class Server {
  constructor() {
    this.app = express();
    this.port = 3000;
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.app.use(express.json());
  }

  routes() {
    //Routes
    this.app.use("/users", usersRoutes);
    this.app.use("/staff", staffRoutes);
    this.app.use("/products", productsRoutes);
    this.app.use("/suppliers", suppliersRoutes);
   this.app.use("/purchases", purchasesRoutes);
  }

  start() {
    this.app.listen(this.port, () => {
      console.log("Server listening on port " + this.port);
    });
  }
}

module.exports = { Server };
