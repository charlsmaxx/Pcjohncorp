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
RESEND_FROM_EMAIL=noreply@pcjohncorp.com
```

**Make sure:**
- ✅ `EMAIL_SERVICE` is set to exactly `resend` (lowercase, no quotes, no spaces)
- ✅ `RESEND_API_KEY` starts with `re_` and is your full API key
- ✅ `RESEND_FROM_EMAIL` is set to your verified domain email (e.g., `noreply@pcjohncorp.com`)
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
📧 Sending emails from: noreply@pcjohncorp.com
✅ Using verified domain email
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

#### Issue: Domain not verified or RESEND_FROM_EMAIL not set
**Symptom:** 
- Logs show: `⚠️  Using default Resend email (onboarding@resend.dev)`
- Emails fail to send or only work for account owner email
- Error: "Testing emails only" or "Domain not verified"

**Solution:**
1. **Verify domain in Resend:**
   - Go to https://resend.com/domains
   - Add domain `pcjohncorp.com`
   - Add DNS records to Namecheap (see RESEND_DOMAIN_VERIFICATION.md)
   - Wait for verification (15-30 minutes)

2. **Set RESEND_FROM_EMAIL in Render:**
   - Go to Render → Environment
   - Add: `RESEND_FROM_EMAIL=noreply@pcjohncorp.com`
   - Save and redeploy

3. **Verify in logs:**
   - Should see: `✅ Using verified domain email: noreply@pcjohncorp.com`
   - Should NOT see: `⚠️  Using default Resend email`

**📖 See RESEND_DOMAIN_VERIFICATION.md for complete domain setup guide**

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
4. **Verify domain is set up** - check RESEND_DOMAIN_VERIFICATION.md for domain verification steps
5. **Check Resend dashboard** - verify domain status and email logs
6. **Test locally first** - set up Resend in local `.env` to verify it works

## Domain-Specific Issues

If you've moved your domain to `pcjohncorp.com` and emails are still failing:

1. **Verify domain in Resend:**
   - Domain must be verified in Resend dashboard
   - DNS records must be added to Namecheap
   - See RESEND_DOMAIN_VERIFICATION.md for detailed steps

2. **Set RESEND_FROM_EMAIL:**
   - Must use email from verified domain
   - Format: `noreply@pcjohncorp.com` (or `contact@pcjohncorp.com`, etc.)
   - Set in Render environment variables

3. **Check server logs:**
   - Should show: `✅ Using verified domain email: noreply@pcjohncorp.com`
   - If you see: `⚠️  Using default Resend email` - domain is not configured

4. **Common domain errors:**
   - "Domain not verified" → Verify domain in Resend and add DNS records
   - "Testing emails only" → Set RESEND_FROM_EMAIL to verified domain email
   - "Invalid sender" → Make sure RESEND_FROM_EMAIL uses your verified domain

---

## Quick Checklist

- [ ] `EMAIL_SERVICE=resend` is set in Render
- [ ] `RESEND_API_KEY` is set with your full API key
- [ ] `RECEIVING_EMAIL` is set
- [ ] `RESEND_FROM_EMAIL` is set to your verified domain email (e.g., `noreply@pcjohncorp.com`)
- [ ] Domain `pcjohncorp.com` is verified in Resend dashboard
- [ ] DNS records are added to Namecheap for Resend
- [ ] Old Gmail variables (`EMAIL_USER`, `EMAIL_PASS`) are removed
- [ ] Code is deployed (check GitHub commit and Render deployment)
- [ ] Server logs show "✅ Resend email service configured"
- [ ] Server logs show "✅ Using verified domain email"
- [ ] No connection timeout errors on startup
- [ ] Contact form sends emails successfully
- [ ] Emails arrive at receiving email address
