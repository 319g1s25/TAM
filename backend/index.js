const path = require('path');

const sequelize = require('./src/config/db');

const express = require('express');
const bodyParser = require('body-parser');

// i am not sure why or if the following is necessary (until -- point)
const AuthStaff = require('./src/models/AuthStaff');
const Classroom = require('./src/models/Classroom');
const Course = require('./src/models/Course');
const DeansOffice = require('./src/models/DeansOffice');
const DepartmentChair = require('./src/models/DepartmentChair');
const Exam = require('./src/models/Exam');
const ExamClassroom = require('./src/models/ExamClassroom');
const Instructor = require('./src/models/Instructor');
const LeaveRequest = require('./src/models/LeaveRequest');
const ProctoringAssignment = require('./src/models/ProctoringAssignment');
const SwapRequest = require('./src/models/SwapRequest');
const TA = require('./src/models/TA');
const TaCourse = require('./src/models/TaCourse');
const Task = require('./src/models/Task');
const User = require('./src/models/User');
//-- 
const app = express();

const taRoutes = require('./src/routes/ta');
// connect other routes in here as well

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000);

/*sequelize
  // .sync({ force: true })
  .sync()
  .then(result => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Nikki', surname: 'Lauda' });
    }
    return user;
  })
  .then(user => {
    // console.log(user);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });*/