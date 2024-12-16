const staffQueries = {
  getAll: "SELECT * FROM staff",
  getById: "SELECT * FROM staff WHERE id = ?",
  getByEmail: "SELECT * FROM staff WHERE email=?",
  create:
    "INSERT INTO staff (first_name, last_name, birth_date, gender, phone_number, email, address, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  update:
    "UPDATE staff SET first_name = ?, last_name = ?, birth_date = ?, gender = ?, phone_number = ?, email = ?, address = ?, user_id = ? WHERE id = ?",
  delete: "UPDATE staff SET is_active = 0 WHERE id = ?",
};

module.exports = { staffQueries };
