const db = require('../db');

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await db.query('SELECT * FROM course');
    res.status(200).json(courses);
  } catch (err) {
    console.error('Error loading courses:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCourseById = async (req, res) => {
  const id = req.params.id;
  console.log('Received GET request for course ID:', id);

  try {
    const results = await db.query('SELECT * FROM course WHERE id = ?', [id]);

    if (results.length === 0) {
      console.warn('No course found for ID:', id);
      return res.status(404).json({ error: 'Course not found' });
    }

    console.log('Returning course:', results[0]);

    res.set({
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    res.json(results[0]);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.createCourse = async (req, res) => {
  const {
    course_code,
    name,
    department,
    description,
    semester,
    credit,
    ta_required
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO course (course_code, name, department, description, semester, credit, ta_required)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [course_code, name, department, description, semester, credit, ta_required]
    );
    
    console.log("INSERT RESULT:", result); 
    
    res.status(201).json({ message: "Course created", id: result.insertId });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  
};

exports.updateCourse = async (req, res) => {
  const id = req.params.id;
  const {
    course_code,
    name,
    department,
    description,
    semester,
    credit,
    ta_required
  } = req.body;

  // Optional: log inputs to check for undefined
  console.log('Update values:', { name, course_code, department, description, semester, credit, ta_required, id });

  try {
    await db.query(
      `UPDATE course
       SET name = ?, course_code = ?, department = ?, description = ?, semester = ?, credit = ?, ta_required = ?
       WHERE id = ?`,
      [name, course_code, department, description, semester, credit, ta_required, id]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({ error: "Database error" });
  }
};

exports.deleteCourse = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM course WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(204);
  });
};
