const { request, response } = require("express");
const pool = require("../db/conection");
const { clientsQueries } = require("../models/clients");

//MOSTRAR TODOS Clientes
const getAllClients = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const clients = await conn.query(clientsQueries.getAll);
    res.send(clients);
  } catch (error) {
    res.status(500).send(error); //'Interna server error'
    return;
  } finally {
    if (conn) conn.end();
  }
};

//Mostrar Usuarios por RFC
const getClientsByRfc = async (req = request, res = response) => {
  const { rfc } = req.params;

  //verificar si el RFC esta vacio
  if (!rfc || rfc.trim() === "") {
    res.status(400).send("RFC invalido");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const clients_rfc = await conn.query(clientsQueries.getByRfc, [rfc]);

    if (clients_rfc.length === 0) {
      res.status(404).send("RFC no encontrado");
      return;
    }
    res.send(clients_rfc);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

//Crear Cliente
const createClients = async (req = request, res = response) => {
  const {
    rfc,
    first_name,
    last_name,
    birth_date,
    gender,
    phone_number,
    email,
    address,
  } = req.body;

  if (
    !rfc ||
    !first_name ||
    !last_name ||
    !birth_date ||
    !gender ||
    !phone_number ||
    !email ||
    !address
  ) {
    //verificar que esten los campos
    res.status(400).send("Bad request. Some fields are missing");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const clients_rfc = await conn.query(clientsQueries.getByRfc, [rfc]);
    //verificar si existe rfc
    if (clients_rfc.length > 0) {
      res.status(409).send("Rfc ya existe");
      return;
    }

    //verificar si el correo existe
    const clients_email = await conn.query(clientsQueries.getByEmail, [email]);
    if (clients_email.length > 0) {
      res.status(409).send("Email ya existe");
      return;
    }

    const newClients = await conn.query(clientsQueries.create, [
      rfc,
      first_name,
      last_name,
      birth_date,
      gender,
      phone_number,
      email,
      address,
    ]);

    if (newClients.affectedRows === 0) {
      //verificar si hubo camnios en la base de Datos
      res.status(500).send("Cliente no be created");
      return;
    }
    res.status(201).send("Cliente created succesfully"); //si no pues SI HUBO cambios
  } catch (error) {
    res.status(500).send(error);
    return;
  } finally {
    if (conn) conn.end(); //Termina la conexion al final de todo
  }
};

//Actualizar Cliente
const updateClients = async (req = request, res = response) => {
  const { rfc } = req.params;
  const {
    first_name,
    last_name,
    birth_date,
    gender,
    phone_number,
    email,
    address,
  } = req.body;

  //ver si se llenan los campos
  if (
    !first_name ||
    !last_name ||
    !birth_date ||
    !gender ||
    !phone_number ||
    !email ||
    !address
  ) {
    //verificar que esten los campos
    res.status(400).send("Faltan rellenar algunos campos");
    return;
  }

  //verificar si el RFC esta vacio
  if (!rfc || rfc.trim() === "") {
    res.status(400).send("RFC invalido");
    return;
  }

  let conn;
  try {
    // Conexión a la base de datos
    conn = await pool.getConnection();

    //Verificar si el rfc existe -> cliuente existe
    const clients_rfc = await conn.query(clientsQueries.getByRfc, [rfc]);
    if (clients_rfc.length === 0) {
      res.status(404).send("RFC no encontrado");
      return;
    }

    //ver si el correo existe
    const clients_email = await conn.query(clientsQueries.getByEmail, [email]);
    // if(clients_email.length > 0){
    //     res.status(409).send("Email ya existe");
    //     return;
    // }
    //
    //ver si el correo existe y si pertenece al mismo cliente deja actualizar
    if (clients_email.length > 0) {
      // Si el correo ya existe, verificar que sea del mismo cliente
      const client = clients_email[0]; // El primer cliente con ese correo
      if (client.rfc !== rfc) {
        // Si el RFC no coincide, el correo pertenece a otro cliente
        res.status(409).send("Email ya existe en otro cliente");
        return;
      }
    }

    // Actualizar el usuario //PASAR 8 CAMPOS
    const updatedClients = await conn.query(clientsQueries.update, [
      first_name,
      last_name,
      birth_date,
      gender,
      phone_number,
      email,
      address,
      rfc,
    ]);

    // Comprobar si la actualización fue exitosa
    if (updatedClients.affectedRows === 0) {
      res.status(500).send("Cliente no actualizado correctamente");
      return;
    }

    // Responder con éxito
    res.status(200).send("clients updated successfully");
  } catch (error) {
    // Manejo de errores
    res.status(500).send(error.message || "Internal Server Error");
  } finally {
    // Cerrar la conexión
    if (conn) conn.end();
  }
};

//Eliminar Cliente  --> dejar inactivo
const deleteClients = async (req = request, res = response) => {
  const { rfc } = req.params;

  //verificar si el RFC esta vacio
  if (!rfc || rfc.trim() === "") {
    res.status(400).send("RFC invalido");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    //Verificar si el rfc existe -> cliuente existe
    const clients_rfc = await conn.query(clientsQueries.getByRfc, [rfc]);
    if (clients_rfc.length === 0) {
      res.status(404).send("RFC no encontrado");
      return;
    }

    const deleteClients_one = await conn.query(clientsQueries.delete, [rfc]);
    if (deleteClients_one.affectedRows === 0) {
      res.status(500).send("El cliente no ha sido borrado");
      return;
    }

    res.send("el cliente ha sido borrado exitosamente");
  } catch (error) {
    res.status(500).send(error);
    return;
  } finally {
    // Cerrar la conexión
    if (conn) conn.end();
  }
};

module.exports = {
  getAllClients,
  getClientsByRfc,
  createClients,
  updateClients,
  deleteClients,
};
