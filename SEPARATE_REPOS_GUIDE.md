# Guide: Separate Frontend and Backend Repositories

This guide explains how to push your frontend and backend to separate GitHub repositories for easier deployment.

## 📁 Current Structure

```
pcjohncorp/
├── frontend/       # Frontend files (separate repo)
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── Images/
│   ├── .gitignore
│   └── README.md
└── backend/        # Backend files (separate repo)
    ├── server.js
    ├── package.json
    ├── .gitignore
    └── README.md
```

## 🚀 Step-by-Step Instructions

### Part 1: Create Backend Repository

#### Step 1.1: Create Backend Repo on GitHub
1. Go to https://github.com/new
2. Repository name: `pcjohncorp-backend`
3. Description: "Backend API server for PcJohncorp website"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

#### Step 1.2: Push Backend Code

Open PowerShell in your project folder and run:

```powershell
# Navigate to backend folder
cd backend

# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: PcJohncorp backend API"

# Add GitHub repository (REPLACE YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/pcjohncorp-backend.git

# Rename to main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

**Backend Repository URL:**
```
https://github.com/YOUR_USERNAME/pcjohncorp-backend
```

---

### Part 2: Create Frontend Repository

#### Step 2.1: Create Frontend Repo on GitHub
1. Go to https://github.com/new
2. Repository name: `pcjohncorp-frontend`
3. Description: "Frontend website for PcJohncorp"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

#### Step 2.2: Push Frontend Code

Open PowerShell in your project folder and run:

```powershell
# Navigate to frontend folder
cd frontend

# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: PcJohncorp frontend website"

# Add GitHub repository (REPLACE YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/pcjohncorp-frontend.git

# Rename to main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

**Frontend Repository URL:**
```
https://github.com/YOUR_USERNAME/pcjohncorp-frontend
```

---

## 🔄 Updating Code Later

### Update Backend:

```powershell
cd backend
git add .
git commit -m "Your update description"
git push
```

### Update Frontend:

```powershell
cd frontend
git add .
git commit -m "Your update description"
git push
```

---

## 🌐 Deployment Benefits

### Frontend Deployment
Deploy to static hosting services:
- **Netlify** - Drag & drop or connect GitHub repo
- **Vercel** - Connect GitHub repo for auto-deploy
- **GitHub Pages** - Free static hosting
- **Cloudflare Pages** - Free with CDN

### Backend Deployment
Deploy to platform services:
- **Railway** - Easy setup, free tier
- **Render** - Free tier available
- **Heroku** - Git-based deployment
- **DigitalOcean** - App Platform

### Advantages:
✅ Independent version control  
✅ Separate deployment pipelines  
✅ Easier CI/CD setup  
✅ Different teams can work independently  
✅ Frontend can be cached on CDN  
✅ Backend can scale independently  

---

## 🔧 Configuration After Deployment

### 1. Update Frontend API URL

After deploying backend, update `frontend/script.js`:

```javascript
// Change from:
const response = await fetch('http://localhost:3000/api/contact', {

// To your deployed backend URL:
const response = await fetch('https://your-backend-url.com/api/contact', {
```

### 2. Update Backend CORS

After deploying frontend, update `backend/server.js` CORS settings:

```javascript
app.use(cors({
    origin: 'https://your-frontend-domain.com',
    credentials: true
}));
```

---

## 📝 Important Notes

1. **Environment Variables**: Create `.env` file in backend (never commit it)
2. **API URL**: Update frontend with deployed backend URL
3. **CORS**: Configure backend CORS to allow frontend domain
4. **Separate Commits**: Commit changes to each repo independently

---

## 🆘 Troubleshooting

### Git Authentication Issues
- Use Personal Access Token (see GITHUB_GUIDE.md)
- Or use GitHub Desktop for easier operations

### CORS Errors
- Make sure backend CORS allows your frontend domain
- Check that frontend API URL matches backend URL

### Environment Variables
- Backend `.env` file should never be committed
- Set environment variables in hosting platform dashboard

---

**Your repositories will be:**
- Frontend: `https://github.com/YOUR_USERNAME/pcjohncorp-frontend`
- Backend: `https://github.com/YOUR_USERNAME/pcjohncorp-backend`



