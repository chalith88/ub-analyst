# PowerShell deployment setup script for Windows

Write-Host "🚀 UB Scraper - Production Deployment Setup" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Check if we're in the right directory
if (!(Test-Path "package.json") -or !(Test-Path "client")) {
    Write-Host "❌ Error: Run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow

# Install backend dependencies
Write-Host "Installing backend dependencies..."
npm install

# Install frontend dependencies  
Write-Host "Installing frontend dependencies..."
Set-Location client
npm install
Set-Location ..

Write-Host "🔧 Building for production..." -ForegroundColor Yellow

# Build backend
Write-Host "Building backend..."
npm run build

# Build frontend
Write-Host "Building frontend..."
Set-Location client
npm run build
Set-Location ..

Write-Host "🧪 Running production tests..." -ForegroundColor Yellow

# Test backend build
if (Test-Path "dist/server.js") {
    Write-Host "✅ Backend build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Backend build failed" -ForegroundColor Red
    exit 1
}

# Test frontend build
if (Test-Path "client/dist") {
    Write-Host "✅ Frontend build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Replace placeholder icons in client/public/ with actual 192x192 and 512x512 PNG icons"
Write-Host "2. Update CORS domains in src/server.ts with your actual Netlify URL"
Write-Host "3. Update API URL in netlify.toml with your actual Render URL"
Write-Host "4. Deploy backend to Render using render.yaml"
Write-Host "5. Deploy frontend to Netlify using netlify.toml"
Write-Host ""
Write-Host "See DEPLOYMENT.md for detailed deployment instructions" -ForegroundColor Cyan