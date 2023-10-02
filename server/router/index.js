const router = require('express').Router();
const admin = require('./admin');
const file = require('./file');
const folder = require('./folder');
const auth = require('./auth');

router.use('/admin', admin);
router.use('/file', file);
router.use('/folder', folder);
router.use('/auth', auth);

module.exports = router;
