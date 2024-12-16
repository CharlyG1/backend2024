const { request, response } = require("express");
const pool = require("../db/connection");
const { productsQueries } = require("../models/products");

// Obtener todos los productos
const getAllProducts = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const products = await conn.query(productsQueries.getAll);
    res.json(products);
  } catch (error) {
    res.status(500).send("Internal server error");
  } finally {
    if (conn) conn.end();
  }
};

// Obtener producto por ID
const getProductById = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).send("Invalid ID");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const product = await conn.query(productsQueries.getById, [+id]);
    if (product.length === 0) {
      res.status(404).send("Product not found");
      return;
    }
    res.json(product[0]);
  } catch (error) {
    res.status(500).send("Internal server error");
  } finally {
    if (conn) conn.end();
  }
};

// Crear un nuevo producto
const createProduct = async (req = request, res = response) => {
  const { product, description, stock, measurement_unit, price, discount } =
    req.body;

  if (
    !product ||
    stock === undefined ||
    !measurement_unit ||
    price === undefined
  ) {
    res.status(400).send("Missing required fields");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(productsQueries.create, [
      product,
      description || null,
      stock,
      measurement_unit,
      price,
      discount || 0,
    ]);
    if (result.affectedRows === 0) {
      res.status(500).send("Product could not be created");
      return;
    }
    res.status(201).send("Product created successfully");
  } catch (error) {
    res.status(500).send("Internal server error");
  } finally {
    if (conn) conn.end();
  }
};

// Actualizar producto
const updateProduct = async (req = request, res = response) => {
  const { id } = req.params;
  const { product, description, stock, measurement_unit, price, discount } =
    req.body;

  if (isNaN(id)) {
    res.status(400).send("Invalid ID");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const existingProduct = await conn.query(productsQueries.getById, [+id]);
    if (existingProduct.length === 0) {
      res.status(404).send("Product not found");
      return;
    }

    const updatedFields = {
      product: product || existingProduct[0].product,
      description: description || existingProduct[0].description,
      stock: stock !== undefined ? stock : existingProduct[0].stock,
      measurement_unit: measurement_unit || existingProduct[0].measurement_unit,
      price: price !== undefined ? price : existingProduct[0].price,
      discount: discount !== undefined ? discount : existingProduct[0].discount,
    };

    const result = await conn.query(productsQueries.update, [
      updatedFields.product,
      updatedFields.description,
      updatedFields.stock,
      updatedFields.measurement_unit,
      updatedFields.price,
      updatedFields.discount,
      +id,
    ]);

    if (result.affectedRows === 0) {
      res.status(500).send("Product could not be updated");
      return;
    }

    res.send("Product updated successfully");
  } catch (error) {
    res.status(500).send("Internal server error");
  } finally {
    if (conn) conn.end();
  }
};

// Eliminar producto
const deleteProduct = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).send("Invalid ID");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const products_one = await conn.query(productsQueries.getById, [+id]);

    if (products_one.length === 0) {
      res.status(500).send("Not found");
      return;
    }

    const deleteProduct_one = await conn.query(productsQueries.delete, [+id]);
    if (deleteProduct_one.affectedRows === 0) {
      res.status(500).send("Product could not be deleted");
      return;
    }
    res.send("Deleted succesfully");
  } catch (error) {
    res.status(500).send(error);
    return;
  } finally {
    if (conn) conn.end();
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
