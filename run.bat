@echo off
title YKStore Starter
echo ===================================================
echo             Starting YKStore Application           
echo ===================================================
echo.
echo Starting Backend (Server) on http://localhost:5000 ...
start "YKStore Backend" cmd /k "cd /d "%~dp0server" && npm run dev"

echo Starting Frontend (Client) on http://localhost:5173 ...
start "YKStore Frontend" cmd /k "cd /d "%~dp0client" && npm run dev"

echo.
echo ===================================================
echo  Both Backend and Frontend terminals are launched! 
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:5000
echo ===================================================
echo.
pause
