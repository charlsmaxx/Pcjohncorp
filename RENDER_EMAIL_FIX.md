# 🔧 Fix Email SMTP Timeout on Render

## The Problem

You're seeing this error on Render:
```
❌ Email server connection error: Connection timeout
Error code: ETIMEDOUT
```

**Why this happens:** Render and many cloud platforms block outbound SMTP connections on port 587 (STARTTLS) as a security measure. Some also block port 465 (SSL/TLS).

## 🚀 Solutions (Try in Order)

### Solution 1: Try Port 465 (SSL/TLS) - Quick Fix ⚡

Port 465 uses SSL/TLS encryption and is sometimes allowed when port 587 is blocked.

**Steps:**

1. Go to your Render dashboard: https://dashboard.render.com
2. Navigate to your service: `pcjohncorp-backend`
3. Go to **Environment** tab
4. Add/Update this environment variable:
   ```
   SMTP_PORT=465
   ```
5. Click **Save Changes**
6. Render will automatically redeploy your service
7. Check the logs - you should see: `✅ Email server is ready to send messages`

**Expected Result:**
- Email connection should work
- You'll see successful email sends in logs

---

### Solution 2: Use Resend API (Recommended for Production) ⭐

Resend is a modern email API designed for developers and works perfectly on Render. It's free for up to 3,000 emails/month.

**Step 1: Sign up for Resend**

1. Go to: https://resend.com
2. Sign up for free (use your email)
3. Verify your email address
4. Go to **API Keys** section
5. Click **Create API Key**
6. Name it: `PcJohncorp Production`
7. Copy the API key (starts with `re_...`)

**Step 2: Add Domain (Optional but Recommended)**

1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter: `pcjohncorp.com` (or your domain)
4. Follow DNS setup instructions
5. Verify domain (may take a few minutes)

**If you don't have a custom domain:** Resend will send from `onboarding@resend.dev` for free accounts. This works fine for contact forms!

**Step 3: Update Render Environment Variables**

In Render dashboard → Your service → Environment tab:

**ADD these:**
```
EMAIL_SERVICE=resend
RESEND_API_KEY=re_your_api_key_here
RECEIVING_EMAIL=pcjohncorp998@gmail.com
```

**REMOVE these (not needed with Resend, will cause confusion):**
- ❌ `EMAIL_USER` (not needed)
- ❌ `EMAIL_PASS` (not needed)
- ❌ `SMTP_HOST` (not needed)
- ❌ `SMTP_PORT` (not needed)

**KEEP these (still used):**
- ✅ `RECEIVING_EMAIL` (where contact form messages are sent)
- ✅ `PORT=3000` (server port)
- ✅ `NODE_ENV=production` (production mode)
- ✅ `FRONTEND_URL` (your frontend URL for CORS)

**Step 4: Backend Code**

✅ **Good news!** The backend code has already been updated to support Resend. No code changes needed - just set the environment variables above.

**Step 5: Test**

1. After deployment, test the contact form
2. Check your email inbox
3. Check Resend dashboard → Emails for delivery status

---

### Solution 3: Use SendGrid (Alternative)

SendGrid is another reliable email service that works on Render.

1. Sign up: https://sendgrid.com (free tier: 100 emails/day)
2. Create API Key: Settings → API Keys → Create API Key
3. Add to Render environment variables:
   ```
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=SG.your_api_key_here
   RECEIVING_EMAIL=pcjohncorp998@gmail.com
   ```
4. Update server.js to use SendGrid (requires code changes)

---

## 📋 Quick Comparison

| Solution | Difficulty | Cost | Reliability | Setup Time |
|----------|-----------|------|-------------|------------|
| Port 465 | ⭐ Easy | Free | ⚠️ May still fail | 2 minutes |
| Resend | ⭐⭐ Medium | Free (3K/month) | ✅ Excellent | 10 minutes |
| SendGrid | ⭐⭐⭐ Hard | Free (100/day) | ✅ Excellent | 15 minutes |

---

## ✅ Recommended Action Plan

**Immediate (Try First):**
1. ✅ Add `SMTP_PORT=465` to Render environment variables
2. ✅ Wait for redeploy
3. ✅ Test contact form
4. ✅ Check logs

**If Port 465 Doesn't Work:**
1. ✅ Sign up for Resend (free)
2. ✅ Get API key
3. ✅ Update environment variables
4. ✅ Update server code (we can help with this)
5. ✅ Test contact form

---

## 🔍 How to Check if It's Working

1. **Check Render Logs:**
   - Go to Render dashboard → Your service → Logs
   - Look for: `✅ Email server is ready to send messages`

2. **Test Contact Form:**
   - Fill out the contact form on your website
   - Submit it
   - Check your email inbox

3. **Check Service Logs:**
   - After submitting, check Render logs
   - You should see: `✅ Email sent successfully!`

---

## 🆘 Still Having Issues?

1. **Check Environment Variables:**
   - Make sure all variables are set correctly in Render
   - No extra spaces or quotes
   - Variable names are case-sensitive

2. **Check Render Logs:**
   - Look for detailed error messages
   - Share error details if you need help

3. **Test Email Endpoint:**
   ```bash
   curl -X POST https://pcjohncorp-backend.onrender.com/api/test-email
   ```

4. **Contact Support:**
   - Render Support: https://render.com/docs
   - Or update this file with your error details

---

## 📚 Additional Resources

- [Render Email Documentation](https://render.com/docs/email)
- [Resend Documentation](https://resend.com/docs)
- [Nodemailer Documentation](https://nodemailer.com/about/)

---

**Next Steps:** Try Solution 1 (Port 465) first. If that doesn't work, implement Solution 2 (Resend) for a reliable, production-ready solution.







