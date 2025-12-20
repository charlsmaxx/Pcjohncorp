# Quick Start - Push to GitHub

## 🚀 Fastest Way to Push Your Code

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `pcjohncorp-website`
3. Choose **Public** or **Private**
4. Click "Create repository"
5. **DO NOT** check any boxes (README, .gitignore, license)

### Step 2: Copy These Commands

Open PowerShell in your project folder (`c:\Users\HP PC\Desktop\pcjohncorp`):

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: PcJohncorp website"

# Add GitHub repository (REPLACE YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/pcjohncorp-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Your Shareable Link

After pushing, your code will be at:
```
https://github.com/YOUR_USERNAME/pcjohncorp-website
```

### 🔄 Update Code Later

```powershell
git add .
git commit -m "Your update description"
git push
```

---

**Note**: Make sure you create a `.env` file in the `backend/` folder with your email credentials (this won't be uploaded to GitHub for security).




