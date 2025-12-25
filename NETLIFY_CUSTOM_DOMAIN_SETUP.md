# 🌐 Connect Netlify to Custom Domain (pcjohncorp.com)

Quick guide to connect your Netlify site to your custom domain.

---

## Step 1: Add Domain to Netlify

1. **Go to Netlify Dashboard**: https://app.netlify.com
2. **Click on your site**: `stately-rabanadas-726bf5`
3. **Go to "Domain settings"** (left sidebar)
4. **Click "Add custom domain"**
5. **Enter your domain**: `pcjohncorp.com`
6. **Click "Verify"**
7. **Click "Add domain"**

---

## Step 2: Get DNS Records from Netlify

After adding the domain, Netlify will show you DNS records to add:

1. **In Domain settings**, you'll see:
   - **A Record** or **CNAME Record**
   - **DNS Target** (something like `75.2.60.5` or `stately-rabanadas-726bf5.netlify.app`)

2. **Copy these values** - you'll need them in Step 3

**Example:**
- **Type**: A Record
- **Name**: `@` (or leave blank/root)
- **Value**: `75.2.60.5`
- **TTL**: 3600 (or default)

**For www subdomain:**
- **Type**: CNAME
- **Name**: `www`
- **Value**: `stately-rabanadas-726bf5.netlify.app`
- **TTL**: 3600

---

## Step 3: Update DNS at Your Domain Provider

### If using GoDaddy:

1. **Log in to GoDaddy**: https://www.godaddy.com
2. **Go to "My Products"** → **"DNS"** (next to your domain)
3. **Find "Records" section**
4. **Add/Edit records**:

   **For root domain (pcjohncorp.com):**
   - **Type**: A
   - **Name**: `@` (or leave blank)
   - **Value**: `75.2.60.5` (from Netlify)
   - **TTL**: 3600
   - **Save**

   **For www (www.pcjohncorp.com):**
   - **Type**: CNAME
   - **Name**: `www`
   - **Value**: `stately-rabanadas-726bf5.netlify.app` (from Netlify)
   - **TTL**: 3600
   - **Save**

### If using Namecheap:

1. **Log in to Namecheap**: https://www.namecheap.com
2. **Go to "Domain List"** → Click **"Manage"** next to your domain
3. **Go to "Advanced DNS" tab**
4. **Add records**:

   **For root domain:**
   - **Type**: A Record
   - **Host**: `@`
   - **Value**: `75.2.60.5` (from Netlify)
   - **TTL**: Automatic
   - **Save**

   **For www:**
   - **Type**: CNAME Record
   - **Host**: `www`
   - **Value**: `stately-rabanadas-726bf5.netlify.app` (from Netlify)
   - **TTL**: Automatic
   - **Save**

### If using Cloudflare:

1. **Log in to Cloudflare**: https://dash.cloudflare.com
2. **Select your domain**
3. **Go to "DNS"** → **"Records"**
4. **Add records**:

   **For root domain:**
   - **Type**: A
   - **Name**: `@`
   - **IPv4 address**: `75.2.60.5` (from Netlify)
   - **Proxy status**: DNS only (gray cloud)
   - **Save**

   **For www:**
   - **Type**: CNAME
   - **Name**: `www`
   - **Target**: `stately-rabanadas-726bf5.netlify.app` (from Netlify)
   - **Proxy status**: DNS only (gray cloud)
   - **Save**

### If using Google Domains:

1. **Log in to Google Domains**: https://domains.google.com
2. **Click on your domain**
3. **Go to "DNS"** tab
4. **Add custom records**:

   **For root domain:**
   - **Type**: A
   - **Name**: `@`
   - **Data**: `75.2.60.5` (from Netlify)
   - **TTL**: 3600
   - **Save**

   **For www:**
   - **Type**: CNAME
   - **Name**: `www`
   - **Data**: `stately-rabanadas-726bf5.netlify.app` (from Netlify)
   - **TTL**: 3600
   - **Save**

