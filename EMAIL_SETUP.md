# Email Setup Instructions

This guide will help you configure the contact form to send emails directly to your inbox.

## Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

## Step 2: Configure Email Settings

1. Create a `.env` file in the root directory (copy from `.env.example` if it exists, or create a new one)

2. Add your email configuration to the `.env` file:

```env
# Your email address (the one you'll use to send emails)
EMAIL_USER=your-email@gmail.com

# Your email password or app-specific password
EMAIL_PASS=your-app-password

# Email address where you want to receive contact form messages
RECEIVING_EMAIL=info@pcjohncorp.com

# SMTP Configuration (optional - defaults shown)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Server Port (optional - defaults to 3000)
PORT=3000
```

## Step 3: Gmail Setup (If using Gmail)

If you're using Gmail, you need to create an App Password:

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable it if not already enabled)
3. Go to **App passwords**: https://myaccount.google.com/apppasswords
4. Select "Mail" and "Other (Custom name)" and enter "PcJohncorp Contact Form"
5. Click "Generate" and copy the 16-character password
6. Use this password in your `.env` file as `EMAIL_PASS`

**Note:** You cannot use your regular Gmail password. You must use an App Password.

## Step 4: Other Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

### Custom SMTP Server
If you have your own email server or use a service like SendGrid, Mailgun, etc., update the SMTP settings accordingly.

## Step 5: Start the Server

Run the server:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Step 6: Test the Contact Form

1. Open your website in a browser
2. Fill out the contact form
3. Submit the form
4. Check your email inbox (the one specified in `RECEIVING_EMAIL`)

## Troubleshooting

### "Email server connection error"
- Check that your email credentials are correct
- For Gmail, make sure you're using an App Password, not your regular password
- Verify that 2-Step Verification is enabled (for Gmail)

### "Failed to send message"
- Check your internet connection
- Verify the SMTP settings match your email provider
- Check the server console for detailed error messages

### CORS Errors
- Make sure the server is running
- Check that the API URL in `script.js` matches your server URL
- If deploying, update the API URL to your production server

## Production Deployment

When deploying to production:

1. Update the API URL in `script.js` to point to your production server
2. Set environment variables on your hosting platform (Heroku, Vercel, etc.)
3. Make sure your `.env` file is not committed to version control (it's already in `.gitignore`)

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables on your hosting platform
- Consider using a dedicated email service (SendGrid, Mailgun) for production
- Enable rate limiting to prevent spam
