const db = require('../db');

// Get all instructors
exports.getAllInstructors = async (req, res) => {
  try {
    const instructors = await db.query('SELECT * FROM instructor');
    res.json(instructors);
  } catch (err) {
    console.error('Error fetching instructors:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get instructor by ID
exports.getInstructorById = async (req, res) => {
  const { id } = req.params;
  try {
    const instructor = await db.query('SELECT * FROM instructor WHERE id = ?', [id]);
    if (instructor.length === 0) {
      return res.status(404).json({ error: 'Instructor not found' });
    }
    res.json(instructor[0]);
  } catch (err) {
    console.error('Error fetching instructor:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Create new instructor
exports.createInstructor = async (req, res) => {
  const { name, surname, department, email, password } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO instructor (name, surname, department, email, password) VALUES (?, ?, ?, ?, ?)',
      [name, surname, department, email, password]
    );
    res.status(201).json({ id: result.insertId, message: 'Instructor created successfully' });
  } catch (err) {
    console.error('Error creating instructor:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Update instructor
exports.updateInstructor = async (req, res) => {
  const { id } = req.params;
  const { name, surname, department, email, password } = req.body;
  try {
    await db.query(
      'UPDATE instructor SET name = ?, surname = ?, department = ?, email = ?, password = ? WHERE id = ?',
      [name, surname, department, email, password, id]
    );
    res.json({ message: 'Instructor updated successfully' });
  } catch (err) {
    console.error('Error updating instructor:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Delete instructor
exports.deleteInstructor = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM instructor WHERE id = ?', [id]);
    res.json({ message: 'Instructor deleted successfully' });
  } catch (err) {
    console.error('Error deleting instructor:', err);
    res.status(500).json({ error: 'Database error' });
  }
}; 