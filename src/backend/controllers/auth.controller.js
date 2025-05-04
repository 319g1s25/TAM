const db = require('../db');

const userRoles = [
  { table: 'authstaff', role: 'authstaff' },
  { table: 'deansoffice', role: 'deansoffice' },
  { table: 'departmentchair', role: 'departmentchair' },
  { table: 'instructor', role: 'instructor' },
  { table: 'ta', role: 'ta' }
];

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    for (const { table, role } of userRoles) {
      const query = `SELECT * FROM ${table} WHERE email = ? AND password = ?`;
      const rows = await db.query(query, [email, password]);
      console.log(`Checking table: ${table}, got rows:`, rows);

      if (rows && rows.length > 0) {
        const user = rows[0];
        return res.status(200).json({
          success: true,
          user: {
            id: user.id,
            name: `${user.name || ''} ${user.surname || ''}`.trim(),
            email: user.email,
            role: role
          },
          token: 'fake-jwt-token',
          expiresIn: 7200
        });
      }
    }
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (err) {
    console.error('Login error:', err); // 💥 This will show the real issue
    res.status(500).json({ success: false, message: 'Server error' });
  }
  
};
