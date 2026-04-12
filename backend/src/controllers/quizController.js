const { validationResult } = require('express-validator');
const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');

exports.createQuiz = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { title, description, questions, timeLimit, startTime, endTime, maxAttempts } = req.body;
    
    const quiz = await Quiz.create({
      title,
      description,
      questions,
      timeLimit,
      startTime,
      endTime,
      maxAttempts: maxAttempts || 1,
      facultyId: req.user._id
    });

    res.status(201).json({ quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const now = new Date();
    const quizzes = await Quiz.find({ 
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now }
    })
      .populate('facultyId', 'name email')
      .select('-questions.correctAnswer');

    res.json({ quizzes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('facultyId', 'name email');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const now = new Date();
    
    // Check if quiz is available
    if (req.user.role === 'student') {
      if (now < quiz.startTime) {
        return res.status(403).json({ message: 'Quiz has not started yet' });
      }
      if (now > quiz.endTime) {
        return res.status(403).json({ message: 'Quiz has ended' });
      }

      // Check attempt limit
      const attemptCount = await Attempt.countDocuments({
        studentId: req.user._id,
        quizId: quiz._id
      });

      if (attemptCount >= quiz.maxAttempts) {
        return res.status(403).json({ message: 'Maximum attempts reached' });
      }

      // Hide correct answers for students
      quiz.questions.forEach(q => q.correctAnswer = undefined);
    }

    res.json({ quiz, attemptsLeft: quiz.maxAttempts - (await Attempt.countDocuments({ studentId: req.user._id, quizId: quiz._id })) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.facultyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(quiz, req.body);
    await quiz.save();

    res.json({ quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.facultyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await quiz.deleteOne();
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ facultyId: req.user._id });
    res.json({ quizzes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleAnswers = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.facultyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    quiz.showAnswers = !quiz.showAnswers;
    await quiz.save();

    res.json({ quiz, message: `Answers ${quiz.showAnswers ? 'released' : 'hidden'}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
