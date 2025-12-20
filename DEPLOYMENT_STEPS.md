# 🚀 Quick Deployment Steps - Netlify + Render

## 📋 Deployment Checklist

### Frontend (Netlify) - ~5 minutes
- [ ] Sign up at https://app.netlify.com
- [ ] Connect GitHub repository
- [ ] Set publish directory to `frontend` (or root if deploying from root)
- [ ] Deploy
- [ ] Get Netlify URL (e.g., `https://pcjohncorp.netlify.app`)
- [ ] Note your Netlify URL for backend configuration

### Backend (Render) - ~10 minutes
- [ ] Sign up at https://render.com
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Configure:
  - Name: `pcjohncorp-backend`
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
- [ ] Add environment variables (see below)
- [ ] Deploy
- [ ] Get Render URL (e.g., `https://pcjohncorp-backend.onrender.com`)
- [ ] Test: Visit `https://your-backend-url.onrender.com/api/health`

### Update Frontend API URL
- [ ] Edit `frontend/script.js` line ~54
- [ ] Replace `'YOUR_BACKEND_URL'` with your Render URL
- [ ] Copy to root: `Copy-Item frontend\script.js script.js -Force`
- [ ] Commit and push changes

### Update Domain References
- [ ] After Netlify deployment, update all domain references
- [ ] Files to update: `frontend/index.html`, `frontend/sitemap.xml`
- [ ] Replace `charlsmaxx.github.io/Pcjohncorp` with your Netlify URL

---

## 🔑 Environment Variables for Render

Add these in Render dashboard → Environment:

```
EMAIL_USER=pcjohncorp998@gmail.com
EMAIL_PASS=your-gmail-app-password-here
RECEIVING_EMAIL=pcjohncorp998@gmail.com
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-netlify-site.netlify.app
```

**Replace:**
- `your-gmail-app-password-here` with your actual Gmail App Password
- `your-netlify-site.netlify.app` with your actual Netlify URL

---

## 📝 After Deployment

1. **Test Backend:**
   - Visit: `https://your-backend.onrender.com/api/health`
   - Should see: `{"status":"ok","message":"Server is running"}`

2. **Test Frontend:**
   - Visit your Netlify URL
   - Fill out contact form
   - Check email for message

3. **Update CORS (if needed):**
   - If you get CORS errors, add your Netlify URL to `backend/server.js`
   - Or set `FRONTEND_URL` environment variable on Render

---

## 🆘 Need Help?

- **Netlify Docs:** https://docs.netlify.com
- **Render Docs:** https://render.com/docs
- Check deployment logs in both platforms
- Verify all environment variables are set

---

**Ready to deploy! Follow the guides in `NETLIFY_DEPLOYMENT.md` and `RENDER_DEPLOYMENT.md`** 🎉
