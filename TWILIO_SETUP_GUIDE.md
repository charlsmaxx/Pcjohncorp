# 📞 Twilio Automated Call Setup Guide

This guide will help you set up Twilio automated calls for your PcJohncorp website.

---

## Overview

With Twilio integration, visitors can click "Request a Call" on your contact form, and Twilio will automatically call them and connect them to your business phone number.

---

## Step 1: Sign Up for Twilio

1. **Go to**: https://www.twilio.com/try-twilio
2. **Click "Sign Up"** (or "Start Free Trial")
3. **Fill in your information**:
   - Email address
   - Password
   - Phone number for verification
4. **Verify your email** and phone number
5. **Complete the signup process**

**Note**: Twilio offers a free trial with $15.50 credit to get started.

---

## Step 2: Get Your Twilio Credentials

1. **Go to Twilio Console**: https://console.twilio.com
2. **Find your Account SID and Auth Token**:
   - On the dashboard, you'll see:
     - **Account SID**: Starts with `AC...`
     - **Auth Token**: Click "Show" to reveal it
3. **Copy both values** - you'll need them for Render

---

## Step 3: Get a Twilio Phone Number

1. **In Twilio Console**, go to **Phone Numbers** → **Manage** → **Buy a number**
2. **Click "Buy a number"**
3. **Select your country** (United States)
4. **Choose a number**:
   - You can search for specific area codes
   - Select a number that fits your business
5. **Click "Buy"** (uses your free trial credit)
6. **Copy the phone number** - format: `+1XXXXXXXXXX`

**Note**: This is the number that will call your customers. It will show as the caller ID.

---

## Step 4: Configure Your Business Phone Number

