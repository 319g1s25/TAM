const db = require('../db');

// Create new workload entry
exports.createWorkload = async (req, res) => {
  try {
    const { ta_id, course_id, date, hours, description, approved } = req.body;
    
    // Validate required fields
    if (!ta_id || !course_id || !date || !hours || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const result = await db.query(
      `INSERT INTO workload (ta_id, course_id, date, hours, description, approved)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [ta_id, course_id, date, hours, description, approved]
    );

    res.json({
      success: true,
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating workload entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating workload entry'
    });
  }
};

// Get all workload entries
exports.getAllWorkloads = async (req, res) => {
  try {
    const { ta_id, course_id } = req.query;
    let query = `
      SELECT w.*, c.name as course_name, c.course_code, t.name as ta_name, t.surname as ta_surname
      FROM workload w
      JOIN course c ON w.course_id = c.id
      JOIN ta t ON w.ta_id = t.id
    `;
    const params = [];

    if (ta_id) {
      query += ' WHERE w.ta_id = ?';
      params.push(ta_id);
    }

    if (course_id) {
      query += ta_id ? ' AND w.course_id = ?' : ' WHERE w.course_id = ?';
      params.push(course_id);
    }

    query += ' ORDER BY w.date DESC';

    const workloads = await db.query(query, params);
    console.log('Fetched workloads:', workloads);
    res.json({
      success: true,
      workload: workloads
    });
  } catch (error) {
    console.error('Error fetching workload entries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workload entries'
    });
  }
};

// Get workload entries for a specific TA
exports.getWorkloadsByTA = async (req, res) => {
  const { ta_id } = req.query;
  if (!ta_id) return res.status(400).json({ error: 'ta_id is required' });

  try {
    const workloads = await db.query(`
      SELECT w.*, a.course_id, c.course_code, c.name as course_title
      FROM workload w
      JOIN assignments a ON w.assignment_id = a.id
      JOIN course c ON a.course_id = c.id
      WHERE w.ta_id = ?
    `, [ta_id]);
    res.set('Cache-Control', 'no-store');
    console.log(`Workloads for TA ${ta_id}:`, workloads);
    res.status(200).json({ success: true, workload: workloads });
  } catch (err) {
    console.error('Error fetching TA workload:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

// Delete a workload entry
exports.deleteWorkload = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM workload WHERE id = ?', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting workload:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getInstructorWorkloads = async (req, res) => {
  const { instructorId } = req.params;

  try {
    // Get courses assigned to this instructor
    const instructorCourses = await db.query(
      `SELECT courseID FROM instructor_course WHERE instructorID = ?`,
      [instructorId]
    );

    console.log('Instructor Courses:', instructorCourses);

    if (!Array.isArray(instructorCourses) || instructorCourses.length === 0) {
      return res.json({ success: true, workload: [] });
    }

    const courseIds = instructorCourses.map(row => row.courseID);

    if (courseIds.length === 0) {
      return res.json({ success: true, workload: [] });
    }

    const placeholders = courseIds.map(() => '?').join(', ');
    const workload = await db.query(`
      SELECT 
        w.*, 
        t.name AS ta_name, 
        t.email AS ta_email,
        c.course_code,
        c.name AS course_title
      FROM workload w
      JOIN ta t ON w.ta_id = t.id
      JOIN course c ON w.course_id = c.id
      WHERE w.course_id IN (${placeholders})
      ORDER BY w.date DESC
    `, courseIds);

    console.log('Fetched workload for instructor:', workload);
    res.json({ success: true, workload });
  } catch (error) {
    console.error('Error fetching instructor workload:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.approveWorkloadEntry = async (req, res) => {
  let { id } = req.params;
  const { approved } = req.body; // approved: true or false

  try {
    // Ensure id is treated as an integer
    id = parseInt(id, 10);
    console.log(`Approving workload entry with ID: ${id} (type: ${typeof id}), Approved: ${approved}`);

    // Update the workload's approval status
    const updateWorkloadResult = await db.query(
      `UPDATE workload SET approved = ? WHERE id = ?`,
      [approved, id]
    );
    console.log('Workload approval update result:', updateWorkloadResult);

    // Fetch the workload details to update the TA's total workload
    const workload = await db.query(
      `SELECT ta_id, hours FROM workload WHERE id = ?`,
      [id]
    );
    console.log('Fetched workload details:', workload);

    if (workload.length > 0) {
      const { ta_id, hours } = workload[0];

      const updateWorkloadResult = await db.query(
        `UPDATE ta SET totalWorkload = totalWorkload + ? WHERE id = ?`,
        [hours, ta_id]
      );
      console.log('TA total workload update result:', updateWorkloadResult);
    } else {
      console.warn(`No workload found with the given ID: ${id}`);
      return res.status(404).json({ success: false, message: 'Workload not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating workload approval:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
