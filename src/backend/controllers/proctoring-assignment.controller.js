const db = require('../db');

// GET: Get assigned TAs for an exam
exports.getAssignedTAs = async (req, res) => {
  const { examId } = req.params;
  try {
    const tas = await db.query(
      `SELECT ta.* FROM proctoringassignment pa
       JOIN ta ON pa.taID = ta.id
       WHERE pa.examID = ?`,
      [examId]
    );
    res.json(tas);
  } catch (err) {
    console.error('Error fetching assigned TAs:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST: Assign TAs to an exam 
exports.assignProctors = async (req, res) => {
  const { examId } = req.params;
  const { taIds } = req.body;

  if (!Array.isArray(taIds) || !examId) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    // Optional: clear previous assignments
    await db.query('DELETE FROM proctoringassignment WHERE examID = ?', [examId]);

    // Bulk insert
    for (const taId of taIds) {
      await db.query(
        'INSERT INTO proctoringassignment (examID, taID) VALUES (?, ?)',
        [examId, taId]
      );
    }

    res.status(200).json({ message: 'Proctors assigned successfully' });
  } catch (err) {
    console.error('Error assigning proctors:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.autoAssignProctors = async (req, res) => {
    const { examId } = req.params;
    if (!examId) return res.status(400).json({ error: 'Missing examId' });
  
    try {
      // 1. Get the exam
      const [exam] = await db.query('SELECT * FROM exam WHERE id = ?', [examId]);
      if (!exam) return res.status(404).json({ error: 'Exam not found' });
  
      // 2. Get course info for department
      const [course] = await db.query('SELECT * FROM course WHERE id = ?', [exam.courseID]);
  
      // 3. Get all eligible TAs
      const tas = await db.query(
        `SELECT * FROM ta 
         WHERE proctoringEnabled = 1 AND isOnLeave = 0 AND totalWorkload < 40`
      );
  
      const required = exam.proctorsRequired;
  
      // 4. Auto-assignment logic
      const assigned = [];
      const now = new Date(exam.date);
      const end = new Date(now.getTime() + exam.duration * 60 * 60 * 1000);
  
      for (const ta of tas.sort((a, b) => a.totalWorkload - b.totalWorkload)) {
        if (assigned.length >= required) break;
        // TODO: optionally check time conflicts using another table if needed
        assigned.push(ta.id);
      }
  
      // 5. Insert assignments
      await db.query('DELETE FROM proctoringassignment WHERE examID = ?', [examId]);
      for (const taId of assigned) {
        await db.query('INSERT INTO proctoringassignment (examID, taID) VALUES (?, ?)', [examId, taId]);
      }
  
      res.status(200).json({ assignedTAIds: assigned });
    } catch (err) {
      console.error('Auto assignment failed:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.getAssignedProctorCount = async (req, res) => {
    const { examId } = req.params;
  
    try {
      const rows = await db.query(
        'SELECT COUNT(*) as count FROM proctoringassignment WHERE examID = ?',
        [examId]
      );
      res.status(200).json({ assignedCount: rows[0].count });
    } catch (err) {
      console.error('Error getting proctor count:', err);
      res.status(500).json({ error: 'Database error' });
    }
  };

// GET: Get upcoming proctoring assignments for a specific TA
exports.getTAProctorings = async (req, res) => {
  const { taId } = req.params;
  const { period } = req.query; // 'week' or 'month'
  
  console.log(`Fetching proctorings for TA ${taId}, period: ${period || 'all'}`);
  
  if (!taId) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required taId parameter' 
    });
  }
  
  try {
    let dateFilter = '';
    const now = new Date();
    
    if (period === 'week') {
      // Filter for the next 7 days
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      dateFilter = `AND e.date BETWEEN NOW() AND '${nextWeek.toISOString().split('T')[0]}'`;
    } else if (period === 'month') {
      // Filter for the next 30 days
      const nextMonth = new Date(now);
      nextMonth.setDate(nextMonth.getDate() + 30);
      dateFilter = `AND e.date BETWEEN NOW() AND '${nextMonth.toISOString().split('T')[0]}'`;
    } else {
      // Default: all upcoming
      dateFilter = 'AND e.date >= NOW()';
    }

    // Check if TA exists first
    console.log(`Checking if TA ${taId} exists`);
    const taExists = await db.query('SELECT id FROM ta WHERE id = ?', [taId]);
    console.log('TA query result:', taExists);
    
    if (!taExists || taExists.length === 0) {
      console.log(`TA with ID ${taId} does not exist`);
      return res.status(404).json({
        success: false, 
        error: 'TA not found'
      });
    }

    console.log(`Executing query with filter: ${dateFilter}`);
    const query = `SELECT pa.id, pa.taID, pa.examID, pa.status,
              e.date, e.duration, e.proctorsRequired,
              c.id as courseId, c.course_code, c.name as courseName
       FROM proctoringassignment pa
       JOIN exam e ON pa.examID = e.id
       JOIN course c ON e.courseID = c.id
       WHERE pa.taID = ? ${dateFilter}
       ORDER BY e.date ASC`;
       
    console.log('SQL Query:', query);
    console.log('Query parameters:', [taId]);
    
    const assignments = await db.query(query, [taId]);
    
    console.log(`Found ${assignments.length} assignments for TA ${taId}:`, assignments);
    
    // If no assignments are found, still return success but with empty array
    res.json({
      success: true,
      assignments: assignments || []
    });
  } catch (err) {
    console.error('Error in getTAProctorings:', err);
    res.status(500).json({ 
      success: false,
      error: 'Database error: ' + err.message
    });
  }
};