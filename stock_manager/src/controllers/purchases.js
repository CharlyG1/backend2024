const { request, response } = require("express");
const pool = require("../db/connection");
const { purchasesQueries } = require("../models/purchases");

// Obtener todas las compras
const getAllPurchases = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const purchases = await conn.query(purchasesQueries.getAll);
    res.send(purchases);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

// Obtener una compra por ID
const getPurchaseById = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).send("Invalid ID");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const purchase = await conn.query(purchasesQueries.getById, [+id]);

    if (purchase.length === 0) {
      res.status(404).send("Purchase not found");
      return;
    }

    res.send(purchase);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

// Crear una nueva compra
const createPurchase = async (req = request, res = response) => {
  const {
    quantity,
    purchase_date,
    payment_method,
    ticket,
    invoice,
    price,
  } = req.body;
  
  if (!quantity || !payment_method || !price) {
      res.status(400).send("Missing required fields");
      return;
    }

  let conn;
  try {
    conn = await pool.getConnection();

    const newPurchase = await conn.query(purchasesQueries.create, [
      quantity,
      purchase_date || null,
      payment_method,
      ticket || null,
      invoice || null,
      price,
    ]);

    if (newPurchase.affectedRows === 0) {
      res.status(500).send("Purchase could not be created");
      return;
    }

    res.status(201).send("Purchase created successfully");
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

// Actualizar una compra
const updatePurchase = async (req = request, res = response) => {
  const { id } = req.params;
  const {
    quantity,
    purchase_date,
    payment_method,
    ticket,
    invoice,
    price,
  } = req.body;

  if (
    isNaN(id) ||
    (
      !quantity &&
      !purchase_date &&
      !payment_method &&
      !ticket &&
      !invoice &&
      !price)
  ) {
    res.status(400).send("Invalid request. Provide valid fields to update.");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const purchase = await conn.query(purchasesQueries.getById, [+id]);

    if (purchase.length === 0) {
      res.status(404).send("Purchase not found");
      return;
    }

    const updatedFields = {
      quantity: quantity || purchase[0].quantity,
      purchase_date: purchase_date || purchase[0].purchase_date,
      payment_method: payment_method || purchase[0].payment_method,
      ticket: ticket || purchase[0].ticket,
      invoice: invoice || purchase[0].invoice,
      price: price || purchase[0].price,
    };

    const result = await conn.query(purchasesQueries.update, [
      updatedFields.quantity,
      updatedFields.purchase_date,
      updatedFields.payment_method,
      updatedFields.ticket,
      updatedFields.invoice,
      updatedFields.price,
      +id,
    ]);

    if (result.affectedRows === 0) {
      res.status(500).send("Purchase could not be updated");
      return;
    }

    res.send("Purchase updated successfully");
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

// Eliminar una compra
const deletePurchase = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).send("Invalid ID");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const purchase = await conn.query(purchasesQueries.getById, [+id]);

    if (purchase.length === 0) {
      res.status(404).send("Purchase not found");
      return;
    }

    const deleteResult = await conn.query(purchasesQueries.delete, [+id]);

    if (deleteResult.affectedRows === 0) {
      res.status(500).send("Purchase could not be deleted");
      return;
    }

    res.send("Purchase deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

module.exports = {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
};
