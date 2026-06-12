@echo off
echo ===================================================
echo   Starting Trinity Chords Worship Platform Server  
echo   Website will open automatically at http://localhost:3000
echo ===================================================
echo.

:: Launch background timer to open browser once server starts
start /b cmd /c "timeout /t 4 /nobreak > nul && start http://localhost:3000"

:: Start the Next.js dev server
npm run dev
