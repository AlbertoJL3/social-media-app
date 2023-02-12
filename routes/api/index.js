const router = require('express').Router();
const thoughtsRoute = require('./thoughtsRoute');
const userRoutes = require('./userRoutes');

router.use('/thoughts', thoughtsRoute);
router.use('/users', userRoutes);

module.exports = router;
