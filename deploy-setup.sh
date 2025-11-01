#!/bin/bash
# Quick deployment setup script

echo "🚀 UB Scraper - Production Deployment Setup"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "client" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd client
npm install
cd ..

echo "🔧 Building for production..."

# Build backend
echo "Building backend..."
npm run build

# Build frontend
echo "Building frontend..."
cd client
npm run build
cd ..

echo "🧪 Running production tests..."

# Test backend build
if [ -f "dist/server.js" ]; then
    echo "✅ Backend build successful"
else
    echo "❌ Backend build failed"
    exit 1
fi

# Test frontend build
if [ -d "client/dist" ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

echo ""
echo "✨ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Replace placeholder icons in client/public/ with actual 192x192 and 512x512 PNG icons"
echo "2. Update CORS domains in src/server.ts with your actual Netlify URL"
echo "3. Update API URL in netlify.toml with your actual Render URL"
echo "4. Deploy backend to Render using render.yaml"
echo "5. Deploy frontend to Netlify using netlify.toml"
echo ""
echo "📖 See DEPLOYMENT.md for detailed deployment instructions"