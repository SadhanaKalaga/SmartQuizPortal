const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');

exports.submitAttempt = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate score
    let score = 0;
    answers.forEach(answer => {
      const question = quiz.questions[answer.questionIndex];
      if (question && question.correctAnswer === answer.selectedOption) {
        score += question.points || 1;
      }
    });

    const attempt = await Attempt.create({
      studentId: req.user._id,
      quizId,
      answers,
      score,
      totalQuestions: quiz.questions.length
    });

    res.status(201).json({ attempt, score });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ studentId: req.user._id })
      .populate('quizId', 'title description')
      .sort('-completedAt');

    res.json({ attempts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttemptById = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
      .populate('quizId')
      .populate('studentId', 'name email');

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    // Students can only view their own attempts
    if (req.user.role === 'student' && attempt.studentId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Hide correct answers if faculty hasn't released them
    if (req.user.role === 'student' && !attempt.quizId.showAnswers) {
      const sanitizedAttempt = attempt.toObject();
      sanitizedAttempt.quizId.questions = sanitizedAttempt.quizId.questions.map(q => {
        const { correctAnswer, ...rest } = q;
        return rest;
      });
      return res.json({ attempt: sanitizedAttempt });
    }

    res.json({ attempt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuizAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ quizId: req.params.quizId })
      .populate('studentId', 'name email')
      .sort('-completedAt');

    res.json({ attempts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
