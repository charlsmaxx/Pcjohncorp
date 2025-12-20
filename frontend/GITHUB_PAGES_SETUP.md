# GitHub Pages Setup - Get Your Website Live

This guide will help you enable GitHub Pages to get a free public URL for your website.

## 🚀 Quick Setup

### Step 1: Enable GitHub Pages

1. Go to your repository: https://github.com/charlsmaxx/Pcjohncorp
2. Click on **Settings** (top right of the repository page)
3. Scroll down to **Pages** in the left sidebar (under "Code and automation")
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)` or `/docs` (if you want it in a docs folder)
5. Click **Save**

### Step 2: Wait for Deployment

- GitHub will build and deploy your site (usually takes 1-2 minutes)
- You'll see a message: "Your site is live at [URL]"

### Step 3: Your Website URL

Your website will be available at:
```
https://charlsmaxx.github.io/Pcjohncorp/
```

**Note**: It may take a few minutes for the site to become accessible after enabling.

## 🔧 Important Notes

### Backend API Configuration

Since your backend runs separately, you'll need to update the API URL in `frontend/script.js`:

1. Deploy your backend to a hosting service (Railway, Render, etc.)
2. Get your backend URL (e.g., `https://your-backend.railway.app`)
3. Update `frontend/script.js` line 46:

```javascript
const API_BASE_URL = 'https://your-backend.railway.app';
```

4. Commit and push the change:
```powershell
cd frontend
git add script.js
git commit -m "Update API URL for production"
git push
```

GitHub Pages will automatically redeploy with the new API URL.

### Custom Domain (Optional)

You can also use a custom domain:

1. In GitHub Pages settings, add your custom domain
2. Update your DNS settings to point to GitHub Pages
3. GitHub will provide specific DNS records needed

## 🔄 Updating Your Website

Every time you push changes to the `main` branch:
1. GitHub Pages automatically rebuilds and deploys
2. Changes go live in 1-2 minutes
3. No manual deployment needed!

## 📝 Current Status

- **Repository**: https://github.com/charlsmaxx/Pcjohncorp
- **Expected URL**: https://charlsmaxx.github.io/Pcjohncorp/
- **Status**: Enable GitHub Pages in Settings → Pages

## ⚠️ Important for Contact Form

**The contact form will NOT work on GitHub Pages until:**
1. Your backend is deployed
2. The API URL in `script.js` is updated to point to your deployed backend
3. Backend CORS is configured to allow requests from `https://charlsmaxx.github.io`

For testing, you can still use the site locally with your backend running on `localhost:3000`.




