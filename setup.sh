#!/usr/bin/env bash
set -e

echo "🚀 PingMe Setup Script"
echo "======================"

if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js is required. Install Node.js 18 or higher."
  exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION found"

echo "📦 Installing dependencies..."
npm install

echo "📝 Creating .env.local from .env.example if needed..."
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "Created .env.local"
fi

echo "🔨 Building production bundle..."
npm run build

echo "✅ Setup complete!"
echo "Next steps:"
echo "  1. Update .env.local with your local settings"
echo "  2. Update package.json repository and homepage values"
echo "  3. Add GitHub Actions secrets if using CI/CD"
echo "  4. Push to GitHub and deploy"
