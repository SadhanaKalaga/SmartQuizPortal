const express = require('express');
const { body } = require('express-validator');
const { 
  createQuiz, 
  getAllQuizzes, 
  getQuizById, 
  updateQuiz, 
  deleteQuiz,
  getMyQuizzes 
} = require('../controllers/quizController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, authorize('faculty'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('timeLimit').isInt({ min: 1 }).withMessage('Time limit must be at least 1 minute'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
  body('startTime').isISO8601().withMessage('Valid start time is required'),
  body('endTime').isISO8601().withMessage('Valid end time is required'),
  body('maxAttempts').optional().isInt({ min: 1 }).withMessage('Max attempts must be at least 1')
], createQuiz);

router.get('/', authenticate, getAllQuizzes);
router.get('/my-quizzes', authenticate, authorize('faculty'), getMyQuizzes);
router.get('/:id', authenticate, getQuizById);
router.put('/:id', authenticate, authorize('faculty'), updateQuiz);
router.delete('/:id', authenticate, authorize('faculty'), deleteQuiz);

module.exports = router;
