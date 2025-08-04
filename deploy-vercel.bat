@echo off
echo ========================================
echo    PayPass Vercel Deployment
echo ========================================
echo.
echo 🚀 Deploying to Vercel...
echo 🔑 Using Access Token: gXI4wkLyvcviaHEVcQuMCjGl
echo 🌐 Domains: https-paypasss-com-six.vercel.app
echo.
echo ========================================
echo.

REM Set Vercel token
set VERCEL_TOKEN=gXI4wkLyvcviaHEVcQuMCjGl

REM Install Vercel CLI if not installed
echo Installing Vercel CLI...
npm install -g vercel

REM Login to Vercel
echo Logging in to Vercel...
vercel login --token %VERCEL_TOKEN%

REM Deploy to Vercel
echo Deploying to Vercel...
vercel --prod --token %VERCEL_TOKEN%

echo.
echo ✅ Deployment completed!
echo 🌐 Your app is live at:
echo    - https://https-paypasss-com-six.vercel.app
echo    - https://https-paypasss-com-git-main-mohamedhameds-projects-3a45d347.vercel.app
echo    - https://https-paypasss-c7lupjul6-mohamedhameds-projects-3a45d347.vercel.app
echo.

pause 