@echo off
title YKStore Dependencies Installer
echo ===================================================
echo        Installing YKStore NPM Dependencies        
echo ===================================================
echo.
echo Installing backend dependencies...
cd /d "%~dp0server"
call npm install

echo.
echo Installing frontend dependencies...
cd /d "%~dp0client"
call npm install

echo.
echo ===================================================
echo  All dependencies installed successfully!          
echo ===================================================
echo.
pause
