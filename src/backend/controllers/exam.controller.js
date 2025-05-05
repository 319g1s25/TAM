const db = require('../db');

// Get all exams
exports.getAllExams = async (req, res) => {
  try {
    const [exams] = await db.query(`
      SELECT e.*, c.name as course_name, c.course_code 
      FROM exam e
      JOIN course c ON e.courseID = c.id
    `);
    res.status(200).json({ success: true, exams });
  } catch (err) {
    console.error('Error fetching exams:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

// Get exam by ID
exports.getExamById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const [exam] = await db.query(`
      SELECT e.*, c.name as course_name, c.course_code 
      FROM exam e
      JOIN course c ON e.courseID = c.id
      WHERE e.id = ?
    `, [id]);
    
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    
    // Get proctoring assignments for this exam
    const proctoringAssignments = await db.query(`
      SELECT pa.*, ta.name as ta_name, ta.email as ta_email
      FROM proctoringassignment pa
      JOIN ta ON pa.taID = ta.id
      WHERE pa.examID = ?
    `, [id]);
    
    res.status(200).json({ 
      success: true, 
      exam,
      proctoringAssignments
    });
  } catch (err) {
    console.error('Error fetching exam:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

// Create a new exam
exports.createExam = async (req, res) => {
  const { 
    userID, 
    courseID, 
    date, 
    duration, 
    proctorsRequired, 
    assignmentMethod 
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO exam (userID, courseID, date, duration, proctorsRequired)
       VALUES (?, ?, ?, ?, ?)`,
      [userID, courseID, date, duration, proctorsRequired]
    );
    
    const examId = result.insertId;
    
    // If automatic assignment was selected, assign proctors automatically
    if (assignmentMethod === 'automatic') {
      await autoAssignProctors(examId, proctorsRequired);
      res.status(201).json({ 
        success: true, 
        message: 'Exam created with automatic proctor assignments',
        id: examId 
      });
    } else {
      res.status(201).json({ 
        success: true, 
        message: 'Exam created for manual proctor assignment',
        id: examId 
      });
    }
  } catch (err) {
    console.error('Error creating exam:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

// Automatic proctor assignment function
async function autoAssignProctors(examId, proctorsRequired) {
  try {
    // First, get the exam details to know the date
    const [exam] = await db.query('SELECT * FROM exam WHERE id = ?', [examId]);
    
    if (!exam) {
      throw new Error('Exam not found');
    }
    
    // Get the course details
    const [course] = await db.query('SELECT * FROM course WHERE id = ?', [exam.courseID]);
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    // Get all TAs eligible for proctoring (proctoringEnabled = true and not on leave)
    const eligibleTAs = await db.query(`
      SELECT t.*
      FROM ta t
      WHERE t.proctoringEnabled = 1 
      AND t.isOnLeave = 0
      ORDER BY t.totalWorkload ASC
    `);
    
    if (eligibleTAs.length < proctorsRequired) {
      throw new Error('Not enough eligible TAs available for proctoring');
    }
    
    // Check if TAs are already assigned to other exams at the same time
    const examDate = new Date(exam.date);
    
    // Get TAs not available due to other exams at the same time
    const busyTAs = await db.query(`
      SELECT DISTINCT pa.taID
      FROM proctoringassignment pa
      JOIN exam e ON pa.examID = e.id
      WHERE DATE(e.date) = DATE(?)
      AND HOUR(e.date) = HOUR(?)
    `, [examDate, examDate]);
    
    const busyTaIds = busyTAs.map(ta => ta.taID);
    
    // Filter out busy TAs
    const availableTAs = eligibleTAs.filter(ta => !busyTaIds.includes(ta.id));
    
    if (availableTAs.length < proctorsRequired) {
      throw new Error('Not enough available TAs for the requested time');
    }
    
    // Prioritize TAs with lower workload
    const selectedTAs = availableTAs.slice(0, proctorsRequired);
    
    // Assign the selected TAs to the exam
    for (const ta of selectedTAs) {
      await db.query(`
        INSERT INTO proctoringassignment (taID, examID, status)
        VALUES (?, ?, 'assigned')
      `, [ta.id, examId]);
      
      // Update TA's total workload to reflect this assignment
      const newWorkload = (ta.totalWorkload || 0) + 3; // Assume 3 hours for proctoring
      await db.query(`
        UPDATE ta
        SET totalWorkload = ?
        WHERE id = ?
      `, [newWorkload, ta.id]);
    }
    
    return { success: true, assignedTAs: selectedTAs.length };
  } catch (error) {
    console.error('Error in automatic proctor assignment:', error);
    throw error;
  }
}

// Manually assign proctors to an exam
exports.assignProctors = async (req, res) => {
  const { examId } = req.params;
  const { taIds } = req.body;
  
  if (!Array.isArray(taIds) || taIds.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'No TAs selected for assignment' 
    });
  }
  
  try {
    // Get the exam to check if enough proctors are being assigned
    const [exam] = await db.query('SELECT * FROM exam WHERE id = ?', [examId]);
    
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    
    if (taIds.length < exam.proctorsRequired) {
      return res.status(400).json({ 
        success: false, 
        message: `This exam requires at least ${exam.proctorsRequired} proctors` 
      });
    }
    
    // Clear any existing assignments for this exam
    await db.query('DELETE FROM proctoringassignment WHERE examID = ?', [examId]);
    
    // Assign the selected TAs to the exam
    for (const taId of taIds) {
      await db.query(`
        INSERT INTO proctoringassignment (taID, examID, status)
        VALUES (?, ?, 'assigned')
      `, [taId, examId]);
      
      // Update TA's total workload
      const [ta] = await db.query('SELECT totalWorkload FROM ta WHERE id = ?', [taId]);
      const newWorkload = (ta.totalWorkload || 0) + 3; // Assume 3 hours for proctoring
      await db.query('UPDATE ta SET totalWorkload = ? WHERE id = ?', [newWorkload, taId]);
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Proctors assigned successfully' 
    });
  } catch (err) {
    console.error('Error assigning proctors:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

// Trigger automatic assignment for an existing exam
exports.autoAssignProctorsToExam = async (req, res) => {
  const { examId } = req.params;
  
  try {
    // Get the exam
    const [exam] = await db.query('SELECT * FROM exam WHERE id = ?', [examId]);
    
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    
    // Clear any existing assignments for this exam
    await db.query('DELETE FROM proctoringassignment WHERE examID = ?', [examId]);
    
    // Run the automatic assignment
    const result = await autoAssignProctors(exam.id, exam.proctorsRequired);
    
    res.status(200).json({ 
      success: true, 
      message: `Successfully assigned ${result.assignedTAs} proctors to the exam` 
    });
  } catch (err) {
    console.error('Error automatically assigning proctors:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Database error' 
    });
  }
};

// Get eligible TAs for proctoring
exports.getEligibleProctors = async (req, res) => {
  const { examId } = req.params;
  
  try {
    // Get the exam date and time
    const [exam] = await db.query('SELECT * FROM exam WHERE id = ?', [examId]);
    
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    
    const examDate = new Date(exam.date);
    
    // Get all eligible TAs (proctoringEnabled = true and not on leave)
    const eligibleTAs = await db.query(`
      SELECT * FROM ta
      WHERE proctoringEnabled = 1 
      AND isOnLeave = 0
    `);
    
    // Get TAs already assigned to other exams at the same time
    const busyTAs = await db.query(`
      SELECT DISTINCT pa.taID
      FROM proctoringassignment pa
      JOIN exam e ON pa.examID = e.id
      WHERE DATE(e.date) = DATE(?)
      AND HOUR(e.date) = HOUR(?)
      AND e.id != ?
    `, [examDate, examDate, examId]);
    
    const busyTaIds = busyTAs.map(ta => ta.taID);
    
    // Filter out busy TAs
    const availableTAs = eligibleTAs.filter(ta => !busyTaIds.includes(ta.id));
    
    res.status(200).json({ 
      success: true, 
      availableTAs: availableTAs 
    });
  } catch (err) {
    console.error('Error fetching eligible proctors:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

// Update an exam
exports.updateExam = async (req, res) => {
  const { id } = req.params;
  const { userID, courseID, date, duration, proctorsRequired } = req.body;
  
  try {
    await db.query(
      `UPDATE exam 
       SET userID = ?, courseID = ?, date = ?, duration = ?, proctorsRequired = ?
       WHERE id = ?`,
      [userID, courseID, date, duration, proctorsRequired, id]
    );
    
    res.status(200).json({ success: true, message: 'Exam updated successfully' });
  } catch (err) {
    console.error('Error updating exam:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

// Delete an exam
exports.deleteExam = async (req, res) => {
  const { id } = req.params;
  
  try {
    // First, get all TAs assigned to this exam to update their workload
    const assignments = await db.query(`
      SELECT pa.*, ta.totalWorkload
      FROM proctoringassignment pa
      JOIN ta ON pa.taID = ta.id
      WHERE pa.examID = ?
    `, [id]);
    
    // Delete the exam (this will cascade delete proctoringassignments)
    await db.query('DELETE FROM exam WHERE id = ?', [id]);
    
    // Update each TA's workload to reflect the removed assignment
    for (const assignment of assignments) {
      const newWorkload = Math.max(0, (assignment.totalWorkload || 0) - 3); // Subtract 3 hours
      await db.query('UPDATE ta SET totalWorkload = ? WHERE id = ?', [newWorkload, assignment.taID]);
    }
    
    res.status(200).json({ success: true, message: 'Exam deleted successfully' });
  } catch (err) {
    console.error('Error deleting exam:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};
