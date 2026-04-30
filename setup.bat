@echo off
echo 🚀 PingMe Setup Script
echo ======================

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo ❌ Node.js is required. Install Node.js 18 or higher.
  pause
  exit /b 1
)

for /f "delims=" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ %NODE_VERSION% found

echo 📦 Installing dependencies...
npm install

necho 📝 Creating .env.local from .env.example if needed...
if not exist .env.local (
  copy .env.example .env.local
  echo Created .env.local
)

necho 🔨 Building production bundle...
npm run build

necho ✅ Setup complete!
echo Next steps:
echo   1. Update .env.local with your local settings
echo   2. Update package.json repository and homepage values
echo   3. Add GitHub Actions secrets if using CI/CD
echo   4. Push to GitHub and deploy
pause
