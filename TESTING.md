# SmartQuizPortal - Testing Guide

## ✅ Application Status

### Backend
- **Status**: Ready
- **URL**: http://localhost:5000
- **API Base**: http://localhost:5000/api

### Frontend
- **Status**: Ready
- **URL**: http://localhost:4200

### Database
- **MongoDB Atlas**: Configured
- **Action**: Ensure network access is configured in MongoDB Atlas

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm start
```

### 3. Seed Database (Optional)
```bash
cd backend
npm run seed
```

This creates test accounts:
- **Student**: email: `student@test.com`, password: `password123`
- **Faculty**: email: `faculty@test.com`, password: `password123`

## 🧪 Testing the Application

### Test User Registration
1. Navigate to http://localhost:4200
2. Click "Register"
3. Fill in:
   - Name: Your Name
   - Email: your@email.com
   - Password: minimum 6 characters
   - Role: Student or Faculty
4. Click "Register"

### Test Login
1. Use seeded credentials or your registered account
2. Enter email and password
3. Click "Login"
4. You'll be redirected based on your role

### Test Faculty Features
1. Login as faculty
2. Click "Create New Quiz"
3. Fill in:
   - Title: Quiz name
   - Description: Quiz description
   - Time Limit: Minutes
   - Add questions with 4 options each
   - Mark correct answer
4. Submit quiz

### Test Student Features
1. Login as student
2. View available quizzes
3. Click "Attempt Quiz"
4. Answer questions (timer counts down)
5. Submit quiz
6. View results with score

## 🔒 Security Features Implemented

✅ Password hashing with bcrypt
✅ JWT authentication
✅ Route guards (auth & role-based)
✅ Input validation on backend
✅ Protected API endpoints
✅ Automatic token refresh handling

## 📝 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (requires auth)

### Quizzes
- POST `/api/quizzes` - Create quiz (Faculty only)
- GET `/api/quizzes` - Get all active quizzes
- GET `/api/quizzes/:id` - Get quiz by ID
- GET `/api/quizzes/my-quizzes` - Get faculty's quizzes
- PUT `/api/quizzes/:id` - Update quiz (Faculty only)
- DELETE `/api/quizzes/:id` - Delete quiz (Faculty only)

### Attempts
- POST `/api/attempts` - Submit quiz attempt (Student only)
- GET `/api/attempts/my-attempts` - Get student's attempts
- GET `/api/attempts/:id` - Get attempt details
- GET `/api/attempts/quiz/:quizId` - Get all attempts for a quiz (Faculty only)

## 🎯 Features Completed

### Backend
✅ JWT Authentication with password hashing
✅ Role-based Authorization
✅ Input validation with express-validator
✅ Quiz CRUD Operations
✅ Automatic Quiz Scoring
✅ Attempt Tracking
✅ RESTful API Design

### Frontend
✅ Angular 19 Standalone Components
✅ Auth & Role Guards
✅ HTTP Interceptors (Auth + Error)
✅ Reactive Forms
✅ Student Dashboard
✅ Faculty Dashboard
✅ Quiz Creation
✅ Quiz Attempt with Timer
✅ Results Display
✅ Responsive Design

## 🔧 Troubleshooting

### MongoDB Connection Issues
1. Check MongoDB Atlas network access
2. Verify connection string in `.env`
3. Ensure cluster is active

### CORS Issues
- Backend has CORS enabled for all origins in development

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 4200
lsof -ti:4200 | xargs kill -9
```

---
**Project**: SmartQuizPortal
**Stack**: MongoDB, Express, Angular, Node.js
**Author**: K. Sadhana
**Updated**: April 12, 2026