You need to set the phone number where calls will be forwarded (where you'll answer).

**For Testing**: Use your **verified phone number** (the one you used to sign up for Twilio). This is the phone number you verified during Twilio account setup.

**For Production**: Use your actual business phone number where you want to receive customer calls.

**Example**: If your business phone is `+1 (845) 404-1285`, format it as: `+18454041285` (no spaces, dashes, or parentheses)

**Note**: The verified phone number is fine for testing. Once you're ready for production, change it to your business phone number.

---

## Step 5: Set Environment Variables in Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click your service**: `pcjohncorp-backend`
3. **Go to "Environment" tab**
4. **Add these environment variables**:

```
TWILIO_ACCOUNT_SID=ACyour_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
YOUR_PHONE_NUMBER=+18454041285
BACKEND_URL=https://pcjohncorp-backend.onrender.com
```

**Important**:
- Replace `ACyour_account_sid_here` with your actual Account SID
- Replace `your_auth_token_here` with your actual Auth Token
- Replace `+1XXXXXXXXXX` with your Twilio phone number (the one you bought from Twilio)
- Replace `+18454041285` with:
  - **For Testing**: Your verified phone number (the one you used to sign up)
  - **For Production**: Your business phone number (formatted as shown, no spaces/dashes)

5. **Click "Save Changes"**
6. **Wait for Render to redeploy** (2-3 minutes)

---

## Step 6: Install Twilio Package (Already Done)

The Twilio package has been added to `package.json`. After pushing to GitHub, Render will automatically install it.

If you need to install locally:
```bash
cd backend
npm install
```

---

## Step 7: Test the Feature

1. **Go to your website**: https://www.pcjohncorp.com
2. **Scroll to the contact form**
3. **Fill in your name and phone number**
4. **Click "📞 Request a Call"**
5. **Answer your phone** when Twilio calls

---

## How It Works

1. **Visitor clicks "Request a Call"** on your website
2. **Backend receives the request** with name and phone number
3. **Twilio calls the visitor** using your Twilio phone number
4. **Twilio greets the visitor** with a message
5. **Twilio connects the call** to your business phone number
6. **You answer** and talk to the visitor

---

## Cost Information

### Twilio Pricing (US Numbers)

- **Phone Number**: ~$1.00/month
- **Outbound Calls**: ~$0.013/minute (1.3 cents per minute)
- **Inbound Calls**: ~$0.0085/minute (0.85 cents per minute)

**Example**: 
- 100 calls/month × 5 minutes = 500 minutes
- Cost: ~$6.50/month (500 × $0.013)

### Free Trial

- **$15.50 free credit** when you sign up
- Enough for testing and initial usage
- No credit card required for trial

---

## Troubleshooting

### "Call service is not configured" Error

**Problem**: Environment variables not set in Render

**Solution**:
1. Check Render → Environment tab
2. Verify all Twilio variables are set:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
   - `YOUR_PHONE_NUMBER`
3. Make sure no extra spaces or quotes
4. Redeploy after adding variables

### "Invalid phone number" Error

**Problem**: Phone number format is incorrect

**Solution**:
- Use format: `+1XXXXXXXXXX` (no spaces, dashes, parentheses)
- Example: `+18454041285`
- Must include country code (+1 for US)

### Call Not Connecting

**Problem**: TwiML endpoint not accessible

**Solution**:
1. Check `BACKEND_URL` is set correctly in Render
2. Verify the URL is: `https://pcjohncorp-backend.onrender.com`
3. Test the TwiML endpoint:
   ```
   https://pcjohncorp-backend.onrender.com/api/twiml?name=Test
   ```
   Should return XML response

### Call Goes to Voicemail

**Problem**: Your business phone not answering

**Solution**:
- Make sure `YOUR_PHONE_NUMBER` is correct
- Answer calls promptly
- Check if your phone blocks unknown numbers

---

## Advanced Configuration

### Customize Call Message

Edit `backend/server.js`, find the TwiML endpoint (`/api/twiml`), and modify the greeting:

```javascript
twiml.say({
    voice: 'alice',
    language: 'en-US'
}, `Hello ${name}, thank you for contacting PcJohncorp. Please hold while we connect you to our team.`);
```

### Change Voice

Available voices:
- `alice` (default) - Natural female voice
- `man` - Male voice
- `woman` - Female voice

### Add Call Recording (Optional)

In the TwiML endpoint, add:
```javascript
twiml.record({
    recordingStatusCallback: `${BACKEND_URL}/api/recording-callback`
});
```

---

## Security Notes

1. **Never commit credentials** to GitHub
2. **Use environment variables** in Render
3. **Rotate Auth Token** periodically
4. **Monitor usage** in Twilio Console
5. **Set spending limits** in Twilio Console

---

## Monitoring & Logs

### Check Call Logs

1. **Go to Twilio Console**: https://console.twilio.com
2. **Navigate to**: Phone Numbers → Logs → Calls
3. **View call history**, duration, and status

### Check Backend Logs

In Render → Logs, you'll see:
```
📞 Processing call request...
📞 Call details: {...}
✅ Call initiated successfully!
📞 Call SID: CA...
📞 Call Status: queued
```

---

## Quick Checklist

- [ ] Twilio account created
- [ ] Account SID and Auth Token copied
- [ ] Twilio phone number purchased
- [ ] Business phone number formatted correctly
- [ ] Environment variables set in Render:
  - [ ] `TWILIO_ACCOUNT_SID`
  - [ ] `TWILIO_AUTH_TOKEN`
  - [ ] `TWILIO_PHONE_NUMBER`
  - [ ] `YOUR_PHONE_NUMBER`
  - [ ] `BACKEND_URL`
- [ ] Render service redeployed
- [ ] Tested "Request a Call" button
- [ ] Received test call successfully

---

## Support

- **Twilio Support**: https://support.twilio.com
- **Twilio Docs**: https://www.twilio.com/docs
- **Twilio Console**: https://console.twilio.com

---

**Next Steps**: Set up your Twilio account, add the environment variables to Render, and test the feature!



