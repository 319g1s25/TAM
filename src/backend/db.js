const mysql = require('mysql2/promise');
require('dotenv').config();

// Set default credentials for development (Docker setup)
const DB_HOST = 'mysql';  // Using Docker container name
const DB_USER = 'root';
const DB_PASSWORD = 'cs319Team1.#';
const DB_NAME = 'ta_management';
const DB_PORT = 3306;

console.log('DB Connection Values:', {
  host: DB_HOST,
  user: DB_USER,
  database: DB_NAME
});

// Create connection pool
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
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
    
    // Check and seed classrooms if needed
    await ensureClassroomsExist();
    
    return true;
  } catch (error) {
    console.error('MySQL connection failed:', error.message);
    return false;
  }
}

// Ensure classrooms exist in the database
async function ensureClassroomsExist() {
  try {
    const classrooms = await query('SELECT * FROM classroom');
    
    if (!classrooms || classrooms.length === 0) {
      console.log('No classrooms found in database. Creating sample classrooms...');
      
      // Insert default classrooms
      await query(
        'INSERT INTO classroom (room, capacity, examCapacity) VALUES (?, ?, ?), (?, ?, ?)',
        ['BZ102', 64, 32, 'BZ103', 64, 32]
      );
      
      console.log('Sample classrooms created successfully');
    } else {
      console.log(`Found ${classrooms.length} classrooms in the database`);
    }
  } catch (error) {
    console.error('Error ensuring classrooms exist:', error.message);
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

module.exports = {
  query,
  testConnection,
  getConnection: () => pool.getConnection(),
  ensureClassroomsExist
};
