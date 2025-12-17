# PcJohncorp Website - Frontend

Professional frontend website for PcJohncorp - Solar, Electrical & Water Treatment Solutions.

## 🌟 Services

- **Solar Energy Solutions** - Custom solar panel installations for homes and businesses
- **Water Softener Solutions** - PURONICS water treatment systems for clean, soft water
- **Electrical Installation & Maintenance** - Professional electrical services

## 📁 Project Structure

```
frontend/
├── index.html    # Main HTML file
├── styles.css    # Stylesheet
├── script.js     # Frontend JavaScript
└── Images/       # Image assets
```

## 🚀 Getting Started

### Option 1: Using the Backend Server (Recommended)

The backend server can serve these frontend files automatically.

1. Clone and set up the backend repository
2. The backend serves this frontend folder
3. Visit `http://localhost:3000`

### Option 2: Standalone Static Server

You can serve this frontend with any static file server:

**Using VS Code Live Server:**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js http-server:**
```bash
npx http-server -p 8000
```

## 🔧 Configuration

### API Endpoint

The frontend communicates with the backend API. Update the API URL in `script.js`:

```javascript
// Current default (line ~45)
const response = await fetch('http://localhost:3000/api/contact', {
```

**For Production:**
Change to your deployed backend URL:
```javascript
const response = await fetch('https://your-backend-url.com/api/contact', {
```

Or use environment-based configuration:
```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://your-backend-url.com';
const response = await fetch(`${API_BASE_URL}/api/contact`, {
```

## 🛠️ Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dynamic Hero Section** - Rotating images (solar and water treatment)
- **Interactive FAQ** - Expandable questions and answers
- **Smooth Scrolling** - Navigation with smooth scroll animations
- **Contact Form** - Integrated contact form with validation
- **Modern UI/UX** - Clean, professional design

## 📦 Deployment

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

## 🔗 Backend Integration

This frontend requires the backend API for the contact form to work. Make sure:

1. Backend is deployed and accessible
2. CORS is enabled on the backend
3. Update `script.js` with the correct backend URL
4. Backend endpoint: `POST /api/contact`

## 📞 Contact Information

- **Address**: 1209 Claro drive Manchester CT 06042
- **Phone**: +1 (347) 902-4742
- **Email**: info@pcjohncorp.com
- **Facebook**: [PcJohncorp Facebook Page](https://web.facebook.com/profile.php?id=61584862535793)

## 📄 License

Copyright © 2025 PcJohncorp. All rights reserved.

---

Built with ❤️ for PcJohncorp
