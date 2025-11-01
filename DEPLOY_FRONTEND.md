# Deploy Frontend to Netlify

## 🚀 **Step 1: Manual Deploy via Netlify Web Interface**

Since this is the first deployment, we'll use the Netlify web interface for the cleanest setup:

### 1. **Go to Netlify**
   - Visit: https://app.netlify.com/
   - Sign in with your GitHub account (chalith88@gmail.com)

### 2. **Import from Git**
   - Click "Import from Git" 
   - Choose "GitHub"
   - Select repository: **chalith88/ub-analyst**

### 3. **Configure Build Settings**
   ```
   Base directory: client
   Build command: npm run build  
   Publish directory: client/dist
   ```

### 4. **Deploy Site**
   - Click "Deploy site"
   - Netlify will automatically:
     - Clone your repo
     - Install dependencies in /client
     - Run npm run build
     - Deploy to a .netlify.app URL

### 5. **Custom Domain (Optional)**
   - Once deployed, you can change the site name to "ub-analyst"
   - This will give you: https://ub-analyst.netlify.app

## ✅ **What's Already Configured**

- ✅ **netlify.toml** - Build and redirect configuration
- ✅ **API redirects** - `/api/*` → Render backend  
- ✅ **PWA manifest** - Service worker ready
- ✅ **CORS setup** - Backend accepts Netlify domains

## 🔧 **After Deployment**

1. **Test the API connection**: Visit your-site.netlify.app and try scraping
2. **Verify PWA**: Install as app on mobile/desktop
3. **Check service worker**: Works offline after first visit

## 🌐 **Expected URLs**

- **Frontend**: https://ub-analyst.netlify.app  
- **Backend**: https://ub-analyst-api.onrender.com
- **API Proxy**: https://ub-analyst.netlify.app/api/scrape/hnb

The deployment should work seamlessly with the configuration we've set up!