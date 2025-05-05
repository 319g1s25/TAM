// Script to ensure exam and proctoring tables exist
const db = require('./db');

async function ensureExamTables() {
  try {
    console.log('Checking and creating exam tables if they don\'t exist...');
    
    // Create exam table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS exam (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userID INT NOT NULL,
        courseID INT NOT NULL,
        date DATETIME NOT NULL,
        duration DECIMAL(5,2) NOT NULL,
        proctorsRequired INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Exam table checked/created successfully');
    
    // Create proctoringassignment table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS proctoringassignment (
        id INT AUTO_INCREMENT PRIMARY KEY,
        examID INT NOT NULL,
        taID INT NOT NULL,
        status ENUM('assigned', 'accepted', 'declined', 'completed') DEFAULT 'assigned',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_exam_ta (examID, taID)
      )
    `);
    console.log('ProctoringAssignment table checked/created successfully');
    
    console.log('All exam tables ensured successfully!');
  } catch (error) {
    console.error('Error ensuring exam tables:', error);
  }
}

// Run immediately if this script is executed directly
if (require.main === module) {
  ensureExamTables()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Failed to ensure exam tables:', err);
      process.exit(1);
    });
} else {
  // Export for use in other modules
  module.exports = ensureExamTables;
}
