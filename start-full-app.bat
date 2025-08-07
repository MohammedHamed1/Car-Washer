@echo off
echo ========================================
echo    PayPass Full App Launcher
echo ========================================
echo.
echo 🚀 Starting Backend...
echo 🎨 Connecting Frontend...
echo 🌐 Opening Applications...
echo.
echo ========================================
echo.

REM Start backend server
echo Starting backend server...
start /B npm run dev

REM Wait for backend to start
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

REM Test connections
echo Testing connections...
npm run connect-frontend

REM Open applications
echo Opening applications...
start http://localhost:5000
start http://localhost:5175

echo.
echo ✅ Full app launched!
echo 📊 Backend: http://localhost:5000
echo 🎨 Frontend: http://localhost:5175
echo 🔗 API Test: http://localhost:5000/api/test
echo.

pause 