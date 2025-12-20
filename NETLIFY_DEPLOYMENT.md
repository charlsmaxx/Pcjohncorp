# 🌐 Netlify Frontend Deployment Guide

## Step 1: Prepare Your Repository

✅ Your code is already on GitHub at: `https://github.com/charlsmaxx/Pcjohncorp`

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard (Recommended)

1. **Sign up/Login to Netlify**
   - Go to: https://app.netlify.com
   - Sign up with GitHub (easiest method)

2. **Add New Site**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub
   - Select repository: `Pcjohncorp`

3. **Configure Build Settings**
   - **Base directory:** Leave empty (or set to `frontend` if you want to deploy only frontend folder)
   - **Build command:** Leave empty (static site, no build needed)
   - **Publish directory:** `frontend` (or `.` if deploying from root)
   
   **OR if deploying from root:**
   - **Base directory:** `.` (root)
   - **Build command:** Leave empty
   - **Publish directory:** `.` (root)

4. **Deploy!**
   - Click "Deploy site"
   - Netlify will deploy your site
   - You'll get a URL like: `https://random-name-123.netlify.app`

5. **Custom Domain (Optional)**
   - Go to Site settings → Domain management
   - Add your custom domain (e.g., `pcjohncorp.com`)
   - Follow DNS configuration instructions

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd frontend  # or root directory
netlify deploy --prod
```

## Step 3: Update Domain References

After deployment, update these files with your Netlify URL:

1. **frontend/index.html** - Update meta tags and structured data
2. **frontend/sitemap.xml** - Update all URLs
3. **frontend/robots.txt** - Update sitemap URL
4. **frontend/script.js** - Update backend API URL (after backend is deployed)

**Your Netlify URL format:** `https://your-site-name.netlify.app`

## Step 4: Environment Variables (if needed)

If you need any frontend environment variables:
- Go to Site settings → Environment variables
- Add any variables needed

## Step 5: Continuous Deployment

Netlify automatically deploys when you push to GitHub!
- Every push to `main` branch = automatic deployment
- Preview deployments for pull requests

## Step 6: Update Backend CORS

After getting your Netlify URL, update `backend/server.js`:
- Add your Netlify URL to the `allowedOrigins` array
- Or set `FRONTEND_URL` environment variable on Render

---

## ✅ Post-Deployment Checklist

- [ ] Site is accessible at Netlify URL
- [ ] All images load correctly
- [ ] All links work
- [ ] Contact form works (after backend is deployed)
- [ ] Mobile responsive
- [ ] Custom domain configured (if applicable)

---

## 🔧 Troubleshooting

### Images Not Loading
- Check image paths are relative (e.g., `Images/logo.png`)
- Verify all images are in the `frontend/Images/` folder

### 404 Errors
- Check publish directory is set correctly
- Ensure `index.html` is in the publish directory

### Build Errors
- Check Netlify build logs
- Verify all file paths are correct

---

**Your frontend will be live at:** `https://your-site-name.netlify.app` 🎉
