# Quick Gmail Setup Guide

## The Problem
You're getting this error: `535-5.7.8 Username and Password not accepted`

This happens because **Gmail doesn't allow regular passwords** for third-party apps. You **MUST** use an App Password.

## Quick Fix (5 minutes)

### Step 1: Enable 2-Step Verification
1. Go to: https://myaccount.google.com/security
2. Find "2-Step Verification" and click it
3. Follow the prompts to enable it (if not already enabled)

### Step 2: Create App Password
1. Go directly to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords
2. Select "Mail" from the dropdown
3. Select "Other (Custom name)" and type: `PcJohncorp Contact Form`
4. Click "Generate"
5. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

### Step 3: Update Your .env File
Open your `.env` file and update it:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=abcdefghijklmnop
RECEIVING_EMAIL=info@pcjohncorp.com
PORT=3000
```

**Important:**
- Use the **16-character App Password** (remove spaces if any)
- Do NOT use your regular Gmail password
- The App Password should be 16 characters with no spaces

### Step 4: Restart Server
Stop the server (Ctrl+C) and restart:
```bash
npm start
```

You should now see: `✅ Email server is ready to send messages`

## Still Having Issues?

### Check Your .env File
Make sure your `.env` file is in the root directory and has:
- No extra spaces
- No quotes around values
- Correct format (no `EMAIL_USER = ...`, use `EMAIL_USER=...`)

### Test Your Credentials
You can test if your App Password works by temporarily adding this to `server.js`:
```javascript
console.log('Email User:', process.env.EMAIL_USER);
console.log('Password length:', process.env.EMAIL_PASS?.length);
```

### Alternative: Use a Different Email Provider
If Gmail continues to cause issues, you can use:
- **Outlook/Hotmail**: `SMTP_HOST=smtp-mail.outlook.com`
- **Yahoo**: `SMTP_HOST=smtp.mail.yahoo.com`
- **Custom SMTP**: Any email service that provides SMTP access

## Security Note
- Never share your App Password
- Never commit your `.env` file to Git (it's already in `.gitignore`)
- Each App Password is unique - if you lose it, create a new one
