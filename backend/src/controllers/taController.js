const Task = require('../models/Task');

/* 
the syntax should be like the following ig

exports.getLogTask = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'A',
    path: '/admin/add-product',
    editing: false
  });
}; 

and also exports.postLogTask()...

ig what happens is getlogtask gets the info from the forms and saves is in req.body

then we will use req.body info for creating a Task in the database.
*/