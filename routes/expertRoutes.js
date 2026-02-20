const express = require('express');
const router = express.Router();
const controller = require('../controllers/expertController');

router.get('/', controller.list);
// categories route must come before :id to avoid being captured as an id
router.get('/categories', controller.categories);
router.get('/:id', controller.get);
router.get('/:id/slots', controller.slots);

module.exports = router;
