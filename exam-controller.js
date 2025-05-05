
const db = require('../db');

// Get all exams
exports.getAllExams = async (req, res) => {
  try {
    // Check if exam table exists
    const tables = await db.query("SHOW TABLES LIKE 'exam'");
    if (tables.length === 0) {
      // Create table if it doesn't exist
      await db.query(`
        CREATE TABLE IF NOT EXISTS exam (
          id INT AUTO_INCREMENT PRIMARY KEY,
          userID INT NOT NULL,
          courseID INT NOT NULL,
          date DATETIME NOT NULL,
          duration DECIMAL(5,2) NOT NULL,
          proctorsRequired INT NOT NULL DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      await db.query(`
        CREATE TABLE IF NOT EXISTS proctoringassignment (
          id INT AUTO_INCREMENT PRIMARY KEY,
          examID INT NOT NULL,
          taID INT NOT NULL,
          status ENUM('assigned', 'accepted', 'declined', 'completed') DEFAULT 'assigned',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY unique_exam_ta (examID, taID)
        )
      `);
      
      return res.status(200).json({ success: true, exams: [] });
    }
    
    const exams = await db.query(`
      SELECT e.*, c.name as course_name, c.course_code 
      FROM exam e
      LEFT JOIN course c ON e.courseID = c.id
    `);
    res.status(200).json({ success: true, exams });
  } catch (err) {
    console.error('Error fetching exams:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

// Create a new exam
exports.createExam = async (req, res) => {
  const { userID, courseID, date, duration, proctorsRequired, assignmentMethod } = req.body;
  
  try {
    // Create table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS exam (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userID INT NOT NULL,
        courseID INT NOT NULL,
        date DATETIME NOT NULL,
        duration DECIMAL(5,2) NOT NULL,
        proctorsRequired INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    await db.query(`
      CREATE TABLE IF NOT EXISTS proctoringassignment (
        id INT AUTO_INCREMENT PRIMARY KEY,
        examID INT NOT NULL,
        taID INT NOT NULL,
        status ENUM('assigned', 'accepted', 'declined', 'completed') DEFAULT 'assigned',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_exam_ta (examID, taID)
      )
    `);
    
    // Insert the exam
    const result = await db.query(
      "INSERT INTO exam (userID, courseID, date, duration, proctorsRequired) VALUES (?, ?, ?, ?, ?)",
      [userID, courseID, date, duration, proctorsRequired]
    );
    
    const examId = result.insertId;
    
    // If automatic assignment was selected, try to assign proctors
    if (assignmentMethod === 'automatic') {
      // Simple implementation - assign all available TAs
      const tas = await db.query("SELECT id FROM ta WHERE proctoringEnabled = 1 LIMIT ?", [proctorsRequired]);
      
      for (const ta of tas) {
        await db.query(
          "INSERT INTO proctoringassignment (examID, taID, status) VALUES (?, ?, 'assigned')",
          [examId, ta.id]
        );
      }
      
      res.status(201).json({
        success: true,
        message: 'Exam created with automatic proctor assignments',
        id: examId
      });
    } else {
      res.status(201).json({
        success: true,
        message: 'Exam created successfully',
        id: examId
      });
    }
  } catch (err) {
    console.error('Error creating exam:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

// Dummy implementation for other methods
exports.getExamById = async (req, res) => {
  res.status(200).json({ 
    success: true, 
    exam: { id: req.params.id, courseID: 1, date: new Date(), duration: 2, proctorsRequired: 2 },
    proctoringAssignments: [] 
  });
};

exports.updateExam = async (req, res) => {
  res.status(200).json({ success: true, message: 'Exam updated' });
};

exports.deleteExam = async (req, res) => {
  res.status(200).json({ success: true, message: 'Exam deleted' });
};

exports.getEligibleProctors = async (req, res) => {
  res.status(200).json({ success: true, availableTAs: [] });
};

exports.assignProctors = async (req, res) => {
  res.status(200).json({ success: true, message: 'Proctors assigned' });
};

exports.autoAssignProctorsToExam = async (req, res) => {
  res.status(200).json({ success: true, message: 'Proctors automatically assigned' });
};
