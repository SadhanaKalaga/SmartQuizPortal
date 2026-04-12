#!/bin/bash

echo "🚀 Starting SmartQuizPortal..."
echo ""

# Start backend
echo "📦 Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend (disable CLI prompts)
echo "🎨 Starting Frontend Server..."
cd ../frontend
CI=true npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Application started!"
echo "📍 Frontend: http://localhost:4200"
echo "📍 Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
