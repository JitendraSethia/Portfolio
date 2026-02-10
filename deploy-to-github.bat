@echo off
echo ========================================
echo   Portfolio Deployment Helper
echo ========================================
echo.

echo Step 1: Initializing Git repository...
git init
echo.

echo Step 2: Adding all files...
git add .
echo.

echo Step 3: Creating initial commit...
git commit -m "Initial commit - Portfolio ready for deployment"
echo.

echo Step 4: Setting main branch...
git branch -M main
echo.

echo ========================================
echo   IMPORTANT: Next Steps
echo ========================================
echo.
echo 1. Create a new repository on GitHub:
echo    - Go to https://github.com/new
echo    - Name it: portfolio
echo    - Make it PUBLIC
echo    - Do NOT initialize with README
echo.
echo 2. Copy the repository URL (looks like):
echo    https://github.com/YOUR_USERNAME/portfolio.git
echo.
echo 3. Run these commands (replace YOUR_USERNAME):
echo    git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
echo    git push -u origin main
echo.
echo 4. Then deploy to Vercel:
echo    - Go to https://vercel.com
echo    - Sign in with GitHub
echo    - Click "Add New Project"
echo    - Select your portfolio repository
echo    - Click "Deploy"
echo.
echo ========================================
echo   Your portfolio will be live in 2 minutes!
echo ========================================
echo.
pause
