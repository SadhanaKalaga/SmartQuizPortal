const mongoose = require('mongoose');
const User = require('./models/User');
const Quiz = require('./models/Quiz');
const Attempt = require('./models/Attempt');
const connectDB = require('./utils/Connect');

// Sample data
const sampleUsers = [
  {
    name: "John Doe",
    email: "student@test.com",
    password: "password123",
    role: "student"
  },
  {
    name: "Jane Smith", 
    email: "faculty@test.com",
    password: "password123",
    role: "faculty"
  }
];

const sampleQuizzes = [
  {
    title: "JavaScript Basics",
    description: "Test your knowledge of JavaScript fundamentals",
    questions: [
      {
        question: "What is the correct way to declare a variable in JavaScript?",
        options: ["var x = 5;", "variable x = 5;", "v x = 5;", "declare x = 5;"],
        correctAnswer: 0,
        points: 1
      },
      {
        question: "Which method is used to add an element to the end of an array?",
        options: ["push()", "add()", "append()", "insert()"],
        correctAnswer: 0,
        points: 1
      }
    ],
    timeLimit: 30,
    startTime: new Date(),
    endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    maxAttempts: 3,
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Quiz.deleteMany({});
    await Attempt.deleteMany({});
    
    // Insert sample users
    const users = await User.insertMany(sampleUsers);
    console.log('Sample users created');
    console.log('Login credentials:');
    console.log('Student - email: student@test.com, password: password123');
    console.log('Faculty - email: faculty@test.com, password: password123');
    
    // Insert sample quizzes with faculty reference
    const faculty = users.find(user => user.role === 'faculty');
    const quizzesToInsert = sampleQuizzes.map(quiz => ({
      ...quiz,
      facultyId: faculty._id
    }));
    
    await Quiz.insertMany(quizzesToInsert);
    console.log('Sample quizzes created');
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
