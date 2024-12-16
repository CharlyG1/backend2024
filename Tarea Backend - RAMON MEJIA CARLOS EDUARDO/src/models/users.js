//ESTE ES EL CODIGO PARA LAS CONSULTAS QUE SE HACEN

//const { getAllUsers } = require("../controllers/users");

const userQueries = {
  getAll: "SELECT * FROM users WHERE is_active=1",
  getById: "SELECT * FROM users WHERE id = ? AND is_active=1",
  getByUsername: "SELECT * FROM users WHERE username= ?",
  create: "INSERT INTO users (username, password, email) VALUES (?,?,?)",
  updateUser:
    "UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?",
  delete: "UPDATE users SET is_active= 0 WHERE id=?",
};

module.exports = { userQueries };
