@echo off
REM PingMe Quick Setup Script for Windows
REM Initializes the project with deployment configurations

echo.
echo 🚀 PingMe Setup Script
echo ====================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% found
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm install failed
    pause
    exit /b 1
)
echo.

REM Create env file if doesn't exist
if not exist .env.local (
    echo 📝 Creating .env.local...
    copy .env.example .env.local
)
echo.

REM Build check
echo 🔨 Testing build...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed. Check the errors above.
    pause
    exit /b 1
)
echo.

echo ✅ Setup complete!
echo.
echo 📖 Next steps:
echo 1. Update .env.local with your configuration
echo 2. Update package.json with your GitHub/repository info
echo 3. Set up GitHub Actions secrets (see .github/ACTIONS_SETUP.md)
echo 4. Choose a deployment platform (see DEPLOYMENT.md)
echo.
echo 🏃 Run 'npm run dev' to start development server
echo.
pause
