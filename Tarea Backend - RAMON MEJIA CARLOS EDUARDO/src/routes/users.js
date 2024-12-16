//Este código define las rutas para gestionar las operaciones CRUD (Crear, Leer, Actualizar y Eliminar)
//Importa funciones desde el archivo controllers/users.
//Estas funciones contienen la lógica para manejar cada tipo de solicitud (GET, POST, PUT, DELETE).

const { Router } = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.post("/login", loginUser);

router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
