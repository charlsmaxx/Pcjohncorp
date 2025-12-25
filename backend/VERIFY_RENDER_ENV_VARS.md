# 🔍 Verify Render Environment Variables

## ⚠️ IMPORTANT: Never Upload .env to GitHub!

The `.env` file contains sensitive credentials and should **NEVER** be committed to GitHub. Render uses **Environment Variables** set in the dashboard, not `.env` files.

---

## Step 1: Check Render Environment Variables

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click your service**: `pcjohncorp-backend`
3. **Go to "Environment" tab** (left sidebar)
4. **Verify these variables exist:**

### Required Variables:
```
EMAIL_SERVICE=resend
RESEND_API_KEY=re_your_actual_key_here
RECEIVING_EMAIL=pcjohncorp998@gmail.com
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://stately-rabanadas-726bf5.netlify.app
```

### Variables to REMOVE (if present):
- ❌ `EMAIL_USER` (not needed with Resend)
- ❌ `EMAIL_PASS` (not needed with Resend)
- ❌ `SMTP_HOST` (not needed with Resend)
- ❌ `SMTP_PORT` (not needed with Resend)

---

## Step 2: Check for Common Issues

### Issue 1: Extra Spaces
- ❌ `EMAIL_SERVICE = resend` (has spaces around `=`)
- ✅ `EMAIL_SERVICE=resend` (no spaces)

### Issue 2: Quotes Around Values
- ❌ `RESEND_API_KEY="re_xxxxx"` (has quotes)
- ✅ `RESEND_API_KEY=re_xxxxx` (no quotes)

### Issue 3: Missing Variables
- Make sure `EMAIL_SERVICE=resend` is set (case doesn't matter, but lowercase is recommended)
- Make sure `RESEND_API_KEY` starts with `re_`

---

## Step 3: Check Render Logs

After updating environment variables, check the logs:

1. **Go to Render Dashboard** → Your service → **"Logs" tab**
2. **Look for these lines** (should appear on startup):

```
📧 Email Service Configuration:
   EMAIL_SERVICE (raw)="resend"
   EMAIL_SERVICE (processed)=resend
   RESEND_API_KEY (exists)=true
   RESEND_API_KEY (length)=XX
   RESEND_API_KEY (last 4)=***xxxx
   ✅ Using Resend email service
✅ Resend email service configured
```

### If you see:
- `RESEND_API_KEY (exists)=false` → Variable not set in Render
- `RESEND_API_KEY (length)=0` → Variable is empty
- `isResendService()=false` → Detection failed

---

## Step 4: How to Fix

### If RESEND_API_KEY is missing:
1. Go to Resend: https://resend.com/api-keys
2. Create a new API key
3. Copy it (starts with `re_`)
4. Go to Render → Environment tab
5. Add/Update: `RESEND_API_KEY=re_your_new_key`
6. Save Changes
7. Wait for redeploy (2-3 minutes)

### If EMAIL_SERVICE is missing:
1. Go to Render → Environment tab
2. Add: `EMAIL_SERVICE=resend`
3. Save Changes
4. Wait for redeploy

---

## Step 5: Test After Fix

1. **Wait for deployment to complete** (check Render dashboard)
2. **Check logs** for the configuration output
3. **Test contact form** on your Netlify site
4. **Check email inbox** for the message

---

## 🆘 Still Not Working?

If environment variables are set correctly but still not working:

1. **Check Render logs** for the exact error message
2. **Verify API key** is valid in Resend dashboard
3. **Try creating a new Resend API key** (old one might be invalid)
4. **Make sure no extra spaces or quotes** in environment variables

---

## 📝 Notes

- Render environment variables are **case-sensitive** for the variable name
- Values are **not case-sensitive** for `EMAIL_SERVICE` (we convert to lowercase)
- After changing environment variables, Render **automatically redeploys**
- The `.env` file is for **local development only**, not for Render

---

**Need help?** Share the Render logs output and I can help diagnose the issue.






