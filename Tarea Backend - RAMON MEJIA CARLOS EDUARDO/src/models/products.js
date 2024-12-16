const productsQueries = {
  getAll: "SELECT * FROM products",
  getById: "SELECT * FROM products WHERE id = ?",
  getByproduct: "SELECT *FROM  products WHERE product =?",

  create:
    "INSERT INTO products (product,description,stock,measurement_unit,price,discount) VALUES (?, ?, ?, ?, ?, ?)",

  update:
    "UPDATE products SET product= ?, description= ?, stock=?,measurement_unit= ?, price=?,discount= ? WHERE id = ?",

  delete: " DELETE FROM products WHERE id = ?",
};

module.exports = { productsQueries };
