const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');
const morgan = require('morgan');
const taRoutes = require('./routes/ta.router');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
// TODO: Add routes here

app.use('/api/ta', taRoutes); // mounted at /api/ta

// Start the server
async function startServer() {
  try {
    // Test database connection
    const connected = await db.testConnection();
    if (connected) {
      
      // Start listening
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } else {
      console.error('Server failed to start due to database connection issues');
      process.exit(1);
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // For now, use simple authentication
    // In production, use proper password hashing and verification
    const users = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Temporary bypass of password check for demo accounts
    if (email.endsWith('@example.com') && (password === 'password' || 
        (email === 'admin@example.com' && password === 'admin123') ||
        (email === 'coordinator@example.com' && password === 'coord123') ||
        (email === 'ta@example.com' && password === 'ta123456'))) {
      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }
    
    // In a real app, verify with bcrypt:
    // const passwordMatch = await bcrypt.compare(password, user.password);
    // if (!passwordMatch) {
    //   return res.status(401).json({ success: false, message: 'Invalid email or password' });
    // }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Assignments routes
app.get('/api/assignments', async (req, res) => {
  try {
    const assignments = await db.query(`
      SELECT a.*, c.course_code, c.title as course_title, u.name as ta_name
      FROM assignments a
      JOIN courses c ON a.course_id = c.id
      JOIN users u ON a.ta_id = u.id
    `);
    res.json({ success: true, assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/assignments', async (req, res) => {
  try {
    const { ta_id, course_id, hours_per_week, start_date, end_date } = req.body;
    
    const id = uuidv4();
    await db.query(`
      INSERT INTO assignments (id, ta_id, course_id, hours_per_week, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `, [id, ta_id, course_id, hours_per_week, start_date, end_date]);
    
    res.status(201).json({ success: true, id });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/assignments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ta_id, course_id, hours_per_week, start_date, end_date, status } = req.body;
    
    await db.query(`
      UPDATE assignments
      SET ta_id = ?, course_id = ?, hours_per_week = ?, start_date = ?, end_date = ?, status = ?
      WHERE id = ?
    `, [ta_id, course_id, hours_per_week, start_date, end_date, status, id]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/assignments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM assignments WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Workload routes
app.get('/api/workload', async (req, res) => {
  try {
    const { ta_id, assignment_id } = req.query;
    
    let query = `
      SELECT w.*, a.course_id, c.course_code, c.title as course_title
      FROM workload w
      JOIN assignments a ON w.assignment_id = a.id
      JOIN courses c ON a.course_id = c.id
    `;
    
    const params = [];
    if (ta_id) {
      query += ' WHERE w.ta_id = ?';
      params.push(ta_id);
      if (assignment_id) {
        query += ' AND w.assignment_id = ?';
        params.push(assignment_id);
      }
    } else if (assignment_id) {
      query += ' WHERE w.assignment_id = ?';
      params.push(assignment_id);
    }
    
    const workload = await db.query(query, params);
    res.json({ success: true, workload });
  } catch (error) {
    console.error('Error fetching workload:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/workload', async (req, res) => {
  try {
    const { assignment_id, ta_id, hours, date, description } = req.body;
    
    const id = uuidv4();
    await db.query(`
      INSERT INTO workload (id, assignment_id, ta_id, hours, date, description, approved)
      VALUES (?, ?, ?, ?, ?, ?, false)
    `, [id, assignment_id, ta_id, hours, date, description]);
    
    res.status(201).json({ success: true, id });
  } catch (error) {
    console.error('Error creating workload entry:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/workload/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { hours, date, description, approved } = req.body;
    
    await db.query(`
      UPDATE workload
      SET hours = ?, date = ?, description = ?, approved = ?
      WHERE id = ?
    `, [hours, date, description, approved, id]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating workload entry:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Course routes
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await db.query(`
      SELECT c.*, u.name as coordinator_name
      FROM courses c
      LEFT JOIN users u ON c.coordinator_id = u.id
    `);
    res.json({ success: true, courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Users routes
app.get('/api/users', async (req, res) => {
  try {
    const { role } = req.query;
    
    let query = 'SELECT id, name, email, role FROM users';
    const params = [];
    
    if (role) {
      query += ' WHERE role = ?';
      params.push(role);
    }
    
    const users = await db.query(query, params);
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ... existing code ... 