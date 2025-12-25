# 🔧 Resend Domain Verification Guide for pcjohncorp.com

## Overview

Now that you've moved your domain to `pcjohncorp.com` and configured DNS, you need to verify the domain in Resend to enable email sending from your custom domain. This will resolve email delivery issues.

---

## Step 1: Verify Domain in Resend

### 1.1 Access Resend Dashboard

1. **Go to**: https://resend.com/domains
2. **Log in** to your Resend account
3. **Click "Add Domain"** button

### 1.2 Add Your Domain

1. **Enter your domain**: `pcjohncorp.com`
2. **Click "Add"** or "Continue"
3. **Resend will provide DNS records** that need to be added to your domain

### 1.3 Get DNS Records from Resend

Resend will show you DNS records that look like this:

**Example DNS Records:**
```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEB... (long DKIM public key)

Type: MX
Name: send
Value: feedback-smtp.eu-west-...
Priority: 10

Type: TXT
Name: send
Value: v=spf1 include:amazons... (SPF record)

Type: TXT (Optional)
Name: _dmarc
Value: v=DMARC1; p=none;
```

**Important**: 
- Your actual records will be different - copy them exactly from Resend!
- **Host values matter**: 
  - Use `@` for root domain records (like MX for receiving)
  - Use `send` for sending configuration (SPF, MX)
  - Use `resend._domainkey` EXACTLY as shown for DKIM (don't change to "@")
- **Record types**:
  - TXT records for DKIM, SPF, and DMARC
  - MX records for sending and receiving

---

## Step 2: Add DNS Records to Namecheap

### 2.1 Log in to Namecheap

1. **Go to**: https://www.namecheap.com
2. **Sign in** to your account
3. **Go to "Domain List"**
4. **Find `pcjohncorp.com`**
5. **Click "Manage"** button

### 2.2 Access Advanced DNS

1. **Click "Advanced DNS" tab**
2. **Scroll to "Mail Settings" section** (near the top, before Host Records)

### 2.3 Enable Custom MX (Required for MX Records)

1. **Find "Mail Settings" section** (usually near the top of Advanced DNS page)
2. **Click the dropdown menu** next to "Mail Settings"
3. **Select "Custom MX"** from the dropdown
4. **Click "Save All Changes"** (if prompted)
5. **This enables MX record options** in the Host Records section

**Important**: You must set Mail Settings to "Custom MX" before you can add MX records!

### 2.4 Add Resend DNS Records

For each DNS record provided by Resend:

**Note**: The DKIM record is the main domain verification record. Some providers may also show a separate verification TXT record - add all records that Resend shows.


#### Add SPF TXT Record (for sending):
1. **Click "Add New Record"**
2. **Select Type**: `TXT Record`
3. **Fill in**:
   - **Host**: `send` (or value from Resend - may be `@` in some cases)
   - **Value**: `v=spf1 include:amazons...` (copy full value from Resend)
   - **TTL**: `Automatic`
4. **Click checkmark (✓)** to save

#### Add MX Record (for sending - if shown):
1. **Scroll to "Host Records" section** (below Mail Settings)
2. **Click "Add New Record"**
3. **Select Type**: `MX Record` (should now be available after setting Custom MX)
4. **Fill in**:
   - **Host**: `send` (or value from Resend)
   - **Value**: `feedback-smtp.eu-west-...` (copy from Resend)
   - **Priority**: `10` (or value from Resend)
   - **TTL**: `Automatic`
5. **Click checkmark (✓)** to save

**Note**: If you still don't see "MX Record" option:
- Make sure you've saved "Custom MX" in Mail Settings first
- Refresh the page after saving Mail Settings
- MX records may appear as a separate section in some Namecheap interfaces

#### Add DKIM TXT Record:
1. **Click "Add New Record"**
2. **Select Type**: `TXT Record`
3. **Fill in**:
   - **Host**: `resend._domainkey` (use EXACTLY as Resend provides - DO NOT change to "@")
   - **Value**: `p=MIGfMA0GCSqGSIb3DQEB...` (copy the full value from Resend - it's a long public key)
   - **TTL**: `Automatic`
4. **Click checkmark (✓)** to save

**⚠️ Important**: 
- `resend._domainkey` is a **subdomain** for DKIM authentication
- **DO NOT change it to "@"** - it must be exactly `resend._domainkey`
- This creates the subdomain: `resend._domainkey.pcjohncorp.com`
- This is a **TXT record** containing the DKIM public key
- The value will be a long string starting with `p=` - copy it completely from Resend

**Note**: Add ALL records that Resend provides. Some may be optional, but it's best to add them all.

---

## Step 3: Wait for DNS Propagation

1. **DNS changes take 5 minutes to 48 hours** (usually 15-30 minutes for Namecheap)
2. **Go back to Resend dashboard** → Domains
3. **Check domain status** - it should show "Pending" or "Verifying"
4. **Wait for status to change to "Verified"** (green checkmark)

**Tip**: You can check DNS propagation at:
- https://www.whatsmydns.net
- Enter your domain and check TXT records

---

## Step 4: Update Render Environment Variables

Once your domain is verified in Resend:

### 4.1 Go to Render Dashboard

1. **Go to**: https://dashboard.render.com
2. **Click your service**: `pcjohncorp-backend`
3. **Go to "Environment" tab**

### 4.2 Add/Update RESEND_FROM_EMAIL

1. **Find or add** environment variable:
   ```
   RESEND_FROM_EMAIL=noreply@pcjohncorp.com
   ```
   
   **Or use any email from your verified domain:**
   - `contact@pcjohncorp.com`
   - `info@pcjohncorp.com`
   - `hello@pcjohncorp.com`
   - `noreply@pcjohncorp.com`

2. **Keep these existing variables:**
   ```
   EMAIL_SERVICE=resend
   RESEND_API_KEY=re_your_api_key_here
   RECEIVING_EMAIL=pcjohncorp998@gmail.com
   ```

3. **Click "Save Changes"**
4. **Render will automatically redeploy** (wait 2-3 minutes)

---

## Step 5: Verify Configuration

### 5.1 Check Server Logs

After Render redeploys, check the logs for:

**✅ Good signs:**
```
📧 Email Service Configuration:
   EMAIL_SERVICE=resend
   RESEND_API_KEY=***abcd
✅ Resend email service configured
📬 Receiving emails at: pcjohncorp998@gmail.com
🔌 Using Resend SMTP: smtp.resend.com:465
```

### 5.2 Test Contact Form

1. **Go to your website**: https://pcjohncorp.com
2. **Fill out the contact form**
3. **Submit the form**
4. **Check your email**: `pcjohncorp998@gmail.com`
5. **Verify the email**:
   - ✅ Email arrives successfully
   - ✅ Email is **from** `noreply@pcjohncorp.com` (or your chosen email)
   - ✅ Email is **to** `pcjohncorp998@gmail.com`

### 5.3 Check Resend Dashboard

1. **Go to**: https://resend.com/emails
2. **Check email logs**:
   - Should show successful sends
   - Should show delivery status
   - Should show sender as your domain email

---

## Troubleshooting

### Domain Not Verifying?

**Problem**: Domain status stuck on "Pending" or "Verifying"

**Solutions**:
1. **Double-check DNS records** in Namecheap:
   - Make sure all records are added correctly
   - Check for typos in values
   - Verify Host values are correct

2. **Wait longer**:
   - DNS propagation can take up to 48 hours
   - Usually takes 15-30 minutes for Namecheap

3. **Check DNS propagation**:
   - Use https://www.whatsmydns.net
   - Enter `pcjohncorp.com`
   - Check TXT records - should show Resend verification record

4. **Verify in Resend**:
   - Go to Resend → Domains
   - Click on your domain
   - Check what records are still pending

### Emails Still Not Working?

**Problem**: Domain verified but emails still failing

**Solutions**:
1. **Check RESEND_FROM_EMAIL**:
   - Make sure it's set in Render environment variables
   - Format: `noreply@pcjohncorp.com` (use your verified domain)
   - No quotes, no spaces

2. **Check RESEND_API_KEY**:
   - Make sure it's set correctly
   - Should start with `re_`
   - No quotes, no spaces

3. **Check server logs**:
   - Look for error messages
   - Check if `RESEND_FROM_EMAIL` is being used

4. **Test email endpoint**:
   ```bash
   curl -X POST https://pcjohncorp-backend.onrender.com/api/test-email
   ```

### "Domain Not Verified" Error?

**Problem**: Resend says domain is not verified

**Solutions**:
1. **Wait for DNS propagation** (can take up to 48 hours)
2. **Re-check DNS records** in Namecheap
3. **Remove and re-add domain** in Resend if needed
4. **Contact Resend support** if still not working after 48 hours

---

## Current Configuration Checklist

After completing all steps, verify:

- [ ] Domain `pcjohncorp.com` added in Resend
- [ ] All DNS records added to Namecheap
- [ ] Domain verified in Resend (green checkmark)
- [ ] `RESEND_FROM_EMAIL` set in Render (e.g., `noreply@pcjohncorp.com`)
- [ ] `EMAIL_SERVICE=resend` set in Render
- [ ] `RESEND_API_KEY` set in Render
- [ ] `RECEIVING_EMAIL=pcjohncorp998@gmail.com` set in Render
- [ ] Server logs show Resend configured
- [ ] Contact form sends emails successfully
- [ ] Emails arrive at `pcjohncorp998@gmail.com`
- [ ] Emails are sent from your domain email (e.g., `noreply@pcjohncorp.com`)

---

## Benefits of Domain Verification

✅ **Professional emails**: Emails sent from `@pcjohncorp.com` instead of `@resend.dev`
✅ **Better deliverability**: Verified domains have higher email delivery rates
✅ **No restrictions**: Can send to any email address (not just account owner)
✅ **Brand consistency**: All emails come from your domain
✅ **SPF/DKIM configured**: Better email authentication and security

---

## Quick Reference

**Resend Dashboard**: https://resend.com/domains
**Namecheap DNS**: https://www.namecheap.com → Domain List → Manage → Advanced DNS
**Render Environment**: https://dashboard.render.com → Your Service → Environment

**Required Environment Variables in Render:**
```
EMAIL_SERVICE=resend
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@pcjohncorp.com
RECEIVING_EMAIL=pcjohncorp998@gmail.com
```

---

## Next Steps

1. ✅ Verify domain in Resend
2. ✅ Add DNS records to Namecheap
3. ✅ Wait for domain verification
4. ✅ Set `RESEND_FROM_EMAIL` in Render
5. ✅ Test contact form
6. ✅ Verify emails are working

**Need help?**
- Resend Support: https://resend.com/support
- Check server logs in Render for detailed error messages

