const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingController');

router.post('/', controller.create);
router.get('/', controller.listByEmail);
router.patch('/:id/status', controller.updateStatus);

module.exports = router;
