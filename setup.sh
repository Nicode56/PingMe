#!/bin/bash
# PingMe Quick Setup Script
# Initializes the project with deployment configurations

echo "🚀 PingMe Setup Script"
echo "===================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create env file if doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local..."
    cp .env.example .env.local
fi

# Build check
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "📖 Next steps:"
    echo "1. Update .env.local with your configuration"
    echo "2. Update package.json with your GitHub/repository info"
    echo "3. Set up GitHub Actions secrets (see .github/ACTIONS_SETUP.md)"
    echo "4. Choose a deployment platform (see DEPLOYMENT.md)"
    echo ""
    echo "🏃 Run 'npm run dev' to start development server"
else
    echo "❌ Build failed. Check the errors above."
    exit 1
fi
