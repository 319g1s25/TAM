/**
 * TA - Course matching
 */
const db = require('../db');

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
      if (!courseToTAIds.has(row.course_id)) {
        courseToTAIds.set(row.course_id, []);
      }
      courseToTAIds.get(row.course_id).push(row.ta_id);
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
