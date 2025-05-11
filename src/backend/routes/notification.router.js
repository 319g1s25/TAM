const express = require('express');
const router = express.Router();
const { sendNotificationEmail } = require('../utils/email.service');

// Get users from database
const db = require('../db');

/**
 * Send notification email
 * POST /api/notifications/email
 */
router.post('/email', async (req, res) => {
  try {
    const { userId, notificationType, message, data } = req.body;
    
    if (!userId || !notificationType || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: userId, notificationType, message' 
      });
    }
    
    // Get user email from database
    const userQuery = 'SELECT email FROM users WHERE id = ?';
    const [users] = await db.promise().query(userQuery, [userId]);
    
    if (!users || users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    const userEmail = users[0].email;
    
    // Send the email notification
    const result = await sendNotificationEmail(userEmail, notificationType, message, data);
    
    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: 'Email notification sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send email notification',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error sending notification email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending notification email',
      error: error.message
    });
  }
});

/**
 * Send notification email to multiple users
 * POST /api/notifications/email/bulk
 */
router.post('/email/bulk', async (req, res) => {
  try {
    const { userIds, notificationType, message, data } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0 || !notificationType || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: userIds (array), notificationType, message' 
      });
    }
    
    // Get users' emails from database
    const placeholders = userIds.map(() => '?').join(',');
    const userQuery = `SELECT id, email FROM users WHERE id IN (${placeholders})`;
    const [users] = await db.promise().query(userQuery, userIds);
    
    if (!users || users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No users found' 
      });
    }
    
    // Send emails to each user
    const results = [];
    for (const user of users) {
      const result = await sendNotificationEmail(user.email, notificationType, message, data);
      results.push({
        userId: user.id,
        email: user.email,
        success: result.success,
        messageId: result.messageId,
        error: result.error
      });
    }
    
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;
    
    res.status(200).json({ 
      success: true, 
      message: `Sent ${successful} emails, failed ${failed} emails`,
      results
    });
  } catch (error) {
    console.error('Error sending bulk notification emails:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending bulk notification emails',
      error: error.message
    });
  }
});

module.exports = router;
