const { request, response } = require("express");
const pool = require("../db/conection");
const { salesQueries } = require("../models/sales");

// Mostrar todas las ventas
const getAllSales = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const sales = await conn.query(salesQueries.getAll);
    res.send(sales);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

// Mostrar venta por ID
const getSalesById = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).send("Invalid ID");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const sale = await conn.query(salesQueries.getById, [+id]);

    if (sale.length === 0) {
      res.status(404).send("Sale not found");
      return;
    }
    res.send(sale);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

// Crear una nueva venta
const createSales = async (req = request, res = response) => {
  const {
    client_rfc,
    product_id,
    quantity,
    sale_date,
    payment_method,
    ticket,
    invoice,
  } = req.body;

  if (!client_rfc || !product_id || !quantity || !payment_method) {
    res.status(400).send("Missing required fields");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const newSale = await conn.query(salesQueries.create, [
      client_rfc,
      product_id,
      quantity,
      sale_date || null,
      payment_method,
      ticket || null,
      invoice || null,
    ]);

    if (newSale.affectedRows === 0) {
      res.status(500).send("Sale could not be created");
      return;
    }
    res.status(201).send("Sale created successfully");
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

// Actualizar una venta
const updateSales = async (req = request, res = response) => {
  const { id } = req.params;
  const {
    client_rfc,
    product_id,
    quantity,
    sale_date,
    payment_method,
    ticket,
    invoice,
  } = req.body;

  if (isNaN(id)) {
    res.status(400).send("Invalid ID");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const existingSale = await conn.query(salesQueries.getById, [+id]);

    if (existingSale.length === 0) {
      res.status(404).send("Sale not found");
      return;
    }

    const updatedSale = await conn.query(salesQueries.update, [
      client_rfc,
      product_id,
      quantity,
      sale_date || null,
      payment_method,
      ticket || null,
      invoice || null,
      +id,
    ]);

    if (updatedSale.affectedRows === 0) {
      res.status(500).send("Sale could not be updated");
      return;
    }
    res.send("Sale updated successfully");
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

// Eliminar una venta
const deleteSales = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).send("Invalid ID");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const existingSale = await conn.query(salesQueries.getById, [+id]);

    if (existingSale.length === 0) {
      res.status(404).send("Sale not found");
      return;
    }

    const deletedSale = await conn.query(salesQueries.delete, [+id]);

    if (deletedSale.affectedRows === 0) {
      res.status(500).send("Sale could not be deleted");
      return;
    }
    res.send("Sale deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

module.exports = {
  getAllSales,
  getSalesById,
  createSales,
  updateSales,
  deleteSales,
};
