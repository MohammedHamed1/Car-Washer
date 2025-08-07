@echo off
echo ========================================
echo    PayPass Quick Start
echo ========================================
echo.
echo 🔧 Checking MongoDB connection...
echo 🚀 Starting backend server...
echo 🌐 Opening applications...
echo.
echo ========================================
echo.

REM Test MongoDB connection
echo Testing MongoDB connection...
npm run test-db

REM Start backend server
echo Starting backend server...
start /B npm run dev

REM Wait for server to start
timeout /t 3 /nobreak > nul

REM Open applications
echo Opening applications...
start http://localhost:5000
start http://localhost:5175
start https://cloud.mongodb.com

echo.
echo ✅ All applications opened!
echo 📊 Backend: http://localhost:5000
echo 🎨 Frontend: http://localhost:5175
echo 🗄️ MongoDB Atlas: https://cloud.mongodb.com
echo.

pause 