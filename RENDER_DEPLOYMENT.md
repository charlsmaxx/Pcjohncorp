# 🚀 Render Backend Deployment Guide

## Step 1: Prepare Your Repository

✅ Your backend code is in: `backend/` folder
✅ Already on GitHub at: `https://github.com/charlsmaxx/Pcjohncorp`

## Step 2: Deploy to Render

### Create Web Service

1. **Sign up/Login to Render**
   - Go to: https://render.com
   - Sign up with GitHub (easiest method)

2. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"
   - Click "Connect GitHub"
   - Authorize Render to access your repositories
   - Select repository: `Pcjohncorp`

3. **Configure Service Settings**

   **Basic Settings:**
   - **Name:** `pcjohncorp-backend` (or your preferred name)
   - **Region:** Choose closest to your users (e.g., `Oregon (US West)`)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

   **Advanced Settings:**
   - **Auto-Deploy:** `Yes` (deploys automatically on git push)
   - **Health Check Path:** `/api/health`

4. **Add Environment Variables**

   Click "Add Environment Variable" and add these:

   ```
   EMAIL_USER=pcjohncorp998@gmail.com
   EMAIL_PASS=your-gmail-app-password
   RECEIVING_EMAIL=pcjohncorp998@gmail.com
   PORT=3000
   NODE_ENV=production
   FRONTEND_URL=https://your-netlify-site.netlify.app
   ```

   **Important:**
   - Replace `your-gmail-app-password` with your actual Gmail App Password
   - Get App Password from: https://myaccount.google.com/apppasswords
   - Replace `your-netlify-site.netlify.app` with your actual Netlify URL

5. **Deploy!**
   - Click "Create Web Service"
   - Render will start building and deploying
   - Wait for deployment to complete (usually 2-5 minutes)

6. **Get Your Backend URL**
   - Once deployed, Render will give you a URL like:
   - `https://pcjohncorp-backend.onrender.com`
   - **Note:** Free tier services spin down after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds

## Step 3: Test Backend

1. **Health Check**
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

2. **Test Email Endpoint** (Optional)
   - Use Postman or curl to test: `POST https://your-backend-url.onrender.com/api/test-email`
   - Check backend logs for any errors

## Step 4: Update Frontend API URL

After backend is deployed:

1. **Edit:** `frontend/script.js` (around line 54)
2. **Find:** `const PRODUCTION_API_URL = 'YOUR_BACKEND_URL';`
3. **Replace with:** Your Render backend URL
   ```javascript
   const PRODUCTION_API_URL = 'https://pcjohncorp-backend.onrender.com';
   ```
4. **Copy to root:** `Copy-Item frontend\script.js script.js -Force`
5. **Commit and push:**
   ```bash
   git add frontend/script.js script.js
   git commit -m "Update backend API URL for Render deployment"
   git push origin main
   ```

## Step 5: Update CORS (if needed)

The backend already includes Render URLs, but verify:
- Check `backend/server.js` - `allowedOrigins` array
- Make sure your Netlify URL is included
- Or set `FRONTEND_URL` environment variable on Render

## Step 6: Configure Auto-Deploy

✅ Already configured! Render auto-deploys on every push to `main` branch.

---

## 🔧 Render-Specific Configuration

### Free Tier Limitations

- **Spin-down:** Services spin down after 15 minutes of inactivity
- **Cold start:** First request after spin-down takes 30-60 seconds
- **Solution:** Upgrade to paid plan or use a service like UptimeRobot to ping your service

### Keep Service Alive (Free Tier)

Add a cron job or use a service like:
- **UptimeRobot:** https://uptimerobot.com
  - Set up a monitor to ping: `https://your-backend-url.onrender.com/api/health`
  - Set interval to 5 minutes

### Environment Variables

All sensitive data should be in Render's environment variables:
- Never commit `.env` file
- All variables are encrypted in Render

---

## ✅ Post-Deployment Checklist

- [ ] Backend is accessible at Render URL
- [ ] Health endpoint returns success
- [ ] Environment variables are set correctly
- [ ] Frontend API URL is updated
- [ ] CORS is configured correctly
- [ ] Contact form works end-to-end
- [ ] Email sending works
- [ ] Service stays alive (if using free tier)

---

## 🔍 Troubleshooting

### Service Won't Start
- Check build logs in Render dashboard
- Verify `package.json` has correct start script
- Check that `server.js` exists in `backend/` folder

### Environment Variables Not Working
- Verify variables are set in Render dashboard
- Check variable names match exactly (case-sensitive)
- Restart service after adding variables

### CORS Errors
- Verify `FRONTEND_URL` is set correctly
- Check that your Netlify URL is in `allowedOrigins`
- Check backend logs for CORS errors

### Email Not Sending
- Verify Gmail App Password is correct
- Check backend logs for email errors
- Test with `/api/test-email` endpoint
- Verify `RECEIVING_EMAIL` is set

### Service Keeps Spinning Down
- Free tier limitation
- Use UptimeRobot to ping service every 5 minutes
- Or upgrade to paid plan

---

## 📊 Monitoring

Render provides:
- **Logs:** Real-time logs in dashboard
- **Metrics:** CPU, Memory usage
- **Events:** Deploy history

---

**Your backend will be live at:** `https://pcjohncorp-backend.onrender.com` 🎉
