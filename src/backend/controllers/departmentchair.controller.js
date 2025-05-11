const db = require('../db');

// Get all department chairs
exports.getAllDepartmentChairs = async (req, res) => {
  try {
    const chairs = await db.query('SELECT * FROM departmentchair');
    res.json(chairs);
  } catch (err) {
    console.error('Error fetching department chairs:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get department chair by ID
exports.getDepartmentChairById = async (req, res) => {
  const { id } = req.params;
  try {
    const chair = await db.query('SELECT * FROM departmentchair WHERE id = ?', [id]);
    if (chair.length === 0) {
      return res.status(404).json({ error: 'Department chair not found' });
    }
    res.json(chair[0]);
  } catch (err) {
    console.error('Error fetching department chair:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Create new department chair
exports.createDepartmentChair = async (req, res) => {
  const { name, surname, email, password, department } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO departmentchair (name, surname, email, password, department) VALUES (?, ?, ?, ?, ?)',
      [name, surname, email, password, department]
    );
    res.status(201).json({ id: result.insertId, message: 'Department chair created successfully' });
  } catch (err) {
    console.error('Error creating department chair:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Update department chair
exports.updateDepartmentChair = async (req, res) => {
  const { id } = req.params;
  const { name, surname, email, password, department } = req.body;
  try {
    await db.query(
      'UPDATE departmentchair SET name = ?, surname = ?, email = ?, password = ?, department = ? WHERE id = ?',
      [name, surname, email, password, department, id]
    );
    res.json({ message: 'Department chair updated successfully' });
  } catch (err) {
    console.error('Error updating department chair:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Delete department chair
exports.deleteDepartmentChair = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM departmentchair WHERE id = ?', [id]);
    res.json({ message: 'Department chair deleted successfully' });
  } catch (err) {
    console.error('Error deleting department chair:', err);
    res.status(500).json({ error: 'Database error' });
  }
}; 