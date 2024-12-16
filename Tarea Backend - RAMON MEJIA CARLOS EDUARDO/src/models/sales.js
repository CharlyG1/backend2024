const salesQueries = {
  getAll: "SELECT * FROM sales",
  getById: "SELECT * FROM sales WHERE id = ?",
  create:
    "INSERT INTO sales (client_rfc, product_id, quantity, sale_date, payment_method, ticket, invoice) VALUES (?, ?, ?, ?, ?, ?, ?)",
  update:
    "UPDATE sales SET client_rfc = ?, product_id = ?, quantity = ?, sale_date = ?, payment_method = ?, ticket = ?, invoice = ? WHERE id = ?",
  delete: "DELETE FROM sales WHERE id = ?",
};

module.exports = { salesQueries };
