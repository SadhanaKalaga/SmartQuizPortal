const express = require('express');
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

router.post('/', authenticate, authorize('faculty'), createQuiz);
router.get('/', authenticate, getAllQuizzes);
router.get('/my-quizzes', authenticate, authorize('faculty'), getMyQuizzes);
router.get('/:id', authenticate, getQuizById);
router.put('/:id', authenticate, authorize('faculty'), updateQuiz);
router.delete('/:id', authenticate, authorize('faculty'), deleteQuiz);

module.exports = router;
