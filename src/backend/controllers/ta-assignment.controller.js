/**
 * TA - Course matching controller
 * Handles both automatic and manual TA assignments to courses
 */
const db = require('../db');

/**
 * Get all TA-Course assignments
 */
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await db.query(`
      SELECT 
        t.id as taId, t.name as taName, t.surname as taSurname, t.department as taDepartment, 
        c.id as courseId, c.course_code, c.name as courseName, c.department as courseDepartment
      FROM tacourse tc
      JOIN ta t ON tc.taID = t.id
      JOIN course c ON tc.courseID = c.id
    `);
    
    // Format as structured data
    const formatted = assignments.map(row => ({
      ta: {
        id: row.taId,
        name: row.taName,
        surname: row.taSurname,
        department: row.taDepartment
      },
      course: {
        id: row.courseId,
        course_code: row.course_code,
        name: row.courseName,
        department: row.courseDepartment
      }
    }));
    
    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error fetching TA assignments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get TAs assigned to a specific course
 */
exports.getTAsForCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const assignedTAs = await db.query(`
      SELECT t.*
      FROM tacourse tc
      JOIN ta t ON tc.taID = t.id
      WHERE tc.courseID = ?
    `, [courseId]);
    
    res.status(200).json(assignedTAs);
  } catch (err) {
    console.error('Error fetching TAs for course:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get courses assigned to a specific TA
 */
exports.getCoursesForTA = async (req, res) => {
  try {
    const taId = req.params.taId;
    const assignedCourses = await db.query(`
      SELECT c.*
      FROM tacourse tc
      JOIN course c ON tc.courseID = c.id
      WHERE tc.taID = ?
    `, [taId]);
    
    res.status(200).json(assignedCourses);
  } catch (err) {
    console.error('Error fetching courses for TA:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Manually assign a TA to a course
 */
exports.manualAssign = async (req, res) => {
  try {
    console.log('Manual TA assignment request received:', req.body);
    const { taId, courseId } = req.body;
    
    // Input validation
    if (!taId || !courseId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: taId and courseId are required' 
      });
    }
    
    // Check if assignment already exists
    const existingAssignment = await db.query(
      `SELECT * FROM tacourse WHERE taID = ? AND courseID = ?`,
      [taId, courseId]
    );
    
    console.log('Existing assignment check:', existingAssignment);
    
    if (existingAssignment.length > 0) {
      return res.status(400).json({ success: false, message: 'TA is already assigned to this course' });
    }
    
    // Verify TA exists
    const ta = await db.query(`SELECT * FROM ta WHERE id = ?`, [taId]);
    console.log('TA check:', ta);
    
    if (ta.length === 0) {
      return res.status(404).json({ success: false, message: 'TA not found' });
    }
    
    // Verify course exists
    const course = await db.query(`SELECT * FROM course WHERE id = ?`, [courseId]);
    console.log('Course check:', course);
    
    if (course.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    // Create assignment
    console.log('Inserting TA-Course assignment with taID:', taId, 'courseID:', courseId);
    const insertResult = await db.query(
      `INSERT INTO tacourse (taID, courseID) VALUES (?, ?)`,
      [taId, courseId]
    );
    console.log('Insert result:', insertResult);
    
    // Update TA's workload
    const updateResult = await db.query(
      `UPDATE ta SET totalWorkload = totalWorkload + 20 WHERE id = ?`,
      [taId]
    );
    console.log('Update workload result:', updateResult);
    
    res.status(201).json({ 
      success: true, 
      message: `Successfully assigned ${ta[0].name} ${ta[0].surname} to ${course[0].course_code}` 
    });
  } catch (err) {
    console.error('Error during manual TA assignment:', err);
    res.status(500).json({ success: false, message: 'Internal server error: ' + err.message });
  }
};

/**
 * Remove a TA from a course
 */
exports.removeAssignment = async (req, res) => {
  try {
    console.log('Remove TA assignment request received with params:', req.params);
    const { courseId, taId } = req.params;
    
    // Input validation
    if (!taId || !courseId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters: taId and courseId are required' 
      });
    }
    
    // Check if assignment exists
    const existingAssignment = await db.query(
      `SELECT * FROM tacourse WHERE taID = ? AND courseID = ?`,
      [taId, courseId]
    );
    console.log('Existing assignment check for removal:', existingAssignment);
    
    if (existingAssignment.length === 0) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    // Get TA and course for response message
    const ta = await db.query(`SELECT * FROM ta WHERE id = ?`, [taId]);
    const course = await db.query(`SELECT * FROM course WHERE id = ?`, [courseId]);
    console.log('TA and Course data for removal:', { ta, course });
    
    // Remove assignment
    const deleteResult = await db.query(
      `DELETE FROM tacourse WHERE taID = ? AND courseID = ?`,
      [taId, courseId]
    );
    console.log('Delete result:', deleteResult);
    
    // Update TA's workload
    const updateResult = await db.query(
      `UPDATE ta SET totalWorkload = GREATEST(0, totalWorkload - 20) WHERE id = ?`,
      [taId]
    );
    console.log('Update workload result for removal:', updateResult);
    
    res.status(200).json({ 
      success: true, 
      message: `Successfully removed ${ta[0].name} ${ta[0].surname} from ${course[0].course_code}` 
    });
  } catch (err) {
    console.error('Error removing TA assignment:', err);
    res.status(500).json({ success: false, message: 'Internal server error: ' + err.message });
  }
};

/**
 * Automatically assign TAs to courses
 */
exports.autoAssignTAs = async (req, res) => {
  try {
    // Step 1: Fetch all courses with needed TA info
    const courses = await db.query(`
      SELECT id, course_code, name, department, ta_required
      FROM course
    `);

    // Step 2: Fetch all TAs
    const tas = await db.query(`
      SELECT id, name, surname, department, totalWorkload, msOrPhdStatus, isOnLeave, proctoringEnabled
      FROM ta
    `);

    // Step 3: Fetch existing TA-course assignments
    const existingAssignments = await db.query(`SELECT courseID, taID FROM tacourse`);
    const courseToTAIds = new Map();
    for (const row of existingAssignments) {
      if (!courseToTAIds.has(row.courseID)) {
        courseToTAIds.set(row.courseID, []);
      }
      courseToTAIds.get(row.courseID).push(row.taID);
    }

    // Step 4: Apply auto-assignment algorithm
    const assignments = new Map();

    for (const course of courses) {
      const requiredTAs = course.ta_required || 0;
      const currentlyAssigned = courseToTAIds.get(course.id) || [];
      const shortage = requiredTAs - currentlyAssigned.length;
      if (shortage <= 0) continue;

      const eligibleTAs = tas
        .filter(ta =>
          !ta.isOnLeave &&
          ta.totalWorkload < 40 &&
          ta.department === course.department &&
          !currentlyAssigned.includes(ta.id)
        )
        .sort((a, b) => {
          if (a.msOrPhdStatus === 'PhD' && b.msOrPhdStatus !== 'PhD') return -1;
          if (b.msOrPhdStatus === 'PhD' && a.msOrPhdStatus !== 'PhD') return 1;
          return a.totalWorkload - b.totalWorkload;
        });

      const assignedTAs = eligibleTAs.slice(0, shortage).map(ta => {
        ta.totalWorkload += 20; // update local workload tracking
        return ta.id;
      });

      assignments.set(course.id, [...currentlyAssigned, ...assignedTAs]);

      // Update in DB
      for (const taId of assignedTAs) {
        await db.query(
          `INSERT INTO tacourse (taID, courseID) VALUES (?, ?)`,
          [taId, course.id]
        );
      }
    }

    res.status(200).json({ message: 'TA assignments completed.', totalCoursesAssigned: assignments.size });
  } catch (err) {
    console.error('TA assignment failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
