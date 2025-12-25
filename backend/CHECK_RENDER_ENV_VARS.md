# 🔍 How to Check Render Environment Variables

## Important: Render doesn't read .env files!

Render reads environment variables from the **Render Dashboard**, not from `.env` files in your repository.

---

## Step 1: Verify Environment Variables in Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click your service**: `pcjohncorp-backend`
3. **Click "Environment"** tab (left sidebar)
4. **Check these variables exist:**

### Required Variables:
```
EMAIL_SERVICE=resend
RESEND_API_KEY=re_your_actual_key_here
RECEIVING_EMAIL=pcjohncorp998@gmail.com
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://stately-rabanadas-726bf5.netlify.app
```

---

## Step 2: Check for Common Issues

### ❌ Problem 1: Variable names have spaces
**Wrong:**
```
EMAIL_SERVICE = resend
RESEND_API_KEY = re_xxxx
```

**Correct:**
```
EMAIL_SERVICE=resend
RESEND_API_KEY=re_xxxx
```

### ❌ Problem 2: Values have quotes
**Wrong:**
```
EMAIL_SERVICE="resend"
RESEND_API_KEY="re_xxxx"
```

**Correct:**
```
EMAIL_SERVICE=resend
RESEND_API_KEY=re_xxxx
```

### ❌ Problem 3: Variables not saved
- After adding/editing, make sure to click **"Save Changes"**
- Wait for the service to redeploy (1-2 minutes)

---

## Step 3: Check Render Logs

After deployment, check the logs. You should see:

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

If you see:
- `RESEND_API_KEY (exists)=false` → Variable not set in Render
- `RESEND_API_KEY (length)=0` → Variable is empty
- `isResendService()=false` → Detection failed

---

## Step 4: How to Fix

### If variables are missing:
1. Go to Environment tab
2. Click **"Add Environment Variable"**
3. Enter **Key**: `EMAIL_SERVICE`
4. Enter **Value**: `resend` (no quotes, no spaces)
5. Click **"Save Changes"**
6. Repeat for all required variables

### If variables exist but not detected:
1. **Delete** the variable
2. **Re-add** it (make sure no spaces around `=`)
3. **Save Changes**
4. Wait for redeploy

---

## Step 5: Test After Fix

1. Wait for Render to finish deploying (check logs)
2. Look for: `✅ Resend email service configured`
3. Test contact form on your Netlify site
4. Check your email inbox

---

## 🚨 Security Note

**DO NOT** commit `.env` files to GitHub, even if the repo is private:
- ❌ Security risk if repo becomes public
- ❌ API keys exposed in git history
- ❌ Render doesn't read .env files anyway
- ✅ Always use Render's Environment Variables tab

---

## Still Not Working?

Share the Render logs output (the "Email Service Configuration" section) and I'll help debug!
