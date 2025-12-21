# 🔍 Resend Email Troubleshooting

## Issue: Still Getting Connection Timeout Errors with Resend

If you're using Resend but still seeing connection timeout errors, check these:

### 1. Verify Environment Variables in Render

Go to Render Dashboard → Your Service → Environment tab and verify:

**Required variables:**
```
EMAIL_SERVICE=resend
RESEND_API_KEY=re_your_api_key_here
RECEIVING_EMAIL=pcjohncorp998@gmail.com
```

**Make sure:**
- ✅ `EMAIL_SERVICE` is set to exactly `resend` (lowercase, no quotes, no spaces)
- ✅ `RESEND_API_KEY` starts with `re_` and is your full API key
- ✅ No old Gmail variables are present (`EMAIL_USER`, `EMAIL_PASS`, `SMTP_PORT`, `SMTP_HOST`)

### 2. Check Server Logs

After deployment, check Render logs for:

**✅ Good signs:**
```
📧 Email Service Configuration:
   EMAIL_SERVICE=resend
   RESEND_API_KEY=***abcd
✅ Resend email service configured
📬 Receiving emails at: pcjohncorp998@gmail.com
🔌 Using Resend SMTP: smtp.resend.com:465
⚠️  Note: Connection verification skipped for Resend (will verify on first send)
```

**❌ Problems:**
```
EMAIL_SERVICE=(not set - using Gmail SMTP)  ← EMAIL_SERVICE not set!
RESEND_API_KEY=NOT SET ❌  ← API key missing!
```

### 3. Common Issues

#### Issue: EMAIL_SERVICE not set
**Symptom:** Logs show `EMAIL_SERVICE=(not set - using Gmail SMTP)`
**Solution:** 
1. Go to Render → Environment
2. Add: `EMAIL_SERVICE=resend`
3. Save and wait for redeploy

#### Issue: RESEND_API_KEY not set
**Symptom:** Logs show `RESEND_API_KEY=NOT SET ❌`
**Solution:**
1. Get API key from https://resend.com/api-keys
2. Copy the full key (starts with `re_`)
3. Add to Render: `RESEND_API_KEY=re_your_full_key_here`
4. Save and redeploy

#### Issue: Old Gmail variables still present
**Symptom:** Code might be confused about which service to use
**Solution:**
1. Remove these variables from Render:
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `SMTP_PORT`
   - `SMTP_HOST`
2. Keep only Resend variables
3. Redeploy

### 4. Test the Configuration

After fixing environment variables:

1. **Check startup logs:**
   - Look for "✅ Resend email service configured"
   - Should NOT see connection timeout errors on startup

2. **Test the contact form:**
   - Submit a test message
   - Check your email inbox
   - Check Render logs for "✅ Email sent successfully!"

3. **Test email endpoint (optional):**
   ```bash
   curl -X POST https://pcjohncorp-backend.onrender.com/api/test-email
   ```

### 5. Verify Resend API Key

1. Go to https://resend.com/api-keys
2. Make sure your API key exists and is active
3. If needed, create a new key and update `RESEND_API_KEY` in Render

### 6. Check Resend Dashboard

1. Go to https://resend.com/emails
2. Check if emails are being sent (even if there are errors)
3. Check delivery status

---

## Still Having Issues?

1. **Double-check all environment variables** - case-sensitive, no quotes, no spaces
2. **Check Render logs** - look for the "📧 Email Service Configuration" section
3. **Verify code is deployed** - make sure latest code is pushed to GitHub and deployed
4. **Test locally first** - set up Resend in local `.env` to verify it works

---

## Quick Checklist

- [ ] `EMAIL_SERVICE=resend` is set in Render
- [ ] `RESEND_API_KEY` is set with your full API key
- [ ] `RECEIVING_EMAIL` is set
- [ ] Old Gmail variables (`EMAIL_USER`, `EMAIL_PASS`) are removed
- [ ] Code is deployed (check GitHub commit and Render deployment)
- [ ] Server logs show "✅ Resend email service configured"
- [ ] No connection timeout errors on startup
