const { request, response } = require("express");
const pool = require("../db/connection");
const { suppliersQueries } = require("../models/suppliers");

// Obtener todos los proveedores
const getAllSuppliers = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const suppliers = await conn.query(suppliersQueries.getAll);
    res.send(suppliers);
  } catch (error) {
    res.status(500).send(error); // Internal server error
  } finally {
    if (conn) conn.end();
  }
};

// Obtener proveedor por RFC
const getSupplierByRFC = async (req = request, res = response) => {
  const { rfc } = req.params;

  if (!rfc) {
    res.status(400).send("RFC is required");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const supplier = await conn.query(suppliersQueries.getByRFC, [rfc]);

    if (supplier.length === 0) {
      res.status(404).send("Supplier not found");
      return;
    }

    res.send(supplier);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

// Crear un nuevo proveedor
const createSupplier = async (req = request, res = response) => {
  const { rfc, name, description, phone_number, email, address, is_active } =
    req.body;

  if (!rfc || !name || !address) {
    res.status(400).send("RFC, name, and address are required");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const supplierExists = await conn.query(suppliersQueries.getByRFC, [rfc]);

    if (supplierExists.length > 0) {
      res.status(409).send("Supplier already exists");
      return;
    }

    const result = await conn.query(suppliersQueries.create, [
      rfc,
      name,
      description,
      phone_number,
      email,
      address,
      is_active,
    ]);

    if (result.affectedRows === 0) {
      res.status(500).send("Supplier could not be created");
      return;
    }

    res.status(201).send("Supplier created successfully");
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

// Actualizar proveedor
const updateSupplier = async (req = request, res = response) => {
  const { rfc } = req.params;
  const { name, description, phone_number, email, address, is_active } =
    req.body;

  if (!rfc) {
    res.status(400).send("RFC is required");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const supplier = await conn.query(suppliersQueries.getByRFC, [rfc]);

    if (supplier.length === 0) {
      res.status(404).send("Supplier not found");
      return;
    }

    const updatedFields = {
      name: name || supplier[0].name,
      description: description || supplier[0].description,
      phone_number: phone_number || supplier[0].phone_number,
      email: email || supplier[0].email,
      address: address || supplier[0].address,
      is_active: is_active !== undefined ? is_active : supplier[0].is_active,
    };

    const result = await conn.query(suppliersQueries.update, [
      updatedFields.name,
      updatedFields.description,
      updatedFields.phone_number,
      updatedFields.email,
      updatedFields.address,
      updatedFields.is_active,
      rfc,
    ]);

    if (result.affectedRows === 0) {
      res.status(500).send("Supplier could not be updated");
      return;
    }

    res.send("Supplier updated successfully");
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

// Eliminar proveedor
const deleteSupplier = async (req = request, res = response) => {
  const { rfc } = req.params;

  if (!rfc) {
    res.status(400).send("RFC is required");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const supplier = await conn.query(suppliersQueries.getByRFC, [rfc]);

    if (supplier.length === 0) {
      res.status(404).send("Supplier not found");
      return;
    }

    const result = await conn.query(suppliersQueries.delete, [rfc]);

    if (result.affectedRows === 0) {
      res.status(500).send("Supplier could not be deleted");
      return;
    }

    res.send("Supplier deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

module.exports = {
  getAllSuppliers,
  getSupplierByRFC,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
