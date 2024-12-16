const { request, response } = require("express");
const pool = require("../db/conection");
const { staffQueries } = require("../models/staff");

//MOSTRAR TODOS USUARIOS
const getAllStaff = async (req = request, res = response) => {
  console.log(getAllStaff);
  let conn;
  try {
    conn = await pool.getConnection();
    const staff = await conn.query(staffQueries.getAll);
    res.send(staff);
  } catch (error) {
    res.status(500).send(error); //'Interna server error'
    return;
  } finally {
    if (conn) conn.end();
  }
};

//Mostrar Usuario por ID
const getStaffById = async (req = request, res = response) => {
  const { id } = req.params;

  console.log(getStaffById);

  if (isNaN(id)) {
    res.status(400).send("ID invalido");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const staffMember = await conn.query(staffQueries.getById, [+id]);

    if (staffMember.length === 0) {
      res.status(404).send("Staff Member not found ");
      return;
    }
    res.send(staffMember);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

////            ESTO FUE TAREA que depues nos enseño el PROFE
//Crear Usuario
const createStaff = async (req = request, res = response) => {
  const {
    first_name,
    last_name,
    birth_date,
    gender,
    phone_number,
    email,
    address,
    user_id,
  } = req.body;

  console.log(createStaff);

  if (
    !first_name ||
    !last_name ||
    !birth_date ||
    !gender ||
    !phone_number ||
    !email ||
    !address ||
    !user_id
  ) {
    //verificar que esten los campos
    res.status(400).send("Bad request. Some fields are missing");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const staffMenber = await conn.query(staffQueries.getByEmail, [email]);

    if (staffMenber.length > 0) {
      res.status(409).send("Email ya existe");
      return;
    }

    const newStaffMember = await conn.query(staffQueries.create, [
      first_name,
      last_name,
      birth_date,
      gender,
      phone_number,
      email,
      address,
      user_id,
    ]);

    if (newStaffMember.affectedRows === 0) {
      //verificar si hubo camnios en la base de Datos
      res.status(500).send("staffmember no be created");
      return;
    }
    //console.log(newUser);
    res.status(201).send("staffmember created succesfully"); //si no pues SI HUBO cambios
  } catch (error) {
    res.status(500).send(error);
    return;
  } finally {
    if (conn) conn.end(); //Termina la conexion al final de todo
  }
};

//Actualizar usuario -- Sirve Bien
const updateStaff = async (req = request, res = response) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    birth_date,
    gender,
    phone_number,
    email,
    address,
    user_id,
  } = req.body;

  console.log(updateStaff);

  // Verificación de ID válido
  if (isNaN(id)) {
    res.status(400).send("Invalid ID");
    return;
  }

  // Verificación de que todos los datos estén presentes
  // if (!username || !password || !email) {
  //     res.status(400).send("Bad request. Some fields are missing");
  //     return;
  // }

  let conn;
  try {
    // Conexión a la base de datos
    conn = await pool.getConnection();

    // Verificar si el usuario existe
    const staffMember = await conn.query(staffQueries.getById, [id]);
    if (staffMember.length === 0) {
      res.status(404).send("staff not found");
      return;
    }

    // Actualizar el usuario //PASAR 8 CAMPOS
    const updatedStaffMember = await conn.query(staffQueries.update, [
      first_name,
      last_name,
      birth_date,
      gender,
      phone_number,
      email,
      address,
      user_id,
      +id,
    ]);

    // Comprobar si la actualización fue exitosa
    if (updatedStaffMember.affectedRows === 0) {
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
const deleteStaff = async (req = request, res = response) => {
  const { id } = req.params;
  console.log(deleteStaff);

  if (isNaN(id)) {
    res.status(400).send("Invalid ID");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const staffMember = await conn.query(staffQueries.getById, [+id]);

    if (staffMember.length === 0) {
      res.status(500).send("eror no encontrado");
      return;
    }

    const deleteStaffMember = await conn.query(staffQueries.delete, [+id]);
    if (deleteStaffMember.affectedRows === 0) {
      res.status(500).send("Staff could not be deleted");
      return;
    }

    res.send("staff borrado exitosamente");
  } catch (error) {
    res.status(500).send(error);
    return;
  } finally {
    // Cerrar la conexión
    if (conn) conn.end();
  }
};

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};
