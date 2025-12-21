# PcJohncorp Website - Backend API

Backend server for PcJohncorp contact form with email functionality.

## 🚀 Features

- **Contact Form API** - Handles contact form submissions
- **Email Integration** - Sends emails via Nodemailer
- **CORS Enabled** - Supports cross-origin requests
- **Static File Serving** - Can serve frontend files
- **Health Check Endpoint** - Server status monitoring

## 📁 Project Structure

```
backend/
├── server.js      # Main server file
├── package.json   # Dependencies
└── .env           # Environment variables (create this)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/pcjohncorp-backend.git
   cd pcjohncorp-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env` file in the root directory
   - Add your email credentials:
     ```
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     RECEIVING_EMAIL=info@pcjohncorp.com
     PORT=3000
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     ```
   - See `EMAIL_SETUP.md` for detailed email configuration

4. **Start the server**:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

5. **Server will run on**: `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EMAIL_USER` | Your email address | Required |
| `EMAIL_PASS` | Email password or app password | Required |
| `RECEIVING_EMAIL` | Email to receive contact form messages | `EMAIL_USER` |
| `PORT` | Server port | `3000` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |

### API Endpoints

#### `POST /api/contact`
Handles contact form submissions.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "Hello, I'm interested in your services."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Your message has been sent successfully! We will get back to you soon."
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "Error message"
}
```

#### `GET /api/health`
Health check endpoint.

**Response (200):**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## 📧 Email Setup

The contact form uses Nodemailer to send emails. 

**Quick Gmail Setup:**
1. Enable 2-Step Verification on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Select "Mail" and your device
4. Copy the 16-character password
5. Add to `.env` file as `EMAIL_PASS`

**For other email providers:**
- Update `SMTP_HOST` and `SMTP_PORT` in `.env`
- See Nodemailer documentation for provider-specific settings

## 🌐 Deployment

### Recommended Platforms:

1. **Railway** (Recommended)
   - Connect GitHub repository
   - Automatic deployments
   - Free tier available
   - Easy environment variable setup

2. **Render**
   - Connect GitHub repository
   - Free tier available
   - Automatic SSL

3. **Heroku**
   - Git-based deployment
   - Free tier (limited hours)
   - Easy to set up

4. **DigitalOcean App Platform**
   - Git-based deployment
   - Pay-as-you-go pricing

5. **AWS/Google Cloud/Azure**
   - For production-scale applications
   - More configuration required

### Deployment Steps:

1. **Push code to GitHub**
2. **Connect to hosting platform**
3. **Set environment variables** in platform dashboard:
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `RECEIVING_EMAIL`
   - `PORT` (usually set automatically)
4. **Update frontend** with new backend URL

### CORS Configuration

If deploying frontend separately, update CORS settings in `server.js`:

```javascript
app.use(cors({
    origin: 'https://your-frontend-domain.com',
    credentials: true
}));
```

Or for multiple origins:
```javascript
app.use(cors({
    origin: ['https://your-frontend.com', 'https://www.your-frontend.com'],
    credentials: true
}));
```

## 🔒 Security Notes

- **Never commit `.env` files** - Already in `.gitignore`
- **Use App Passwords** - Don't use your regular email password
- **Enable HTTPS** - Always use SSL/TLS in production
- **Validate input** - Server validates all form inputs
- **Rate limiting** - Consider adding rate limiting for production

## 📞 Contact

- **Address**: 1209 Claro drive Manchester CT 06042
- **Phone**: +1 (347) 902-4742
- **Email**: info@pcjohncorp.com

## 📄 License

Copyright © 2025 PcJohncorp. All rights reserved.

---

Built with ❤️ for PcJohncorp






