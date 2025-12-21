# ⚡ Quick Fix for Render Email Timeout

## What You're Seeing
```
❌ Email server connection error: Connection timeout
Error code: ETIMEDOUT
```

## 🚀 Try This First (2 minutes)

1. Go to Render Dashboard: https://dashboard.render.com
2. Open your service: `pcjohncorp-backend`
3. Go to **Environment** tab
4. Add/Update this variable:
   ```
   SMTP_PORT=465
   ```
5. Click **Save Changes** (service will auto-redeploy)
6. Wait 2-3 minutes for redeploy
7. Check logs - should see: `✅ Email server is ready to send messages`

**That's it!** Test your contact form now.

---

## 🆘 If Port 465 Doesn't Work

Use Resend (free, works perfectly on Render):

1. **Sign up:** https://resend.com (free, 3,000 emails/month)
2. **Get API key:** Dashboard → API Keys → Create API Key
3. **In Render → Environment, add:**
   ```
   EMAIL_SERVICE=resend
   RESEND_API_KEY=re_your_key_here
   RECEIVING_EMAIL=pcjohncorp998@gmail.com
   ```
4. **Remove these old Gmail variables (not needed with Resend):**
   - ❌ `EMAIL_USER` 
   - ❌ `EMAIL_PASS`
   - ❌ `SMTP_PORT`
   - ❌ `SMTP_HOST`
   
   **Keep these (still needed):**
   - ✅ `RECEIVING_EMAIL` (where to send contact form messages)
   - ✅ `PORT`, `NODE_ENV`, `FRONTEND_URL` (your other settings)
5. **Save & redeploy**

**Done!** Your emails will work reliably.

---

## 📚 More Details

- Full guide: `RENDER_EMAIL_FIX.md`
- Deployment guide: `RENDER_DEPLOYMENT.md`

---

**The server code has already been updated to support both solutions!** ✅
