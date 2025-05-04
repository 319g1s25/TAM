const db = require('../db');

exports.getDashboardStats = async (req, res) => {
  try {
    const taResult = await db.query('SELECT COUNT(*) AS count FROM ta');
    const courseResult = await db.query('SELECT COUNT(*) AS count FROM course');
    const assignmentResult = await db.query('SELECT COUNT(*) AS count FROM proctoringassignment');
    const reportResult = await db.query('SELECT COUNT(*) AS count FROM task');
    const pendingResult = await db.query('SELECT COUNT(*) AS count FROM task WHERE approved = ?', [ 0 ]);

    const taCount = taResult[0].count;
    const courseCount = courseResult[0].count;
    const assignmentCount = assignmentResult[0].count;
    const reportCount = reportResult[0].count;
    const pendingWorkloadCount = pendingResult[0].count;

    res.json({
      success: true,
      stats: {
        taCount,
        taChange: 0,
        courseCount,
        activeCourseCount: courseCount,
        assignmentCount,
        pendingAssignmentCount: 0,
        avgWorkload: 0,
        reportCount,
        leaveRequestCount: 0,
        pendingWorkloadCount
      }
    });
  } catch (err) {
    console.error('Error loading dashboard stats:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
