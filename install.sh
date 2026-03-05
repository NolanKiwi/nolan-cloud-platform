#!/bin/bash
# install.sh
set -e

echo "🚀 Welcome to Nolan Cloud Platform (NCP) Installer"

echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker."
    exit 1
fi

echo "📦 Installing server dependencies..."
cd server
npm install

echo "🗄️ Preparing Database..."
npx prisma migrate dev --name init

echo "✅ Setup complete!"
echo "To start the server, run:"
echo "  cd nolan-cloud-platform/server && npm run dev"
