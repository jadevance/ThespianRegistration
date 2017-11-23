var express = require('express');
var router = express.Router();
var studentsController = require('../controllers/students.js');

router.get('/students', studentsController.getAllUsersStudents);

router.get('/students/new', studentsController.getNewStudentForm);
router.post('/students/new', studentsController.createNewStudent);

router.get('/students/:studentId/edit', studentsController.editStudent);
router.post('/students/:studentId/edit', studentsController.updateStudent);

module.exports = router;