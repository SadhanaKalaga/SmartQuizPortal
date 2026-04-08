# SmartQuizPortal - Testing Guide

## ✅ Application Status

### Backend
- **Status**: Running
- **URL**: http://localhost:5000
- **API Base**: http://localhost:5000/api

### Frontend
- **Status**: Running
- **URL**: http://localhost:4200

### Database
- **Status**: Connection issue (DNS resolution)
- **Note**: MongoDB Atlas cluster may need network access configuration
- **Action Required**: Check MongoDB Atlas network access settings

## 🧪 Testing the Application

### 1. Access the Application
Open your browser and navigate to: **http://localhost:4200**

### 2. Test User Registration
1. Click "Register" link
2. Fill in:
   - Name: Test Student
   - Email: student@test.com
   - Role: Student
3. Click "Register"

### 3. Test Faculty Registration
1. Register another user:
   - Name: Test Faculty
   - Email: faculty@test.com
   - Role: Faculty

### 4. Test Faculty Features
1. Login as faculty@test.com
2. Click "Create New Quiz"
3. Fill in quiz details:
   - Title: Sample Quiz
   - Description: Test quiz
   - Time Limit: 10 minutes
   - Add questions with 4 options each
4. Submit the quiz

### 5. Test Student Features
1. Logout and login as student@test.com
2. View available quizzes
3. Click "Attempt Quiz"
4. Answer questions (timer will count down)
5. Submit quiz
6. View results with correct answers

## 🔧 MongoDB Connection Issue

The application is running but MongoDB connection failed with DNS error.

### To Fix:
1. **Check MongoDB Atlas**:
   - Go to https://cloud.mongodb.com
   - Navigate to Network Access
   - Add your IP address or allow access from anywhere (0.0.0.0/0)

2. **Verify Connection String**:
   - Current: `mongodb+srv://ksaana2006_db_user:***REMOVED***@smartquizportal.dvbshe9.mongodb.net/smartquizportal`
   - Ensure cluster is active and accessible

3. **Alternative - Use Local MongoDB**:
   ```bash
   # Install MongoDB locally
   sudo apt install mongodb
   
   # Update .env
   MONGODB_URI=mongodb://localhost:27017/smartquizportal
   ```

## 📝 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

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

## 🎯 Features Implemented

### Backend
✅ JWT Authentication
✅ Role-based Authorization (Student/Faculty)
✅ Quiz CRUD Operations
✅ Automatic Quiz Scoring
✅ Attempt Tracking
✅ RESTful API Design

### Frontend
✅ Angular 19 with Standalone Components
✅ Reactive Forms
✅ HTTP Interceptor for Auth
✅ Role-based Routing
✅ Student Dashboard
✅ Faculty Dashboard
✅ Quiz Creation Form
✅ Quiz Attempt with Timer
✅ Results Display
✅ Responsive Design

## 🚀 Next Steps

1. **Fix MongoDB Connection**: Configure network access in MongoDB Atlas
2. **Test All Features**: Once DB is connected, test complete flow
3. **Add Seed Data**: Run `npm run seed` in backend to populate test data
4. **Deploy**: Consider deploying to cloud platforms

## 📊 Project Statistics

- **Total Commits**: 25
- **Backend Files**: 11
- **Frontend Components**: 7
- **Services**: 3
- **Routes**: 3 route files
- **Lines of Code**: ~2000+

## 🎓 Learning Outcomes Achieved

✅ MEAN Stack Implementation
✅ RESTful API Design
✅ JWT Authentication
✅ Role-based Authorization
✅ Angular Standalone Components
✅ Reactive Programming with RxJS
✅ MongoDB Schema Design
✅ Git Version Control

---
**Project**: SmartQuizPortal
**Stack**: MongoDB, Express, Angular, Node.js
**Author**: K. Sadhana
**Date**: April 8, 2026
