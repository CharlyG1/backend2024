const { request, response } = require("express");
const pool = require("../db/conection");
const { productsQueries } = require("../models/products");

//MOSTRAR TODOS Productos
const getAllProducts = async (req = request, res = response) => {
  console.log(getAllProducts);
  let conn;
  try {
    conn = await pool.getConnection();
    const products = await conn.query(productsQueries.getAll);
    res.send(products);
  } catch (error) {
    res.status(500).send(error); //'Interna server error'
    return;
  } finally {
    if (conn) conn.end();
  }
};

//Mostrar Usuario por ID
const getProductsById = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).send("ID invalido");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const products_one = await conn.query(productsQueries.getById, [+id]);

    if (products_one.length === 0) {
      res.status(404).send("user not found ");
      return;
    }
    res.send(products_one);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

//Agregar un Nuevo Producto
const createProducts = async (req = request, res = response) => {
  const { product, description, stock, measurement_unit, price, discount } =
    req.body;

  if (
    !product ||
    !description ||
    !stock ||
    !measurement_unit ||
    !price ||
    !discount
  ) {
    //verificar que esten los campos
    res.status(400).send("Bad request. Some fields are missing");
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const products_one1 = await conn.query(productsQueries.getByproduct, [
      product,
    ]);

    if (products_one1.length > 0) {
      res.status(409).send("El producto ya existe");
      return;
    }

    const newproducts_one = await conn.query(productsQueries.create, [
      product,
      description,
      stock,
      measurement_unit,
      price,
      discount,
      id,
    ]);

    if (newproducts_one.affectedRows === 0) {
      //verificar si hubo camnios en la base de Datos
      res.status(500).send("El producto no ha sido agregado");
      return;
    }
    res.status(201).send("Producto Agregado exitosamente"); //si no pues SI HUBO cambios
  } catch (error) {
    res.status(500).send(error);
    return;
  } finally {
    if (conn) conn.end(); //Termina la conexion al final de todo
  }
};

//ACtualizar producto
const updateProducts = async (req = request, res = response) => {
  const { id } = req.params;
  const { product, description, stock, measurement_unit, price, discount } =
    req.body;

  // Verificación de ID válido
  if (isNaN(id)) {
    res.status(400).send("Invalid ID");
    return;
  }

  let conn;
  try {
    // Conexión a la base de datos
    conn = await pool.getConnection();

    // Verificar si el usuario existe
    const products_one = await conn.query(productsQueries.getById, [+id]);
    if (products_one.length === 0) {
      res.status(404).send("Producto not found");
      return;
    }

    // Verificar si el nuevo nombre del producto ya está en uso por otro producto
    const product_existente = await conn.query(productsQueries.getByproduct, [
      product,
    ]);
    if (product_existente.length > 0 && product_existente[0].id !== +id) {
      res.status(409).send("Ese Producto ya existe");
      return;
    }

    // Actualizar el usuario //PASAR 8 CAMPOS
    const updateProducto = await conn.query(productsQueries.update, [
      product,
      description,
      stock,
      measurement_unit,
      price,
      discount,
      +id, // Asegúrate de convertir el id a número para evitar errores.
    ]);

    // Comprobar si la actualización fue exitosa
    if (updateProducto.affectedRows === 0) {
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

//Eliminar Producto
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
      res.status(500).send("eror no encontrado");
      return;
    }

    const deleteProduct_one = await conn.query(productsQueries.delete, [+id]);
    if (deleteProduct_one.affectedRows === 0) {
      res.status(500).send("Product could not be deleted");
      return;
    }
    res.send("Producto borrado exitosamente");
  } catch (error) {
    res.status(500).send(error);
    return;
  } finally {
    // Cerrar la conexión
    if (conn) conn.end();
  }
};

//Exportacion de Metodos
module.exports = {
  getAllProducts,
  getProductsById,
  createProducts,
  updateProducts,
  deleteProduct,
};
