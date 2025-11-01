# UB Scraper - Production Deployment Guide

This guide covers deploying the UB Scraper app with backend on Render and frontend on Netlify as a PWA.

## Architecture

- **Backend**: Express.js API with web scrapers (Render)
- **Frontend**: React + Vite PWA (Netlify)
- **Data Flow**: Scrapers → Express API → React UI
- **PWA Features**: Offline support, installable, service worker caching

## Prerequisites

1. GitHub repository with your code
2. [Render](https://render.com) account (backend hosting)
3. [Netlify](https://netlify.com) account (frontend hosting)

## Backend Deployment (Render)

### 1. Connect Repository
- Go to Render dashboard
- Click "New" → "Web Service"
- Connect your GitHub repository
- Select the root directory (not client/)

### 2. Configure Service
```yaml
# render.yaml is already configured with:
- Runtime: Node.js
- Build Command: npm ci
- Start Command: npm start
- Health Check: /health
- Auto Deploy: enabled
```

### 3. Environment Variables
Set these in Render dashboard:
```bash
NODE_ENV=production
PORT=10000  # Render assigns this automatically
```

### 4. Important Notes
- Render automatically installs Playwright browsers
- The `/health` endpoint is configured for health checks
- CORS is configured to accept requests from Netlify domains

## Frontend Deployment (Netlify)

### 1. Connect Repository
- Go to Netlify dashboard
- Click "Add new site" → "Import from Git"
- Connect your GitHub repository
- Select the `client/` directory as build folder

### 2. Build Settings
```bash
# netlify.toml is configured with:
Base directory: client
Build command: npm run build
Publish directory: client/dist
```

### 3. Environment Variables (Optional)
Set in Netlify dashboard if needed:
```bash
VITE_API_BASE_URL=https://your-render-app.onrender.com
```

### 4. Domain Configuration
- Update `netlify.toml` with your actual domain
- Update CORS in `src/server.ts` with your Netlify URL

## PWA Configuration

The app is configured as a Progressive Web App with:

### Features Enabled
- **Service Worker**: Caches API responses and static assets
- **Web App Manifest**: Makes app installable on mobile/desktop
- **Offline Support**: Cached data available when offline
- **App Shortcuts**: Quick access to rates, fees, and news

### Installation
Users can install the app:
- **Mobile**: "Add to Home Screen" banner
- **Desktop**: Install button in browser address bar
- **Chrome**: Three dots menu → "Install UB Scraper"

## Deployment Steps

### 1. Backend First (Render)
```bash
# Ensure your backend is working
npm run build  # Creates dist/ folder
npm start      # Tests production build

# Push to GitHub - Render auto-deploys
git add .
git commit -m "Add production config"
git push origin main
```

### 2. Frontend Second (Netlify)
```bash
# Update API URL in netlify.toml if needed
# Test build locally
cd client
npm run build
npm run preview  # Test production build

# Push to GitHub - Netlify auto-deploys
```

### 3. Update URLs
After deployment, update these files with actual URLs:
- `netlify.toml`: Replace `https://ub-scraper-api.onrender.com`
- `src/server.ts`: Add your actual Netlify domain to CORS

## Testing Production

### Backend Testing
```bash
# Test your Render API
curl https://your-app.onrender.com/health
curl https://your-app.onrender.com/scrape/hnb
```

### Frontend Testing
```bash
# Test your Netlify app
# Visit: https://your-app.netlify.app
# Check PWA: Install button should appear
# Test offline: Disable network, app should work with cached data
```

## Monitoring

### Backend (Render)
- Monitor logs in Render dashboard
- Health check endpoint: `/health`
- Check scraper performance and errors

### Frontend (Netlify)
- Monitor build logs in Netlify dashboard
- Check PWA installation rates
- Monitor Core Web Vitals

## Performance Optimizations

### Backend
- Scrapers cache results automatically
- News API has 10-minute cache
- Health check endpoint for uptime monitoring

### Frontend
- Code splitting for React, Charts, and Motion libraries
- Service worker caches API responses
- Optimized build with tree shaking

## Troubleshooting

### Common Issues

**Backend Won't Start**
```bash
# Check package.json scripts
npm run build  # Should create dist/
npm start      # Should start from dist/server.js
```

**CORS Errors**
```bash
# Update src/server.ts with correct Netlify domain
origin: ["https://your-actual-domain.netlify.app"]
```

**PWA Not Installing**
```bash
# Check manifest.json is served correctly
# Ensure HTTPS is working
# Check service worker registration in browser dev tools
```

**Build Failures**
```bash
# Client build issues
cd client && npm run build

# Check TypeScript errors
npm run build  # In root for backend
```

## Security Notes

- API endpoints are rate-limited by Render
- CORS is restricted to known domains
- No sensitive data is stored (scraping public websites)
- HTTPS enforced on both platforms
- Content Security Policy headers configured

## Support

For deployment issues:
1. Check Render/Netlify logs
2. Test locally with `npm run build && npm start`
3. Verify environment variables
4. Check CORS and API URL configurations