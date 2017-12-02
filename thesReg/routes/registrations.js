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
router.get('/conferences/:conferenceId/registration/:registrationId/ies/:studentId', iesController.getStudentIes);

// Solo IES:
router.get('/conferences/:conferenceId/registration/:registrationId/solo/:studentId/new', iesController.getNewSolo);
router.post('/conferences/:conferenceId/registration/:registrationId/solo/:studentId/new', iesController.createNewSolo);
router.get('/conferences/:conferenceId/registration/:registrationId/solo/:studentId/edit/:iesId', iesController.editSolo);
router.post('/conferences/:conferenceId/registration/:registrationId/solo/:studentId/edit/:iesId', iesController.updateSolo);

// Duo IES:
router.get('/conferences/:conferenceId/registration/:registrationId/duo/:studentId/new', iesController.getNewDuo);
router.post('/conferences/:conferenceId/registration/:registrationId/duo/:studentId/new', iesController.createNewDuo);
router.get('/conferences/:conferenceId/registration/:registrationId/duo/:studentId/edit/:iesId', iesController.editDuo);
router.post('/conferences/:conferenceId/registration/:registrationId/duo/:studentId/edit/:iesId', iesController.updateDuo);

// Technical IES:
router.get('/conferences/:conferenceId/registration/:registrationId/tech/:studentId/new', iesController.getNewTech);
router.post('/conferences/:conferenceId/registration/:registrationId/tech/:studentId/new', iesController.createNewTech);
router.get('/conferences/:conferenceId/registration/:registrationId/tech/:studentId/edit/:iesId', iesController.editTech);
router.post('/conferences/:conferenceId/registration/:registrationId/tech/:studentId/edit/:iesId', iesController.updateTech);




module.exports = router;