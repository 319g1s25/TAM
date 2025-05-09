const db = require('../db');

// Create new leave request
exports.createLeaveRequest = async (req, res) => {
  const { taID, startDate, endDate, note } = req.body;
  const status = 'Pending';

  console.log('Creating leave request with:', {
    taID, startDate, endDate, note, status
  });

  try {
    const result = await db.query(
      `INSERT INTO leaverequest (taID, startDate, endDate, status, note)
       VALUES (?, ?, ?, ?, ?)`,
      [taID, startDate, endDate, status, note]
    );

    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Failed to insert leave request:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};

exports.getAllLeaveRequests = async (req, res) => {
  try {
    const role = req.query.role;
    const userId = req.query.userId;

    let sql = `
      SELECT 
        lr.*, 
        ta.name AS taName, 
        ta.department 
      FROM leaverequest lr
      JOIN ta ON lr.taID = ta.id
    `;
    const params = [];

    // If the user is a TA, restrict to their own requests
    if (role === 'ta' && userId) {
      sql += ' WHERE lr.taID = ?';
      params.push(userId);
    }

    const requests = await db.query(sql, params);
    res.status(200).json({ success: true, requests });
  } catch (err) {
    console.error('Error fetching leave requests:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
};


exports.updateLeaveRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status, reviewedBy, reviewDate, reviewComments } = req.body;

  const formattedDate = new Date(reviewDate).toISOString().slice(0, 19).replace('T', ' ');

  const normalizedStatus = status.toLowerCase();
  if (!['approved', 'rejected'].includes(normalizedStatus)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  try {
    // Update leave request metadata
    await db.query(`
      UPDATE leaverequest
      SET status = ?, reviewedBy = ?, reviewDate = ?, reviewComments = ?
      WHERE id = ?
    `, [normalizedStatus, reviewedBy, formattedDate, reviewComments, id]);

    if (normalizedStatus === 'approved') {
      const leave = await db.query('SELECT taID, startDate, endDate FROM leaverequest WHERE id = ?', [id]);
      if (!leave || leave.length === 0) {
        return res.status(404).json({ success: false, message: 'Leave request not found' });
      }

      const { taID, startDate, endDate } = leave[0];

      // Schedule isOnLeave = 1 at startDate
      const startTime = new Date(startDate + 'T00:00:00').getTime();
      const endTime = new Date(endDate + 'T23:59:59').getTime();
      const now = Date.now();

      const activateDelay = Math.max(startTime - now, 0);
      const deactivateDelay = Math.max(endTime - now, 0);

      setTimeout(async () => {
        try {
          await db.query('UPDATE ta SET isOnLeave = 1 WHERE id = ?', [taID]);
          console.log(`TA ${taID} is now on leave`);
        } catch (err) {
          console.error('Failed to set isOnLeave = 1:', err);
        }
      }, activateDelay);

      setTimeout(async () => {
        try {
          await db.query('UPDATE ta SET isOnLeave = 0 WHERE id = ?', [taID]);
          console.log(`TA ${taID} is no longer on leave`);
        } catch (err) {
          console.error('Failed to reset isOnLeave = 0:', err);
        }
      }, deactivateDelay);
    }

    res.json({ success: true, updatedId: id });
  } catch (err) {
    console.error('Error updating leave request status:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
};

