# 🚀 Deployment Guide - PcJohncorp Website

## ✅ Pre-Deployment Checklist - COMPLETED

- [x] CORS configured for production
- [x] Domain references updated to GitHub Pages URL
- [x] Sitemap dates updated
- [x] Email inconsistency fixed
- [x] Debug mode disabled for production
- [x] Performance optimizations (lazy loading, font optimization, image preloading)
- [x] All files committed and pushed to GitHub

---

## 📦 Frontend Deployment (GitHub Pages)

### Status: ✅ READY
Your frontend is already deployed on GitHub Pages!

**Your Website URL:**
```
https://charlsmaxx.github.io/Pcjohncorp/
```

**To verify deployment:**
1. Go to: https://github.com/charlsmaxx/Pcjohncorp/settings/pages
2. Check that it shows: "Your site is live at https://charlsmaxx.github.io/Pcjohncorp/"

**Note:** GitHub Pages automatically deploys when you push to the `main` branch. Your latest changes should be live in 1-2 minutes.

---

## 🔧 Backend Deployment

### Step 1: Choose a Hosting Service

**Recommended Options:**

#### Option A: Railway (Easiest) ⭐ Recommended
1. Go to: https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `Pcjohncorp` repository
6. Railway will auto-detect Node.js
7. Set root directory to: `backend`
8. Add environment variables (see Step 2)
9. Deploy!

**Railway will give you a URL like:** `https://your-app.railway.app`

#### Option B: Render
1. Go to: https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Settings:
   - **Name:** pcjohncorp-backend
   - **Root Directory:** backend
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add environment variables
7. Deploy!

**Render will give you a URL like:** `https://pcjohncorp-backend.onrender.com`

#### Option C: Heroku
1. Go to: https://heroku.com
2. Create account
3. Install Heroku CLI
4. Run:
   ```bash
   cd backend
   heroku create pcjohncorp-backend
   heroku config:set EMAIL_USER=pcjohncorp998@gmail.com
   heroku config:set EMAIL_PASS=your-app-password
   heroku config:set RECEIVING_EMAIL=pcjohncorp998@gmail.com
   git push heroku main
   ```

---

### Step 2: Set Environment Variables

On your hosting platform, add these environment variables:

```
EMAIL_USER=pcjohncorp998@gmail.com
EMAIL_PASS=your-gmail-app-password
RECEIVING_EMAIL=pcjohncorp998@gmail.com
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://charlsmaxx.github.io
```

**Important:** 
- `EMAIL_PASS` must be a Gmail App Password (not your regular password)
- Get it from: https://myaccount.google.com/apppasswords

---

### Step 3: Update Frontend API URL

Once your backend is deployed, update the frontend:

1. **Edit:** `frontend/script.js` (line ~54)
2. **Replace:** `'YOUR_BACKEND_URL'` with your actual backend URL
3. **Example:**
   ```javascript
   const PRODUCTION_API_URL = 'https://pcjohncorp-backend.railway.app';
   ```
4. **Copy to root:** `Copy-Item frontend\script.js script.js -Force`
5. **Commit and push:**
   ```bash
   git add frontend/script.js script.js
   git commit -m "Update backend API URL for production"
   git push origin main
   ```

---

### Step 4: Update CORS (if needed)

The backend is already configured to allow:
- `https://charlsmaxx.github.io`
- Your custom domain (if you add one)

If you need to add more domains, edit `backend/server.js` and add to the `allowedOrigins` array.

---

## 🧪 Testing After Deployment

### 1. Test Backend Health
Visit: `https://your-backend-url.com/api/health`
Should return: `{"status":"ok","message":"Server is running"}`

### 2. Test Contact Form
1. Go to your website: https://charlsmaxx.github.io/Pcjohncorp/
2. Fill out the contact form
3. Submit
4. Check your email (pcjohncorp998@gmail.com) for the message

### 3. Verify All Links
- [ ] Phone number: +1 (845) 404-1285
- [ ] WhatsApp: +1 (347) 902-4742
- [ ] Email: pcjohncorp998@gmail.com
- [ ] Social media links (Facebook, Instagram, YouTube, TikTok)

---

## 📝 Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Environment variables set correctly
- [ ] Frontend API URL updated
- [ ] Contact form tested and working
- [ ] All links verified
- [ ] Mobile responsiveness tested
- [ ] Page load speed checked (use Google PageSpeed Insights)

---

## 🔍 Troubleshooting

### Contact Form Not Working
1. Check browser console (F12) for errors
2. Verify backend URL is correct in `script.js`
3. Check backend logs for errors
4. Verify environment variables are set
5. Test backend health endpoint

### CORS Errors
- Make sure `FRONTEND_URL` environment variable is set
- Check that your frontend domain is in `allowedOrigins` in `server.js`

### Email Not Sending
- Verify Gmail App Password is correct
- Check backend logs for email errors
- Test email configuration: `POST /api/test-email`

---

## 🎯 Next Steps (Optional Improvements)

1. **Image Optimization:** Compress large images (4 images over 1MB)
2. **Custom Domain:** Set up custom domain for GitHub Pages
3. **SSL Certificate:** GitHub Pages provides this automatically
4. **Analytics:** Add Google Analytics
5. **Monitoring:** Set up error monitoring (Sentry, etc.)

---

## 📞 Support

If you encounter issues during deployment:
1. Check the backend server logs
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Test the backend health endpoint

**Your deployment is ready! 🎉**

