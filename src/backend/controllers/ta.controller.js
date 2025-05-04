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

exports.getTAById = async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await db.query('SELECT * FROM ta WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'TA not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching TA:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
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

exports.updateTA = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: 'Missing TA ID in request URL' });
  }

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

  console.log("Received body for update:", req.body);
console.log("TA ID from URL param:", id);

  // Only include fields that are not undefined
  const updates = {
    name,
    surname,
    email,
    password,
    isOnLeave,
    totalWorkload,
    msOrPhdStatus,
    proctoringEnabled,
    department
  };

  const validUpdates = Object.entries(updates).filter(([_, v]) => v !== undefined);

  if (validUpdates.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  const setClause = validUpdates.map(([key]) => `${key} = ?`).join(', ');
  const values = validUpdates.map(([_, value]) => value);

  try {
    await db.query(`UPDATE ta SET ${setClause} WHERE id = ?`, [...values, id]);
    res.sendStatus(204); // No Content
  } catch (err) {
    console.error("Error updating TA:", err);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.deleteTA = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM ta WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(204);
  });
};
