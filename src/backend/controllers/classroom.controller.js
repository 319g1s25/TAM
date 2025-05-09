const db = require('../db');

// Get all classrooms
exports.getAllClassrooms = async (req, res) => {
  console.log('getAllClassrooms called');
  try {
    const classrooms = await db.query('SELECT * FROM classroom');
    console.log('Classrooms fetched from DB:', classrooms);
    
    if (!classrooms || classrooms.length === 0) {
      console.log('No classrooms found in the database');
    }
    
    res.status(200).json(classrooms);
  } catch (err) {
    console.error('Error fetching classrooms:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get one classroom
exports.getClassroomById = async (req, res) => {
  try {
    const classroom = await db.query('SELECT * FROM classroom WHERE id = ?', [req.params.id]);
    if (!classroom) return res.status(404).json({ message: 'Classroom not found' });
    res.json(classroom[0]);
  } catch (err) {
    console.error('Error fetching classroom:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create new classroom
exports.createClassroom = async (req, res) => {
  const { name, capacity, examCapacity } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const result = await db.query(
      'INSERT INTO classroom (room, capacity, examCapacity) VALUES (?, ?, ?)',
      [name, capacity || null, examCapacity || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Classroom created' });
  } catch (err) {
    console.error('Error creating classroom:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update classroom
exports.updateClassroom = async (req, res) => {
  const { name, capacity, examCapacity } = req.body;
  try {
    await db.query(
      'UPDATE classroom SET room = ?, capacity = ?, examCapacity = ? WHERE id = ?',
      [name, capacity, examCapacity, req.params.id]
    );
    res.status(200).json({ message: 'Classroom updated' });
  } catch (err) {
    console.error('Error updating classroom:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete classroom
exports.deleteClassroom = async (req, res) => {
  try {
    await db.query('DELETE FROM classroom WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting classroom:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
