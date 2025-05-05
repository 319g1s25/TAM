// Script to ensure exam tables exist in the database
const db = require('./db');

// Helper function to run a query and log the result
async function runQuery(query, params = []) {
  try {
    const result = await db.query(query, params);
    console.log(`Query executed successfully: ${query.slice(0, 40)}...`);
    return result;
  } catch (error) {
    console.error(`Query failed: ${query.slice(0, 40)}...`, error);
    throw error;
  }
}

async function initializeExamTables() {
  try {
    console.log("Initializing exam tables...");

    // Create exam table
    await runQuery(`
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

    // Create proctoringassignment table
    await runQuery(`
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

    console.log("Exam tables initialized successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error initializing exam tables:", error);
    return { success: false, error };
  }
}

// Execute directly if this file is run with 'node exam_init.js'
if (require.main === module) {
  initializeExamTables()
    .then(result => {
      console.log("Exam tables initialization result:", result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
      console.error("Unhandled error during initialization:", err);
      process.exit(1);
    });
} else {
  // Export for use in other modules
  module.exports = initializeExamTables;
}
