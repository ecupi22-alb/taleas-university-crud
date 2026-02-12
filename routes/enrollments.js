const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

router.get('/', enrollmentController.getAll);
router.post('/', enrollmentController.enroll);
router.delete('/', enrollmentController.unenroll);

module.exports = router;
