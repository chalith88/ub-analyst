# 🚀 Ready to Deploy!

Your UB Scraper app is configured and builds successfully. Here's your step-by-step deployment guide:

## ✅ Current Status
- Backend: Ready (uses `ts-node` for production)
- Frontend: Built successfully (dist/ created)
- PWA: Configured with service worker and manifest

## 🎯 Deployment Steps

### 1. Deploy Backend to Render (5 minutes)

1. **Create Render Account**: Go to [render.com](https://render.com)
2. **Connect GitHub**: Click "New" → "Web Service" → Connect your GitHub repo
3. **Configure Service**:
   - **Name**: `ub-scraper-api`
   - **Environment**: `Node`
   - **Build Command**: `npm ci && npm run playwright-install`
   - **Start Command**: `npm start`
   - **Auto Deploy**: ✅ Yes
4. **Environment Variables**: None needed (defaults work)
5. **Deploy**: Click "Deploy Web Service"

**Result**: Your API will be at `https://ub-scraper-api.onrender.com`

### 2. Deploy Frontend to Netlify (3 minutes)

1. **Create Netlify Account**: Go to [netlify.com](https://netlify.com)
2. **Connect GitHub**: "Add new site" → "Import from Git" → Select your repo
3. **Configure Build**:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
4. **Deploy**: Click "Deploy site"

**Result**: Your app will be at `https://[random-name].netlify.app`

### 3. Update URLs (2 minutes)

After both deployments, update these files with your actual URLs:

**File 1: `netlify.toml`**
```toml
# Replace this line:
to = "https://ub-scraper-api.onrender.com/scrape/:splat"
# With your actual Render URL:
to = "https://your-actual-render-url.onrender.com/scrape/:splat"
```

**File 2: `src/server.ts`**
```typescript
// Add your actual Netlify URL to CORS:
origin: [
  "http://localhost:5173", 
  "https://your-actual-netlify-site.netlify.app",  // <-- Add this line
  /^https:\/\/.*\.netlify\.app$/,
]
```

Push changes to GitHub → Both sites auto-redeploy

## 🧪 Testing Your Deployment

### Backend Test
```bash
curl https://your-render-url.onrender.com/health
curl https://your-render-url.onrender.com/scrape/hnb
```

### Frontend Test
- Visit your Netlify URL
- Test PWA: Look for "Install app" button in browser
- Test offline: Disable network, app should work with cached data

## 📱 PWA Features Working

Once deployed, users can:
- **Install the app** from browser (Chrome, Edge, Safari)
- **Use offline** with cached bank data
- **Quick shortcuts** to rates, fees, and news sections
- **Native app experience** on mobile and desktop

## 🎉 What You Get

- **Backend**: Scalable API with all 13+ bank scrapers
- **Frontend**: Fast React PWA with offline support
- **Auto-deploy**: GitHub pushes trigger deployments
- **Free hosting**: Render + Netlify starter plans included
- **HTTPS**: SSL certificates automatic
- **CDN**: Global content delivery for speed

## 🆘 Need Help?

If you encounter issues:
1. Check deployment logs in Render/Netlify dashboards
2. Verify environment variables are set correctly
3. Test locally first: `npm start` (backend) and `npm run build` (frontend)
4. Check CORS settings if you get API errors

**Estimated Total Time**: 10-15 minutes to full deployment!

Ready to deploy? Start with step 1 above! 🚀