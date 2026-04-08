const express = require('express');
const { 
  submitAttempt, 
  getMyAttempts, 
  getAttemptById,
  getQuizAttempts 
} = require('../controllers/attemptController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, authorize('student'), submitAttempt);
router.get('/my-attempts', authenticate, authorize('student'), getMyAttempts);
router.get('/quiz/:quizId', authenticate, authorize('faculty'), getQuizAttempts);
router.get('/:id', authenticate, getAttemptById);

module.exports = router;
