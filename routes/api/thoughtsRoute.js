const router = require('express').Router();
const { create } = require('domain');
const {
  getThoughts,
  getSingleThought,
  createThought,
  deleteThought,
  addThought,
  removeThought,
} = require('../../controllers/thoughtController');

// /api/students
router.route('/').get(getThoughts).post(createThought);

// /api/users/:usr
router.route('/:thoughtId').get(getSingleThought).delete(deleteThought);

// /api/students/:studentId/assignments
router.route('/:userId/thoughts').post(addThought);

// /api/students/:studentId/assignments/:assignmentId
router.route('/:userId/thoughts/:thoughtId').delete(removeThought);

module.exports = router;
