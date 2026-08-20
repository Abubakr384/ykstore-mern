@echo off
title YKStore Seeder
echo ===================================================
echo            Seeding YKStore Database               
echo ===================================================
echo.
echo Seeding categories, products, and default accounts...
cd /d "%~dp0server"
npm run seed
echo.
pause
