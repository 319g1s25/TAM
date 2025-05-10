/**
 * Script to add proctoring assignments for testing the calendar component
 */
const db = require('./db');

async function seedProctoringData() {
  try {
    console.log('Starting to seed proctoring data...');
    
    // Check if we already have exam data
    const exams = await db.query('SELECT * FROM exam');
    console.log(`Found ${exams.length} exams in database`);
    
    // Check if we have TAs in the database
    const tas = await db.query('SELECT * FROM ta');
    console.log(`Found ${tas.length} TAs in database`);
    
    if (tas.length === 0) {
      console.error('No TAs found in database. Cannot seed proctoring data.');
      return;
    }
    
    // Get courses from database
    const courses = await db.query('SELECT * FROM course');
    console.log(`Found ${courses.length} courses in database`);
    
    if (courses.length === 0) {
      console.error('No courses found in database. Cannot seed exam data.');
      return;
    }
    
    // Create exams if none exist
    if (exams.length === 0) {
      console.log('No exams found, creating sample exams...');
      
      // Create exams for the next few weeks
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      const twoWeeks = new Date(today);
      twoWeeks.setDate(today.getDate() + 14);
      
      // Insert exams
      await db.query(
        `INSERT INTO exam (userID, courseID, date, duration, proctorsRequired) 
         VALUES 
         (?, ?, ?, ?, ?),
         (?, ?, ?, ?, ?)`,
        [
          1, courses[0].id, nextWeek.toISOString(), 120, 2,
          1, courses[1].id, twoWeeks.toISOString(), 180, 3
        ]
      );
      
      console.log('Created sample exams');
    }
    
    // Refresh exams list
    const currentExams = await db.query('SELECT * FROM exam');
    
    // Check if we already have proctoring assignments
    const assignments = await db.query('SELECT * FROM proctoringassignment');
    console.log(`Found ${assignments.length} proctoring assignments in database`);
    
    if (assignments.length === 0) {
      console.log('No proctoring assignments found, creating sample assignments...');
      
      // For each TA, assign them to at least one exam
      for (let i = 0; i < Math.min(tas.length, currentExams.length); i++) {
        await db.query(
          `INSERT INTO proctoringassignment (taID, examID, status) 
           VALUES (?, ?, ?)`,
          [tas[i].id, currentExams[i].id, i % 2 === 0 ? 'confirmed' : 'pending']
        );
      }
      
      console.log('Created sample proctoring assignments');
    }
    
    // Display the final state
    const finalAssignments = await db.query(`
      SELECT pa.id, pa.taID, pa.examID, pa.status,
             e.date, e.duration, e.proctorsRequired,
             c.id as courseId, c.course_code, c.name as courseName
      FROM proctoringassignment pa
      JOIN exam e ON pa.examID = e.id
      JOIN course c ON e.courseID = c.id
      ORDER BY e.date ASC`
    );
    
    console.log('Current proctoring assignments:');
    console.log(finalAssignments);
    
    console.log('Proctoring data seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding proctoring data:', error);
  } finally {
    process.exit();
  }
}

// Run the seeding function
seedProctoringData(); 