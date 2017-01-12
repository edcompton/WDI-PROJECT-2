const express = require('express');
const router  = express.Router();

const venuesController = require('../controllers/venues');
const staticsController = require('../controllers/statics');
const gigsController    = require('../controllers/gigs');

router.route('/')
.get(staticsController.home);

router.route('/venues')
.get(venuesController.index);

router.route('/gigs')
.get(gigsController.index);

module.exports = router;
