const { request, response } = require("express");
const pool = require("../db/connection");
const { staffQueries } = require("../models/staff");

// Obtener registros de staff
const getAllStaff = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const staff = await conn.query(staffQueries.getAll); 
    res.send(staff);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

// Obtener por ID
const getStaffById = async (req = request, res = response) => {
  const { id } = req.params;
  if (isNaN(id)) {
    res.status(400).send("Invalid ID");
    return;
  }
  let conn;
  try {
    conn = await pool.getConnection();
    const staffMember = await conn.query(staffQueries.getById, [+id]);
    if (staffMember.length === 0) {
      res.status(404).send("Staff member not found");
      return;
    }
    res.send(staffMember);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

//Crear un nuevo registro a staff
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
    res.status(400).send("All fields are required");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const staffMember = await conn.query(staffQueries.getByEmail, [email]);
    if (staffMember.length > 0) {
      res.status(400).send("Email already exists");
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
      res.status(500).send("Staff member could not be created");
      return;
    }
    res.status(201).send("Staff member created successfully");
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

// Actualizar   
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

  if (isNaN(id)) {
    res.status(400).send("Invalid ID");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const staffMember = await conn.query(staffQueries.getById, [+id]);
    if (staffMember.length === 0) {
      res.status(404).send("Staff member not found");
      return;
    }

    const updateStaffMember = await conn.query(staffQueries.update, [
      first_name,
      last_name,
      birth_date,
      gender,
      phone_number,
      email,
      address,
      user_id,
      id,
    ]);

    if (updateStaffMember.affectedRows === 0) {
      res.status(500).send("Staff member could not be updated");
      return;
    }

    res.status(200).send("Staff member updated successfully");
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

// Eliminar un registro de staff
const deleteStaff = async (req = request, res = response) => {
    const { id } = req.params;
    if (isNaN(id)) {
      res.status(400).send("Invalid ID");
      return;
    }

    let conn;
    try {
      conn = await pool.getConnection();
      const staffMember = await conn.query(staffQueries.getById, [+id]);
      if (staffMember.length === 0) {
        res.status(404).send("Staff member not found");
        return;
      }

      const deleteStaffMember = await conn.query(staffQueries.delete, [+id]);

      if (deleteStaffMember.affectedRows === 0) {
        res.status(500).send("Staff member could not be deleted");
        return;
      }

      res.send("Staff member deleted");
    } catch (error) {
      res.status(500).send(error);
    } finally {
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
