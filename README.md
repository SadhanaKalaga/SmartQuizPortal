# SmartQuizPortal — MEAN Stack Online Quiz Platform
## Technical Documentation

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** April 22, 2026

---

## 📋 Table of Contents
1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [High-Level Architecture](#3-high-level-architecture)
4. [Database Design (DB-First Approach)](#4-database-design-db-first-approach)
5. [Backend Design (Node.js + Express)](#5-backend-design-nodejs--express)
6. [Frontend – MEAN (Angular)](#6-frontend--mean-angular)
7. [Quiz Attempt Flow](#7-quiz-attempt-flow)
8. [Answer Visibility Control](#8-answer-visibility-control)
9. [Security Considerations](#9-security-considerations)
10. [Development Workflow](#10-development-workflow)
11. [Future Enhancements](#11-future-enhancements)
12. [Conclusion](#12-conclusion)
13. [Quick Start Guide](#13-quick-start-guide)

---

## 1. Introduction

### 1.1 Purpose
This document defines the end-to-end technical design and development guidelines for SmartQuizPortal, an online quiz and assessment platform. The platform enables faculty to create and manage quizzes with full control over answer visibility, while students can attempt quizzes within time limits and view results instantly.

The platform is built using the **MEAN stack** (MongoDB, Express, Angular 19, Node.js) and demonstrates production-ready full-stack architecture.

### 1.2 Target Audience
- Educational Institutions
- Faculty / Instructors
- Students
- Developers learning full-stack development

### 1.3 Learning Outcomes
- JWT-based authentication with bcrypt password hashing
- Role-based access control (RBAC)
- REST API design
- MongoDB schema design with Mongoose ODM
- Angular 19 standalone components architecture
- Time-bound quiz scheduling and attempt tracking
- Real-time countdown timer implementation

---

## 2. System Overview

### 2.1 User Roles

| Role | Description |
|------|-------------|
| **Student** | Attempts quizzes, views results, tracks attempt history |
| **Faculty** | Creates/manages quizzes, controls answer visibility, views student performance |

### 2.2 Core Features

**Student Features:**
- View available quizzes
- Attempt quizzes with countdown timer
- Auto-submission on timeout
- View immediate scores
- See correct answers (when released by faculty)
- Track attempt history
- Max attempts enforcement

**Faculty Features:**
- Create quizzes with multiple-choice questions
- Edit and delete own quizzes
- Toggle answer visibility (release/hide correct answers)
- View student attempt statistics
- Time-bound quiz scheduling (start/end dates)
- Configure max attempts per student
- Resource isolation (cannot access other faculty's quizzes)

---

## 3. High-Level Architecture

```
┌─────────────────────┐
│  Angular Frontend   │
│   (Port: 4200)      │
└──────────┬──────────┘
           │ HTTP/REST
           ▼
┌─────────────────────┐
│   Express Server    │
│   (Port: 5000)      │
│  ┌───────────────┐  │
│  │ JWT Auth      │  │
│  │ Middleware    │  │
│  └───────────────┘  │
└──────────┬──────────┘
           │ Mongoose ODM
           ▼
┌─────────────────────┐
│  MongoDB Atlas      │
│  (Cloud Database)   │
└─────────────────────┘
```

**Key Principle:** Single-page application with JWT authentication and role-based routing

---

## 4. Database Design (DB-First Approach)

### 4.1 Technology
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Collections:** users, quizzes, attempts

### 4.2 Schema Definitions

#### users Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcrypt),
  role: String (enum: ['student', 'faculty']),
  profilePic: String (default: ''),
  createdAt: Date,
  updatedAt: Date
}
```

#### quizzes Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  facultyId: ObjectId (ref: 'User'),
  questions: [{
    question: String (required),
    options: [String] (4 options required),
    correctAnswer: Number (0-3),
    points: Number (default: 1)
  }],
  timeLimit: Number (minutes, min: 1),
  startTime: Date (required),
  endTime: Date (required),
  maxAttempts: Number (default: 1, min: 1),
  showAnswers: Boolean (default: false),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

#### attempts Collection
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: 'User'),
  quizId: ObjectId (ref: 'Quiz'),
  answers: [{
    questionIndex: Number,
    selectedOption: Number
  }],
  score: Number,
  totalQuestions: Number,
  completedAt: Date
}
```

---

## 5. Backend Design (Node.js + Express)

### 5.1 Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt (10 salt rounds)
- **Validation:** express-validator
- **Environment:** dotenv

### 5.2 Folder Structure
```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js      # Login, register, getMe
│   │   ├── quizController.js      # CRUD, toggleAnswers
│   │   └── attemptController.js   # Submit, view attempts
│   ├── models/
│   │   ├── User.js                # User schema with password hashing
│   │   ├── Quiz.js                # Quiz schema
│   │   └── Attempt.js             # Attempt schema
│   ├── routes/
│   │   ├── auth.js                # Auth routes
│   │   ├── quizzes.js             # Quiz routes
│   │   └── attempts.js            # Attempt routes
│   ├── middleware/
│   │   └── auth.js                # authenticate, authorize
│   ├── utils/
│   │   └── Connect.js             # MongoDB connection
│   ├── app.js                     # Express app setup
│   └── seed.js                    # Database seeding
├── .env                           # Environment variables
└── package.json
```

### 5.3 API Endpoints

#### Authentication APIs
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/api/auth/register` | Register new user | No | - |
| POST | `/api/auth/login` | Login user | No | - |
| GET | `/api/auth/me` | Get current user | Yes | All |

#### Quiz APIs
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/api/quizzes` | Create quiz | Yes | Faculty |
| GET | `/api/quizzes` | Get active quizzes | Yes | All |
| GET | `/api/quizzes/my-quizzes` | Get faculty's quizzes | Yes | Faculty |
| GET | `/api/quizzes/:id` | Get quiz by ID | Yes | All |
| PUT | `/api/quizzes/:id` | Update quiz | Yes | Faculty (owner) |
| PATCH | `/api/quizzes/:id/toggle-answers` | Toggle answer visibility | Yes | Faculty (owner) |
| DELETE | `/api/quizzes/:id` | Delete quiz | Yes | Faculty (owner) |

#### Attempt APIs
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/api/attempts` | Submit attempt | Yes | Student |
| GET | `/api/attempts/my-attempts` | Get student's attempts | Yes | Student |
| GET | `/api/attempts/:id` | Get attempt details | Yes | Owner/Faculty |
| GET | `/api/attempts/quiz/:quizId` | Get quiz attempts | Yes | Faculty |

### 5.4 Security Implementation

#### Password Hashing
```javascript
// Pre-save hook in User model
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

#### JWT Authentication
```javascript
// Token generation (7-day expiry)
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
  expiresIn: '7d' 
});
```

#### Authorization Middleware
```javascript
// Role-based access control
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
```

---

## 6. Frontend – MEAN (Angular)

### 6.1 Technology Stack
- **Framework:** Angular 19
- **Architecture:** Standalone Components
- **Routing:** Angular Router
- **HTTP:** HttpClient
- **State Management:** RxJS
- **Forms:** FormsModule

### 6.2 Folder Structure
```
frontend/src/app/
├── components/
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── student-dashboard/        # Student dashboard
│   ├── faculty-dashboard/        # Faculty dashboard
│   ├── quiz-create/              # Create/edit quiz
│   ├── quiz-attempt/             # Take quiz
│   └── results/                  # View results
├── services/
│   ├── auth.ts                   # Authentication service
│   ├── quiz.ts                   # Quiz service
│   └── attempt.ts                # Attempt service
├── guards/
│   └── auth.guard.ts             # Auth & role guards
├── interceptors/
│   ├── auth.interceptor.ts       # Add JWT to requests
│   └── error.interceptor.ts      # Handle errors
├── app.routes.ts                 # Route configuration
└── app.config.ts                 # App configuration
```

### 6.3 Route Guards
```typescript
// Auth guard - requires authentication
{ path: 'student-dashboard', component: StudentDashboardComponent,
  canActivate: [authGuard, roleGuard(['student'])] }

// Role guard - requires specific role
{ path: 'faculty-dashboard', component: FacultyDashboardComponent,
  canActivate: [authGuard, roleGuard(['faculty'])] }
```

---

## 7. Quiz Attempt Flow

### 7.1 Student Workflow
1. Student views available quizzes
2. Clicks "Attempt Quiz"
3. System checks:
   - Quiz is active
   - Current time is within start/end time
   - Student hasn't exceeded max attempts
4. Quiz loads with countdown timer
5. Student selects answers
6. On submit or timeout:
   - Answers sent to backend
   - Score calculated
   - Attempt saved to database
7. Results displayed immediately
8. Correct answers shown only if `showAnswers` is true

### 7.2 Validation Rules
- Quiz must be active (`isActive: true`)
- Current time must be between `startTime` and `endTime`
- Student's attempt count must be less than `maxAttempts`
- All questions must have 4 options
- Correct answer must be between 0-3

---

## 8. Answer Visibility Control

### 8.1 Current Scope
- Faculty can toggle `showAnswers` flag for each quiz
- When `showAnswers` is false:
  - Students see only their score
  - Correct answers are hidden
- When `showAnswers` is true:
  - Students see their score
  - Correct answers are displayed
  - Student's selected answers are highlighted

### 8.2 Implementation
- Backend filters out `correctAnswer` field when `showAnswers` is false
- Frontend conditionally renders answer comparison UI
- Toggle button available only to quiz owner

---

## 9. Security Considerations

**Implemented Security Measures:**
- ✅ **Password Hashing:** bcrypt with 10 salt rounds
- ✅ **JWT Authentication:** 7-day token expiry
- ✅ **Role-Based Access Control:** Faculty/Student separation
- ✅ **Input Validation:** express-validator on all inputs
- ✅ **Authorization Checks:** Users can only access their own resources
- ✅ **Answer Protection:** Correct answers hidden until released
- ✅ **CORS Configuration:** Controlled cross-origin requests
- ✅ **HTTP-Only Considerations:** Token stored in localStorage (can be upgraded to httpOnly cookies)

**Resource Isolation:**
- Faculty can only view/edit/delete their own quizzes
- Students can only view their own attempts
- Correct answers hidden from students until faculty releases them
- Attempt counts tracked per student per quiz

---

## 10. Development Workflow

### 10.1 Recommended Practice
- Write clear comments before coding
- Use meaningful file and function names
- Follow RESTful API conventions
- Implement error handling at all layers
- Use TypeScript for type safety
- Test authentication flow thoroughly
- Validate all user inputs

### 10.2 Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: descriptive commit message"

# Push and create pull request
git push origin feature/your-feature-name
```

### 10.3 Commit Message Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build/config changes

---

## 11. Future Enhancements

### Priority: High
- [ ] Email verification on registration
- [ ] Password reset functionality
- [ ] Export results to CSV/PDF
- [ ] Quiz categories and tags

### Priority: Medium
- [ ] Real-time quiz monitoring with WebSockets
- [ ] Advanced analytics dashboard
- [ ] Question bank management
- [ ] Image support in questions
- [ ] Bulk quiz import/export

### Priority: Low
- [ ] Multi-format questions (true/false, fill-in-blank)
- [ ] Plagiarism detection
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Gamification (badges, leaderboards)

---

## 12. Conclusion

SmartQuizPortal demonstrates production-ready full-stack architecture using the MEAN stack. The platform implements secure authentication, role-based access control, time-bound quiz scheduling, and answer visibility management. The modular architecture allows for easy maintenance and future enhancements.

**Project Name:** SmartQuizPortal  
**Version:** 1.0.0  
**Status:** Production Ready ✅  
**Document Owner:** K. Sadhana  
**Last Updated:** April 22, 2026

---

## 13. Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- npm or yarn

### Installation
```bash
# Clone repository
git clone <repository-url>
cd SmartQuizPortal

# Run application
./start.sh
```

### Test Credentials
- **Student:** student@test.com / password123
- **Faculty:** faculty@test.com / password123

### Access Points
- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:5000/api


