@echo off
echo ========================================
echo   Pushing to GitHub Repository
echo ========================================
echo.

cd /d "%~dp0"

echo Adding remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/JitendraSethia/Portfolio.git

echo.
echo Setting branch to main...
git branch -M main

echo.
echo Adding all files...
git add .

echo.
echo Creating commit...
git commit -m "Initial commit - Portfolio ready for deployment"

echo.
echo Pushing to GitHub...
git push -u origin main --force

echo.
echo ========================================
echo   Done! Check your GitHub repository
echo ========================================
echo.
pause
