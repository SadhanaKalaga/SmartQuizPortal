# SmartQuizPortal — MERN Stack Online Quiz Platform

## 1. Introduction

### 1.1 Purpose
This document defines the technical design for SmartQuizPortal, an online quiz and assessment platform built using the MERN stack. Faculty can upload and manage quizzes, while students can attempt quizzes within a fixed time limit and view results instantly.

### 1.2 Target Audience
- Faculty / Instructors
- Students
- Developers learning full-stack development

### 1.3 Learning Outcomes
- MERN stack implementation
- Real-time quiz management
- Automatic evaluation system
- User authentication & authorization
- Performance tracking

## 2. System Overview

### 2.1 User Roles
| Role | Description |
|------|-------------|
| Student | Logs in, attempts quizzes, views results |
| Faculty | Creates quizzes, manages questions, views student performance |

### 2.2 Core Features
- User authentication system
- Quiz creation and management
- Timed quiz attempts
- Automatic evaluation
- Result tracking and history
- Performance analytics

## 3. High-Level Architecture
```
[ React Frontend ]
        |
   [ REST API ]
        |
[ Node.js + Express ]
        |
   [ MongoDB ]
```

## 4. Database Design

### 4.1 Database
- MongoDB
- ODM: Mongoose

### 4.2 Collections

#### 4.2.1 users
```javascript
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "role": "student | faculty",
  "profilePic": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### 4.2.2 quizzes
```javascript
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "facultyId": "ObjectId (ref users)",
  "questions": "Array",
  "timeLimit": "Number",
  "isActive": "Boolean",
  "createdAt": "Date"
}
```

#### 4.2.3 attempts
```javascript
{
  "_id": "ObjectId",
  "studentId": "ObjectId (ref users)",
  "quizId": "ObjectId (ref quizzes)",
  "answers": "Array",
  "score": "Number",
  "completedAt": "Date"
}
```

## 5. Backend Design (Node.js + Express)

### 5.1 Technology Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication

### 5.2 Backend Folder Structure
```
backend/
│── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   └── app.js
│── .env
│── package.json
```

### 5.3 Authentication Flow
1. User logs in with credentials
2. Backend validates user credentials
3. User record is fetched from database
4. JWT token is issued
5. Token used for subsequent requests

### 5.4 API Endpoints

#### Auth APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/login | User login |
| POST | /auth/register | User registration |
| GET | /auth/me | Get logged-in user |

#### Quiz APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /quizzes | Create quiz (Faculty) |
| GET | /quizzes | Get all quizzes |
| POST | /quizzes/:id/attempt | Submit quiz attempt |
| GET | /quizzes/:id/results | Get quiz results |

### 5.5 Role-Based Access Control
- Middleware validates user role
- Faculty-only routes protected
- Student access restrictions enforced

## 6. Frontend (React)

### 6.1 Tech Stack
- React
- React Router
- Axios
- Material-UI / Bootstrap

### 6.2 Folder Structure
```
src/
├── components/
├── pages/
├── context/
├── services/
└── App.jsx
```

### 6.3 Key Pages
- Login/Register
- Student Dashboard
- Faculty Dashboard
- Quiz Attempt Page
- Results Page

## 7. Quiz Management System

### 7.1 Current Scope
- Create and manage quizzes
- Timed quiz attempts
- Automatic scoring system
- Result tracking

### 7.2 Validation Rules
- Time limit enforcement
- Answer validation
- Attempt tracking

## 8. Security Considerations
- JWT-based authentication
- Role-based authorization
- Input validation
- Secure quiz attempt handling

## 9. Development Workflow

### 9.1 Recommended Practice
- Write clear comments before coding
- Use meaningful file and function names
- Component-based architecture
- RESTful API design
- Responsive design implementation

## 10. Future Enhancements
- Real-time quiz monitoring
- Advanced analytics dashboard
- Question bank management
- Multi-format question support
- Plagiarism detection

## 11. Conclusion
This project demonstrates a complete MERN stack implementation for educational assessment, providing hands-on experience with modern web development practices and real-time quiz management systems.

**Project Name:** SmartQuizPortal  
**Document Owner:** K. Sadhana
