const clientsQueries = {
  getAll: "SELECT * FROM clients WHERE is_active=1",
  getByRfc: "SELECT * FROM clients WHERE rfc = ? AND is_active=1",
  getByEmail: "SELECT *FROM clients  WHERE email =?",
  create:
    "INSERT INTO clients (rfc,first_name,last_name,birth_date, gender, phone_number, email, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  update:
    "UPDATE clients SET first_name= ?, last_name= ?, birth_date=?, gender= ?, phone_number=?, email= ? ,address=? WHERE rfc = ?",
  delete: "UPDATE clients SET is_active=0 WHERE rfc=?",
};

module.exports = { clientsQueries };
