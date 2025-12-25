# 🚀 Moving Backend to Separate Repository

This guide will help you move your backend code to a new, separate GitHub repository.

## Prerequisites

- GitHub account
- Git installed on your computer
- Backend code ready in `backend/` folder

---

## Step 1: Create New GitHub Repository

1. **Go to GitHub**: https://github.com/new
2. **Repository name**: `pcjohncorp-backend` (or your preferred name)
3. **Description**: `Backend API server for PcJohncorp website`
4. **Visibility**: 
   - **Private** (recommended for backend with API keys)
   - **Public** (if you want it open source)
5. **DO NOT** check any boxes (no README, .gitignore, or license)
6. Click **"Create repository"**

## Step 2: Copy Repository URL

After creating, GitHub will show you the repository URL. **Copy it** - you'll need it in Step 4.

Example: `https://github.com/charlsmaxx/pcjohncorp-backend.git`

---

## Step 3: Initialize Backend Repository

Run these commands in your terminal:

```powershell
# Navigate to backend folder
cd "c:\Users\HP PC\Desktop\pcjohncorp\backend"

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Backend API server"

# Rename branch to main (if needed)
git branch -M main
```

## Step 4: Connect to GitHub and Push

Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME` with your actual values:

```powershell
# Add remote repository (use the URL from Step 2)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/pcjohncorp-backend.git

# Push to GitHub
git push -u origin main
```

**Example:**
```powershell
git remote add origin https://github.com/charlsmaxx/pcjohncorp-backend.git
git push -u origin main
```

---

## Step 5: Update Render Deployment

After pushing to the new repository:

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click on your backend service**: `pcjohncorp-backend`
3. **Go to Settings tab**
4. **Under "Build & Deploy"**:
   - Click **"Connect GitHub"** if not already connected
   - Select the **new repository**: `pcjohncorp-backend`
   - Update the **Root Directory** (if needed): Leave empty or set to `/`
   - Update **Build Command**: `npm install` (or leave default)
   - Update **Start Command**: `npm start`
5. **Save Changes**
6. Render will automatically redeploy from the new repository

---

## Step 6: Update Frontend API URL

After your backend is deployed on Render, update the frontend:

1. **Get your Render backend URL**: 
   - Example: `https://pcjohncorp-backend.onrender.com`

2. **Update `frontend/script.js`**:
   - Find line 54: `const PRODUCTION_API_URL = 'YOUR_BACKEND_URL';`
   - Replace with: `const PRODUCTION_API_URL = 'https://pcjohncorp-backend.onrender.com';`

3. **Commit and push frontend changes**:
   ```powershell
   cd "c:\Users\HP PC\Desktop\pcjohncorp"
   git add frontend/script.js
   git commit -m "Update backend API URL to new repository deployment"
   git push origin main
   ```

---

## Step 7: (Optional) Remove Backend from Main Repo

If you want to remove the `backend/` folder from the main repository:

```powershell
# Navigate to main repo
cd "c:\Users\HP PC\Desktop\pcjohncorp"

# Remove backend folder from git (keeps local files)
git rm -r --cached backend

# Commit the removal
git commit -m "Move backend to separate repository"

# Push changes
git push origin main
```

**Note**: This removes the backend from the main repo but keeps the files on your computer. You can delete the `backend/` folder manually after confirming everything works.

---

## ✅ Verification Checklist

- [ ] New GitHub repository created
- [ ] Backend code pushed to new repository
- [ ] Render connected to new repository
- [ ] Render deployment successful
- [ ] Frontend API URL updated
- [ ] Contact form tested and working
- [ ] (Optional) Backend removed from main repository

---

## 🆘 Troubleshooting

### "Repository not found" error
- Check that you used the correct repository URL
- Verify you have access to the repository
- Make sure the repository exists on GitHub

### "Authentication failed"
- You may need to use a Personal Access Token instead of password
- GitHub Settings → Developer settings → Personal access tokens → Generate new token
- Use the token as your password when pushing

### Render deployment fails
- Check that the repository is connected correctly
- Verify the build command: `npm install`
- Verify the start command: `npm start`
- Check Render logs for specific errors

### Frontend can't connect to backend
- Verify the backend URL in `frontend/script.js` is correct
- Check CORS settings in `backend/server.js`
- Verify the backend is running on Render
- Check browser console for specific error messages

---

## 📝 Notes

- The backend is now in its own repository, making it easier to manage separately
- You can deploy the backend independently of the frontend
- Environment variables on Render remain the same - no need to reconfigure
- The frontend will continue to work once you update the API URL

---

**Need help?** Check the Render logs or contact support.






