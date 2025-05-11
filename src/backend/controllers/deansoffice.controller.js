const db = require('../db');

// Get all deans office staff
exports.getAllDeansOffice = async (req, res) => {
  try {
    const staff = await db.query('SELECT * FROM deansoffice');
    res.json(staff);
  } catch (err) {
    console.error('Error fetching deans office staff:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get deans office staff by ID
exports.getDeansOfficeById = async (req, res) => {
  const { id } = req.params;
  try {
    const staff = await db.query('SELECT * FROM deansoffice WHERE id = ?', [id]);
    if (staff.length === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    res.json(staff[0]);
  } catch (err) {
    console.error('Error fetching staff member:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Create new deans office staff
exports.createDeansOffice = async (req, res) => {
  const { name, surname, email, password } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO deansoffice (name, surname, email, password) VALUES (?, ?, ?, ?)',
      [name, surname, email, password]
    );
    res.status(201).json({ id: result.insertId, message: 'Staff member created successfully' });
  } catch (err) {
    console.error('Error creating staff member:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Update deans office staff
exports.updateDeansOffice = async (req, res) => {
  const { id } = req.params;
  const { name, surname, email, password } = req.body;
  try {
    await db.query(
      'UPDATE deansoffice SET name = ?, surname = ?, email = ?, password = ? WHERE id = ?',
      [name, surname, email, password, id]
    );
    res.json({ message: 'Staff member updated successfully' });
  } catch (err) {
    console.error('Error updating staff member:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Delete deans office staff
exports.deleteDeansOffice = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM deansoffice WHERE id = ?', [id]);
    res.json({ message: 'Staff member deleted successfully' });
  } catch (err) {
    console.error('Error deleting staff member:', err);
    res.status(500).json({ error: 'Database error' });
  }
}; 