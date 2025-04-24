const db = require('../db');

exports.getAllTAs = async (req, res) => {
  try {
    const tas = await db.query('SELECT * FROM ta');
    res.status(200).json(tas);
  } catch (err) {
    console.error('Error loading TAs:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getTAById = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM ta WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'TA not found' });
    res.json(results[0]);
  });
};

exports.createTA = async (req, res) => {
  const {
    name,
    surname,
    email,
    password,
    isOnLeave,
    totalWorkload,
    msOrPhdStatus,
    proctoringEnabled,
    department
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO ta (name, surname, email, password, isOnLeave, totalWorkload, msOrPhdStatus, proctoringEnabled, department)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, surname, email, password, isOnLeave, totalWorkload, msOrPhdStatus, proctoringEnabled, department]
    );
    res.status(201).json({ message: "TA created", id: result.insertId });
  } catch (error) {
    console.error("Error adding TA:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateTA = (req, res) => {
  const id = req.params.id;
  const updatedTA = req.body;
  db.query('UPDATE ta SET ? WHERE id = ?', [updatedTA, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(204); // No content
  });
};

exports.deleteTA = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM ta WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(204);
  });
};
