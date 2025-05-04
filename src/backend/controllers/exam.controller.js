const db = require('../db');

// Get all exams
exports.getAllExams = async (req, res) => {

  console.log('GET /api/exams triggered'); // <-- ADD THIS

  try {
    const exams = await db.query('SELECT * FROM exam');
    res.status(200).json(exams);
  } catch (err) {
    console.error('Error fetching exams:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single exam by ID
exports.getExamById = async (req, res) => {
  const { id } = req.params;
  try {
    const exam = await db.query('SELECT * FROM exam WHERE id = ?', [id]);
    if (exam.length === 0) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam[0]);
  } catch (err) {
    console.error('Error fetching exam:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new exam and assign classrooms
exports.createExam = async (req, res) => {
  const { courseId, userId, date, duration, proctorsRequired, classrooms } = req.body;

  if (!courseId || !userId || !date || !duration || !proctorsRequired || !Array.isArray(classrooms)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    // Insert exam
    const result = await conn.query(
      `INSERT INTO exam (courseID, userID, date, duration, proctorsRequired)
       VALUES (?, ?, ?, ?, ?)`,
      [courseId, userId, date, duration, proctorsRequired]
    );
    const examId = result.insertId;

    // Insert into exam_classroom junction table
    for (const classroomId of classrooms) {
      await conn.query(
        'INSERT INTO exam_classroom (examID, classroomID) VALUES (?, ?)',
        [examId, classroomId]
      );
    }

    await conn.commit();
    conn.release();
    res.status(201).json({ message: 'Exam created successfully', id: examId });
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error('Error creating exam:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an exam
exports.updateExam = async (req, res) => {
  const { id } = req.params;
  const { courseId, userId, date, duration, proctorsRequired } = req.body;

  try {
    await db.query(
      `UPDATE exam
       SET courseID = ?, userID = ?, date = ?, duration = ?, proctorsRequired = ?
       WHERE id = ?`,
      [courseId, userId, date, duration, proctorsRequired, id]
    );
    res.status(200).json({ message: 'Exam updated successfully' });
  } catch (err) {
    console.error('Error updating exam:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete an exam
exports.deleteExam = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM exam WHERE id = ?', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting exam:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getClassroomsForExam = async (req, res) => {
  const { examId } = req.params;

  try {
    const classrooms = await db.query(
      `SELECT c.id, c.name 
       FROM classroom c
       JOIN exam_classroom ec ON ec.classroomID = c.id
       WHERE ec.examID = ?`,
      [examId]
    );
    res.json(classrooms);
  } catch (err) {
    console.error('Error fetching classrooms:', err);
    res.status(500).json({ error: 'Failed to fetch classrooms' });
  }
};