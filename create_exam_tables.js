// Script to ensure exam tables exist
const db = require('./src/backend/db');

async function createExamTables() {
  try {
    console.log('Creating exam tables...');
    
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
    console.log('Exam table created successfully');
    
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
    console.log('ProctoringAssignment table created successfully');
    
    console.log('All exam tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating exam tables:', error);
    process.exit(1);
  }
}

createExamTables();
