const suppliersQueries = {
  getAll: "SELECT * FROM suppliers",
  getByRFC: "SELECT * FROM suppliers WHERE rfc = ?",
  create: `
    INSERT INTO suppliers (rfc, name, description, phone_number, email, address, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  update: `
    UPDATE suppliers
    SET name = ?, description = ?, phone_number = ?, email = ?, address = ?, is_active = ?
    WHERE rfc = ?
  `,
  delete: "UPDATE suppliers SET is_active = 0 WHERE rfc = ?",
};

module.exports = { suppliersQueries };
