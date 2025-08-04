@echo off
echo ========================================
echo    PayPass Auto Setup & Launch
echo ========================================
echo.
echo 🚀 Starting PayPass Backend...
echo 📡 Connecting to MongoDB...
echo 🌐 Opening browser...
echo.
echo Press Ctrl+C to stop
echo ========================================
echo.

REM Start the backend server
start /B npm run dev

REM Wait 5 seconds for server to start
timeout /t 5 /nobreak > nul

REM Open browser to backend
start http://localhost:5000

REM Open browser to frontend
start http://localhost:5174

REM Open MongoDB Atlas
start https://cloud.mongodb.com

echo.
echo ✅ Setup completed!
echo 📊 Backend: http://localhost:5000
echo 🎨 Frontend: http://localhost:5174
echo 🗄️ MongoDB Atlas: https://cloud.mongodb.com
echo.

pause 