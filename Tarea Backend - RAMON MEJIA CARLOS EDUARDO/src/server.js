//PARA USAR OTRA TABLA DB -----> CREAR LA RUTA EN ESTE ARCHIVO

const express = require("express");
const usersRoutes = require("./routes/users");
const staffRoutes = require("./routes/staff");
const productsRoutes = require("./routes/products");
const clientsRoutes = require("./routes/clients");
const salesRoutes = require("./routes/sales");

class Server {
  constructor() {
    //this.app=app;
    this.app = express();
    this.port = 3000;
    this.app.use(express.json());
    // es un middleware  que intercepta la solicitud para ver si hay algo en el formato JSON
    this.middlewares();
    this.routes();
  }

  //Importante ejecutarlo antes que el de routes
  middlewares() {
    this.app.use(express.json());
  }

  routes() {
    this.app.use("/users", usersRoutes);
    this.app.use("/staff", staffRoutes); // Rutas de staff
    this.app.use("/products", productsRoutes);
    this.app.use("/clients", clientsRoutes);
    this.app.use("/sales", salesRoutes);
  }

  start() {
    this.app.listen(3000, () => {
      console.log("Server listening on port " + this.port);
    });
  }
}

module.exports = { Server };
