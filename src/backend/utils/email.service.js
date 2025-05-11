// NOTE: Real email functionality has been disabled to prevent login issues
// const nodemailer = require('nodemailer');

// Mock transporter that just logs instead of sending emails
const transporter = {
  sendMail: (mailOptions) => {
    console.log('Email sending disabled, would have sent:', mailOptions);
    return Promise.resolve({ messageId: 'mock-message-id-' + Date.now() });
  }
};

/**
 * Send an email notification
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text version of the email
 * @param {string} html - HTML version of the email (optional)
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: '"TAM Notification" <donotreplytam@gmail.com>',
      to,
      subject,
      text,
      html: html || text
    };

    // Log email details instead of actually sending
    console.log('Email sending disabled. Email details:', {
      to,
      subject,
      textLength: text?.length || 0
    });
    
    // Always return success since no actual sending is happening
    return { success: true, messageId: 'mock-message-id-' + Date.now() };
  } catch (error) {
    console.error('Mock email error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send a notification email
 * @param {string} to - Recipient email address
 * @param {string} notificationType - Type of notification
 * @param {string} message - Notification message
 * @param {object} data - Additional data for the notification
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendNotificationEmail = async (to, notificationType, message, data = {}) => {
  let subject = 'TAM Notification';
  let htmlContent = '';
  
  switch (notificationType) {
    case 'exam_assigned':
      subject = 'You Have Been Assigned to Proctor an Exam';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px;">Exam Proctoring Assignment</h2>
          <p>Hello,</p>
          <p>${message}</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Exam Date:</strong> ${data.date || 'Not specified'}</p>
            <p><strong>Course:</strong> ${data.course || 'Not specified'}</p>
            <p><strong>Duration:</strong> ${data.duration || 'Not specified'} hours</p>
          </div>
          <p>Please log in to your TAM account for more details.</p>
          <p>Thank you,<br>TAM System</p>
        </div>
      `;
      break;
    
    case 'leave_request':
      subject = `Leave Request ${data.approved ? 'Approved' : 'Rejected'}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px;">Leave Request Update</h2>
          <p>Hello,</p>
          <p>${message}</p>
          <div style="background-color: ${data.approved ? '#ebf7ed' : '#fdf1f0'}; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Status:</strong> ${data.approved ? 'Approved' : 'Rejected'}</p>
            ${data.comments ? `<p><strong>Comments:</strong> ${data.comments}</p>` : ''}
          </div>
          <p>Please log in to your TAM account for more details.</p>
          <p>Thank you,<br>TAM System</p>
        </div>
      `;
      break;
    
    case 'workload_status':
      subject = `Workload Entry ${data.approved ? 'Approved' : 'Rejected'}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px;">Workload Entry Update</h2>
          <p>Hello,</p>
          <p>${message}</p>
          <div style="background-color: ${data.approved ? '#ebf7ed' : '#fdf1f0'}; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Status:</strong> ${data.approved ? 'Approved' : 'Rejected'}</p>
            <p><strong>Task:</strong> ${data.task || 'Not specified'}</p>
            <p><strong>Hours:</strong> ${data.hours || 'Not specified'}</p>
            <p><strong>Course:</strong> ${data.course || 'Not specified'}</p>
          </div>
          <p>Please log in to your TAM account for more details.</p>
          <p>Thank you,<br>TAM System</p>
        </div>
      `;
      break;
    
    default:
      // Default notification template
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px;">TAM Notification</h2>
          <p>Hello,</p>
          <p>${message}</p>
          <p>Please log in to your TAM account for more details.</p>
          <p>Thank you,<br>TAM System</p>
        </div>
      `;
  }
  
  return sendEmail(to, subject, message, htmlContent);
};

module.exports = {
  sendEmail,
  sendNotificationEmail
};
