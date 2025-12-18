# PcJohncorp Website

Professional website for PcJohncorp - Solar, Electrical & Water Treatment Solutions.

## 🌟 Services

- **Solar Energy Solutions** - Custom solar panel installations for homes and businesses
- **Water Softener Solutions** - PURONICS water treatment systems for clean, soft water
- **Electrical Installation & Maintenance** - Professional electrical services

## 📁 Project Structure

```
pcjohncorp/
├── backend/          # Node.js/Express backend server
│   ├── server.js     # Main server file
│   ├── package.json  # Backend dependencies
│   └── .env          # Environment variables (create this)
├── frontend/         # Frontend application
│   ├── index.html    # Main HTML file
│   ├── styles.css    # Stylesheet
│   ├── script.js     # Frontend JavaScript
│   └── Images/       # Image assets
└── README.md         # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Git (for version control)

### Installation

1. **Clone the repository** (or download):
   ```bash
   git clone https://github.com/charlsmaxx/Pcjohncorp.git
   cd Pcjohncorp
   ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env` file in the `backend/` folder
   - Add your email credentials:
     ```
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     RECEIVING_EMAIL=info@pcjohncorp.com
     PORT=3000
     ```
   - See `EMAIL_SETUP.md` for detailed email configuration instructions

4. **Start the server**:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

5. **Open your browser**:
   - Navigate to `http://localhost:3000`
   - The frontend will be served automatically

## 🔧 Configuration

### Backend Configuration
- Server runs on port 3000 by default (configurable via PORT in .env)
- Contact form API endpoint: `/api/contact`
- Health check endpoint: `/api/health`

### Frontend Configuration
- Update API endpoint in `frontend/script.js` if backend URL changes
- Currently configured for `http://localhost:3000/api/contact`

## 📧 Contact Form Setup

The contact form uses Nodemailer to send emails. See `EMAIL_SETUP.md` or `GMAIL_SETUP.md` for detailed setup instructions.

**Quick Setup:**
1. Enable 2-Step Verification on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Add credentials to `.env` file

## 🛠️ Development

### Backend Development
- Main server file: `backend/server.js`
- Uses Express.js for routing
- CORS enabled for cross-origin requests

### Frontend Development
- Static files served from `frontend/` directory
- Responsive design with CSS media queries
- Dynamic hero image rotation
- Interactive FAQ section
- Smooth scrolling navigation

## 📦 Deployment

See `GITHUB_GUIDE.md` for instructions on:
- Pushing code to GitHub
- Deploying to hosting services
- Environment setup for production

### Static Hosting Options:

1. **Netlify** (Recommended)
   - Drag and drop the `frontend/` folder
   - Or connect GitHub repo for auto-deploy
   - Free SSL certificate included

2. **Vercel**
   - Connect GitHub repository
   - Automatic deployments on push
   - Free tier available

3. **GitHub Pages**
   - Push to `gh-pages` branch
   - Enable in repository settings
   - Free hosting

4. **Cloudflare Pages**
   - Connect GitHub repository
   - Free hosting with CDN

## 🔒 Security Notes

- Never commit `.env` files to version control
- `.gitignore` is configured to exclude sensitive files
- Use environment variables for all sensitive data

## 📄 License

Copyright © 2025 PcJohncorp. All rights reserved.

## 📞 Contact Information

- **Address**: 1209 Claro drive Manchester CT 06042
- **Phone**: +1 (347) 902-4742
- **Email**: info@pcjohncorp.com
- **Facebook**: [PcJohncorp Facebook Page](https://web.facebook.com/profile.php?id=61584862535793)
- **YouTube**: [PcJohncorp YouTube Channel](https://www.youtube.com/@Pcjohncorp/)

---

Built with ❤️ for PcJohncorp
