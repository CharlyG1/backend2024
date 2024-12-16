const { request, response } = require("express");
const pool = require("../db/conection");
const { userQueries } = require("../models/users");
const bcrypt = require("bcrypt"); //esto es para encriptar contraseñas

const saltRounds = 10;

// const users =  [
//     {id: 1, name: 'Jonh dohe'},
//     {id: 2, name: 'juan carlos'},
//     {id: 3, name: 'jose jose'},
// ];

//MOSTRAR TODOS USUARIOS
const getAllUsers = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const users = await conn.query(userQueries.getAll);
    res.send(users);
    //ORM Object Relational Model
    //Lo que hacen es manejar la logic de las consultas en el modelo, nosotros lo haremos con las queries
  } catch (error) {
    res.status(500).send(error); //'Interna server error'
    return;
  } finally {
    if (conn) conn.end();
  }
};

//Mostrar Usuario por ID
const getUserById = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).send("ID invalido");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const user = await conn.query(userQueries.getById, [+id]);

    if (user.length === 0) {
      res.status(404).send("user not found ");
      return;
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

////            ESTO FUE TAREA que depues nos enseño el PROFE
//Crear Usuario
const createUser = async (req = request, res = response) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    //verificar que esten los campos
    res.status(400).send("Bad request. Some fields are missing");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const user = await conn.query(userQueries.getByUsername, [username]);

    if (user.length > 0) {
      res.status(409).send("user name ya existe");
      return;
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await conn.query(userQueries.create, [
      username,
      hashPassword,
      email,
    ]);

    if (newUser.affectedRows === 0) {
      //verificar si hubo camnios en la base de Datos
      res.status(500).send("user no be created");
      return;
    }
    //console.log(newUser);
    res.status(201).send("User created succesfully"); //si no pues SI HUBO cambios
  } catch (error) {
    res.status(500).send(error);
    return;
  } finally {
    if (conn) conn.end(); //Termina la conexion al final de todo
  }
};

const loginUser = async (req = request, res = response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send("username and pasword are mandatory!");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const user = await conn.query(userQueries.getByUsername, [username]);
    if (user.length === 0) {
      res._construct(404).send("Bad username or password");
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user[0].password);

    if (!passwordMatch) {
      res.status(403).send("Bad username or password");
    }

    res.send("Loged in!");
  } catch (error) {
    res.status(500).send(error);
    return;
  } finally {
    if (conn) conn.end(); //Termina la conexion al final de todo
  }
};

//------------------------------------------------------------------------------------
// Actualizar un usuario
// const updateUser = async (req = request, res = response) => {
//     const {id} = req.params;
//     const {name} = req.body;
//     //para ver que haya id
//     if (isNaN(id)) {
//         res.status(400).send('Invalid ID');
//         return;
//     }
//     //para ver que los datos esten completos
//     if(!username || !password || !email){
//         res.status(400).send("Bad request. Some fields are missing");
//         return;
//     }
//     try{
//         conn= await pool.getConnection();
//         const user = await conn.query(userQueries.getByUsername,[username]);

//     }catch(error){
//         res.status(500).send(error);
//         return;
//     }finally{
//         if (conn) conn.end();
//     }

//     const user = users.find(user => user.id === +id);
//     if (!user) {
//         res.status(404).send('User not found');
//         return;
//     }
//     users.forEach(user=>{
//       if(user.id===+id){
//           user.name=name;
//       }
//   });
//   res.send('user update succerfully');
//   }
//----------------------------------------------------------------

//Actualizar usuario -- Sirve Bien
const updateUser = async (req = request, res = response) => {
  const { id } = req.params;
  const { username, password, email } = req.body;

  // Verificación de ID válido
  if (isNaN(id)) {
    res.status(400).send("Invalid ID");
    return;
  }

  // Verificación de que todos los datos estén presentes
  if (!username || !password || !email) {
    res.status(400).send("Bad request. Some fields are missing");
    return;
  }

  let conn;
  try {
    // Conexión a la base de datos
    conn = await pool.getConnection();

    // Verificar si el usuario existe
    const user = await conn.query(userQueries.getById, [id]);
    if (user.length === 0) {
      res.status(404).send("User not found");
      return;
    }

    // Actualizar el usuario
    const updatedUser = await conn.query(userQueries.updateUser, [
      username,
      password,
      email,
      id,
    ]);

    // Comprobar si la actualización fue exitosa
    if (updatedUser.affectedRows === 0) {
      res.status(500).send("User could not be updated");
      return;
    }

    // Responder con éxito
    res.status(200).send("User updated successfully");
  } catch (error) {
    // Manejo de errores
    res.status(500).send(error.message || "Internal Server Error");
  } finally {
    // Cerrar la conexión
    if (conn) conn.end();
  }
};

//Eliminar Usuario por ID -- Hecho en Clase
// Ruta para obtener un usuario por ID
const deleteUser = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).send("Invalid ID");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const user = await conn.query(userQueries.getById, [+id]);

    if (user.length === 0) {
      res.status(500).send("eror no encontrado");
      return;
    }

    const deleteUser = await conn.query(userQueries.delete, [+id]);
    if (deleteUser.affectedRows === 0) {
      res.status(500).send("user could not be deleted");
      return;
    }

    res.send("User borrado exitosamente");
  } catch (error) {
    res.status(500).send(error);
    return;
  } finally {
    // Cerrar la conexión
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