---

## Step 4: Wait for DNS Propagation

1. **DNS changes take 5 minutes to 48 hours** (usually 15-30 minutes)
2. **Check status in Netlify**:
   - Go to **Domain settings**
   - You'll see "DNS configuration detected" when ready
3. **Netlify will automatically issue SSL certificate** (HTTPS)

---

## Step 5: Verify Domain is Working

1. **Wait for Netlify to show "DNS configuration detected"**
2. **Check SSL certificate**:
   - Netlify automatically provisions SSL (Let's Encrypt)
   - Should show "SSL certificate active" in Domain settings
3. **Test your domain**:
   - Visit: `https://pcjohncorp.com`
   - Visit: `https://www.pcjohncorp.com`
   - Both should load your site

---

## Step 6: Update Domain References in Code

After your domain is working, update references in your code:

### 1. Update Frontend (script.js, index.html, etc.)

**Find and replace:**
- `https://stately-rabanadas-726bf5.netlify.app` → `https://pcjohncorp.com`

**Files to update:**
- `frontend/script.js` (if any hardcoded URLs)
- `frontend/index.html` (meta tags, canonical URLs)
- `frontend/robots.txt`
- `frontend/sitemap.xml`

### 2. Update Backend CORS (server.js)

**In `backend/server.js`**, update the `allowedOrigins` array:

```javascript
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8000',
    'https://pcjohncorp.com',        // Add this
    'https://www.pcjohncorp.com',   // Add this
    'https://stately-rabanadas-726bf5.netlify.app', // Keep for now
    process.env.FRONTEND_URL
].filter(Boolean);
```

### 3. Update Render Environment Variables

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Open your service**: `pcjohncorp-backend`
3. **Go to Environment tab**
4. **Update `FRONTEND_URL`**:
   - Change from: `https://stately-rabanadas-726bf5.netlify.app`
   - Change to: `https://pcjohncorp.com`
5. **Save Changes**

---

## Step 7: Set Primary Domain (Optional)

1. **In Netlify Domain settings**
2. **Click "Options"** next to `pcjohncorp.com`
3. **Click "Set as primary domain"**
4. This makes `pcjohncorp.com` the main domain (redirects www to non-www or vice versa)

---

## ✅ Checklist

- [ ] Domain added to Netlify
- [ ] DNS records added at domain provider
- [ ] DNS propagation complete (Netlify shows "DNS configuration detected")
- [ ] SSL certificate active
- [ ] Site loads at `https://pcjohncorp.com`
- [ ] Site loads at `https://www.pcjohncorp.com`
- [ ] Frontend code updated with new domain
- [ ] Backend CORS updated
- [ ] Render environment variables updated
- [ ] Contact form tested with new domain

---

## 🆘 Troubleshooting

### Domain not working after 30 minutes?

1. **Check DNS records** are correct at your provider
2. **Verify DNS propagation**: https://www.whatsmydns.net
   - Enter `pcjohncorp.com`
   - Should show Netlify IP addresses
3. **Clear browser cache** and try again
4. **Check Netlify logs** for any errors

### SSL certificate not issued?

1. **Wait 24 hours** - Netlify automatically provisions SSL
2. **Check Domain settings** in Netlify
3. **Verify DNS is pointing to Netlify** correctly

### www not redirecting?

1. **In Netlify Domain settings**
2. **Set primary domain** (Step 7 above)
3. **Choose redirect preference** (www to non-www or vice versa)

---

## 📝 Notes

- **Netlify automatically handles HTTPS** - no manual SSL setup needed
- **Both www and non-www work** - you can set one as primary
- **Old Netlify URL still works** - you can keep it or remove it
- **DNS changes can take up to 48 hours** - be patient

---

**Need help?** Check Netlify's domain documentation: https://docs.netlify.com/domains-https/custom-domains/




