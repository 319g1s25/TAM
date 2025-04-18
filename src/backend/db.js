const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tam_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL connection successful!');
    connection.release();
    return true;
  } catch (error) {
    console.error('MySQL connection failed:', error.message);
    return false;
  }
}

// Execute SQL query
async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Error executing query:', error.message);
    throw error;
  }
}

// Initialize database with required tables and demo users
async function initializeDatabase() {
  console.log('Initializing database...');
  
  // Create Users table
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      firstName VARCHAR(50) NOT NULL,
      lastName VARCHAR(50) NOT NULL,
      role ENUM('admin', 'instructor', 'student') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  
  // Create Courses table
  await query(`
    CREATE TABLE IF NOT EXISTS courses (
      id INT PRIMARY KEY AUTO_INCREMENT,
      code VARCHAR(20) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      instructor_id INT,
      credits INT NOT NULL,
      term VARCHAR(50),
      year INT,
      FOREIGN KEY (instructor_id) REFERENCES users(id)
    )
  `);
  
  // Create Assignments table
  await query(`
    CREATE TABLE IF NOT EXISTS assignments (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(100) NOT NULL,
      description TEXT,
      course_id INT,
      due_date DATETIME NOT NULL,
      points INT NOT NULL,
      status ENUM('active', 'draft', 'archived') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id)
    )
  `);
  
  // Create Workload table
  await query(`
    CREATE TABLE IF NOT EXISTS workload (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      assignment_id INT NOT NULL,
      time_spent INT NOT NULL,  # in minutes
      difficulty_rating INT,    # scale 1-5
      comments TEXT,
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (assignment_id) REFERENCES assignments(id)
    )
  `);
  
  // Check if we need to add demo users
  const users = await query('SELECT * FROM users LIMIT 1');
  if (users.length === 0) {
    // Add demo admin user
    await query(`
      INSERT INTO users (username, password, email, firstName, lastName, role)
      VALUES ('admin', 'password123', 'admin@example.com', 'Admin', 'User', 'admin')
    `);
    
    // Add demo instructor
    await query(`
      INSERT INTO users (username, password, email, firstName, lastName, role)
      VALUES ('instructor', 'password123', 'instructor@example.com', 'Jane', 'Doe', 'instructor')
    `);
    
    // Add demo student
    await query(`
      INSERT INTO users (username, password, email, firstName, lastName, role)
      VALUES ('student', 'password123', 'student@example.com', 'John', 'Smith', 'student')
    `);
    
    console.log('Demo users created successfully.');
  }
  
  // Check if we need to add demo courses
  const courses = await query('SELECT * FROM courses LIMIT 1');
  if (courses.length === 0) {
    // Get instructor ID
    const instructor = await query("SELECT id FROM users WHERE role = 'instructor' LIMIT 1");
    if (instructor.length > 0) {
      const instructorId = instructor[0].id;
      
      // Add demo courses
      await query(`
        INSERT INTO courses (code, name, description, instructor_id, credits, term, year)
        VALUES 
        ('CS101', 'Introduction to Computer Science', 'Fundamentals of computer science and programming', ?, 3, 'Fall', 2023),
        ('CS201', 'Data Structures', 'Advanced data structures and algorithms', ?, 4, 'Spring', 2023),
        ('CS301', 'Software Engineering', 'Principles of software development', ?, 3, 'Fall', 2023)
      `, [instructorId, instructorId, instructorId]);
      
      console.log('Demo courses created successfully.');
    }
  }
  
  console.log('Database initialization complete!');
}

module.exports = {
  query,
  testConnection,
  initializeDatabase
}; 