const { request, response } = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db/connection");
const { usersQueries } = require("../models/users");

const saltRounds = 10;

//Obtener todos lo usuarios
const getAllUsers = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const users = await conn.query(usersQueries.getAll);
    res.send(users);
  } catch (error) {
    res.status(500).send(error); //'Internal server error'
    return;
  } finally {
    if (conn) conn.end();
  }
};

//Obtener usuario por ID
const getUserById = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).send("Invalid ID");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const user = await conn.query(usersQueries.getById, [+id]);
    if (user.length === 0) {
      res.status(404).send("User not found");
      return;
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

//Agregar un nuevo usuario
const createUser = async (req = request, res = response) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    res.status(400).send("Bad request");
    return;
  }

  let conn;

  try {
    conn = await pool.getConnection();

    const user = await conn.query(usersQueries.getByUsername, [username]);

    if (user.length > 0) {
      res.status(409).send("User alredy exists");
      return;
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await conn.query(usersQueries.create, [
      username,
      hashPassword,
      email,
    ]);

    if (newUser.affecteRows === 0) {
      res.status(500).send("User not be created");
      return;
    }

    res.status(201).send("User Created succesfully");
  } catch (error) {
    res.status(500).send(error);
    return;
  } finally {
    if (conn) conn.end();
  }
};

const loginUser = async (req = request, res = response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send("User and Password are mandatoty");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const user = await conn.query(usersQueries.getByUsername, [username]);

    if (user.length === 0) {
      res.status(404).send("Bad username or password");
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user[0].password);

    if (!passwordMatch) {
      res.status(403).send("Bad username or password");
    }

    res.send("Loged in");
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

//Modificar
const updateUser = async (req = request, res = response) => {
  const { id } = req.params;
  const { username, password, email } = req.body;

  // Validación básica
  if (isNaN(id) || (!username && !password && !email)) {
    res.status(400).send("Invalid request. Provide valid fields to update.");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // Verificar si el usuario existe
    const user = await conn.query(usersQueries.getById, [+id]);
    if (user.length === 0) {
      res.status(404).send("User not found");
      return;
    }

    // Preparar los campos para actualizar
    const updatedFields = {
      username: username || user[0].username,
      email: email || user[0].email, // Asegúrate de incluir email
      password: user[0].password, // Si no se proporciona password, se mantiene el anterior
    };

    // Si se proporciona un nuevo password, lo actualizamos
    if (password) {
      updatedFields.password = await bcrypt.hash(password, saltRounds);
    }

    // Realizar la actualización en la base de datos
    const result = await conn.query(usersQueries.update, [
      updatedFields.username,
      updatedFields.password,
      updatedFields.email,
      +id,
    ]);

    // Verificar si la actualización fue exitosa
    if (result.affectedRows === 0) {
      res.status(500).send("User could not be updated");
      return;
    }

    res.send("User updated successfully");
  } catch (error) {
    console.error(error); // Log de errores para depuración
    res.status(500).send("An error occurred while updating the user");
  } finally {
    if (conn) conn.end();
  }
};

//Eliminarr
const deleteUser = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).send("Invalid ID");
    return;
  }
  let conn;
  try {
    conn = await pool.getConnection();
    const user = await conn.query(usersQueries.getById, [+id]);
    if (user.length === 0) {
      res.status(404).send("User not found");
      return;
    }
    const deleteUser = await conn.query(usersQueries.delete, [+id]);
    if (deleteUser.affectedRows === 0) {
      res.status(500).send("User could not be deleted");
      return;
    }
    res.send("User deleted sucessfully");
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
};
