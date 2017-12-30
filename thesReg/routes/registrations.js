var express = require('express');
var router = express.Router();
var registrationsController = require('../controllers/registrations.js');
var iesController = require('../controllers/ies.js');

// New Reg
router.post('/conferences/:conferenceId/registration/new', registrationsController.createNewRegistration);

// Edit Reg
router.get('/conferences/:conferenceId/registration/:registrationId/edit', registrationsController.editRegistration);

// Add/Remove Students
router.get('/conferences/:conferenceId/registration/:registrationId/editStudents', registrationsController.addOrRemoveStudents);
router.post('/conferences/:conferenceId/registration/:registrationId/editStudents', registrationsController.saveAddOrRemoveStudents);

// Show IES:
router.get('/conferences/:conferenceId/registration/:registrationId/student/:studentId/ies', iesController.getStudentIes);

// Solo IES:
router.get('/conferences/:conferenceId/registration/:registrationId/student/:studentId/ies/new', iesController.getNewIe);
router.post('/conferences/:conferenceId/registration/:registrationId/student/:studentId/ies/new', iesController.createNewIe);
router.get('/conferences/:conferenceId/registration/:registrationId/student/:studentId/ies/:ieId/edit', iesController.editIe);
router.post('/conferences/:conferenceId/registration/:registrationId/student/:studentId/ies/:ieId/edit', iesController.updateIe);



module.exports = router;