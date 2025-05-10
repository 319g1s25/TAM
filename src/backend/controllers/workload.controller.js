const db = require('../db');

// Create new workload entry
exports.createWorkload = async (req, res) => {
  const { taID, courseID, date, hoursspent, description, tasktype } = req.body;

  const approved = null;
  console.log('Creating workload with values:', {
    taID, courseID, date, hoursspent, description, tasktype, approved
  });

  
  try {
    const result = await db.query(
      `INSERT INTO task (taID, courseID, date, hoursspent, description, tasktype, approved)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [taID, courseID, date, hoursspent, description, tasktype, approved]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Failed to insert workload:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

// Get all workload entries
exports.getAllWorkloads = async (req, res) => {
  try {
    const [tasks] = await db.query('SELECT * FROM task');
    res.status(200).json({ success: true, workload: tasks });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

// Get workload entries for a specific TA
exports.getWorkloadsByTA = async (req, res) => {
  const { ta_id } = req.query;
  if (!ta_id) return res.status(400).json({ error: 'ta_id is required' });

  try {
    const [tasks] = await db.query('SELECT * FROM task WHERE taID = ?', [ta_id]);
    res.status(200).json({ success: true, workload: tasks });
  } catch (err) {
    console.error('Error fetching TA workload:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

// Delete a workload entry
exports.deleteWorkload = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM task WHERE id = ?', [id]);
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
        t.*, 
        ta.name AS ta_name, 
        ta.email AS ta_email,
        c.course_code AS course_code,
        c.name AS course_title
      FROM task t
      JOIN ta ON t.taID = ta.id
      JOIN course c ON t.courseID = c.id
      WHERE t.courseID IN (${placeholders})
      ORDER BY t.date DESC
    `, courseIds);

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

    // Update the task's approval status
    const updateTaskResult = await db.query(
      `UPDATE task SET approved = ? WHERE id = ?`,
      [approved, id]
    );
    console.log('Task approval update result:', updateTaskResult);

    // Fetch the task details to update the TA's total workload
    const task = await db.query(
      `SELECT taID, hoursspent FROM task WHERE id = ?`,
      [id]
    );
    console.log('Fetched task details:', task);

    if (task.length > 0) {
      const { taID, hoursspent } = task[0];

      const updateWorkloadResult = await db.query(
        `UPDATE ta SET totalWorkload = totalWorkload + ? WHERE id = ?`,
        [hoursspent, taID]
      );
      console.log('TA total workload update result:', updateWorkloadResult);
    } else {
      console.warn(`No task found with the given ID: ${id}`);
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating task approval:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
