# GitHub Setup Guide for PcJohncorp Website

This guide will help you push your code to GitHub and get a shareable link.

## 📁 Project Structure

```
pcjohncorp/
├── backend/          # Backend server (Node.js/Express)
│   ├── server.js
│   ├── package.json
│   └── .env (create this, not tracked in git)
├── frontend/         # Frontend files (HTML, CSS, JS, Images)
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── Images/
├── .gitignore
└── README.md
```

## 🚀 Quick Start Guide

### Step 1: Install Git (if not already installed)
- Download from: https://git-scm.com/downloads
- Verify installation: Open terminal and run `git --version`

### Step 2: Create a GitHub Account
1. Go to https://github.com
2. Sign up for a free account (if you don't have one)
3. Verify your email

### Step 3: Create a New Repository on GitHub
1. Log in to GitHub
2. Click the "+" icon in the top right → "New repository"
3. Repository name: `pcjohncorp-website` (or any name you prefer)
4. Description: "PcJohncorp - Solar, Electrical & Water Treatment Solutions Website"
5. Choose: **Public** (for shareable link) or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have files)
7. Click "Create repository"

### Step 4: Initialize Git in Your Project

Open PowerShell or Command Prompt in your project folder (`c:\Users\HP PC\Desktop\pcjohncorp`):

```powershell
# Initialize git repository
git init

# Add all files to staging
git add .

# Create your first commit
git commit -m "Initial commit: PcJohncorp website with frontend and backend separation"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/pcjohncorp-website.git

# Rename main branch (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 5: Get Your Shareable Link

After pushing, your code will be available at:
```
https://github.com/YOUR_USERNAME/pcjohncorp-website
```

## 🔄 Making Changes and Updating GitHub

Whenever you make changes to your code:

```powershell
# Check what files changed
git status

# Add all changes
git add .

# Commit with a message describing the changes
git commit -m "Description of your changes"

# Push to GitHub
git push
```

## 📝 Important Notes

### Environment Variables
1. Create a `.env` file in the `backend/` folder
2. Add your email credentials (this file is ignored by git for security):
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   RECEIVING_EMAIL=info@pcjohncorp.com
   PORT=3000
   ```

### Running the Project Locally

**Backend:**
```powershell
cd backend
npm install
npm start
```

**Frontend:**
- The backend server serves the frontend automatically
- Or use any static file server (like Live Server in VS Code)

### API Endpoint Configuration
The frontend `script.js` currently uses `http://localhost:3000/api/contact`. 
For production, you'll need to update this to your deployed backend URL.

## 🔐 GitHub Authentication

If you encounter authentication issues when pushing:

### Option 1: Personal Access Token (Recommended)
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Select scopes: `repo` (full control)
4. Copy the token
5. Use it as password when git asks for credentials

### Option 2: GitHub Desktop
- Download: https://desktop.github.com
- Easier GUI-based git operations

## 🌐 Deploying Your Website

To make your website live (optional):

1. **Backend**: Deploy to services like:
   - Heroku (free tier available)
   - Railway
   - Render
   - DigitalOcean

2. **Frontend**: Can be deployed to:
   - GitHub Pages (for static frontend only)
   - Netlify
   - Vercel
   - Your backend server (already configured)

## 📞 Need Help?

- Git documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com
- GitHub Desktop: https://desktop.github.com

---

**Note**: Make sure your `.env` file is in `.gitignore` and never commit sensitive information like passwords or API keys to GitHub!



