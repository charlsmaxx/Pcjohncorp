# 🌐 Connect Netlify to Namecheap Domain (pcjohncorp.com)

Step-by-step guide for Namecheap users.

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

After adding the domain:

1. **In Netlify Domain settings**, you'll see DNS configuration
2. **Look for**:
   - **A Record** for root domain (usually shows an IP like `75.2.60.5`)
   - **CNAME Record** for www (shows `stately-rabanadas-726bf5.netlify.app`)

3. **Copy these values** - you'll need them for Namecheap

**Example values:**
- **A Record IP**: `75.2.60.5` (your actual IP will be different)
- **CNAME Target**: `stately-rabanadas-726bf5.netlify.app`

---

## Step 3: Update DNS in Namecheap

### 3.1 Log in to Namecheap

1. **Go to**: https://www.namecheap.com
2. **Click "Sign In"** (top right)
3. **Enter your credentials**

### 3.2 Access Domain Management

1. **Go to "Domain List"** (from account dashboard)
2. **Find `pcjohncorp.com`** in your domain list
3. **Click "Manage"** button next to your domain

### 3.3 Go to Advanced DNS

1. **Click on "Advanced DNS" tab** (at the top)
2. **Scroll down to "Host Records" section**

### 3.4 Add A Record for Root Domain

1. **In "Host Records" section**, click **"Add New Record"**
2. **Select Type**: `A Record`
3. **Fill in**:
   - **Host**: `@` (this means root domain - pcjohncorp.com)
   - **Value**: `75.2.60.5` (use the IP from Netlify - yours will be different)
   - **TTL**: `Automatic` (or `30 min`)
4. **Click the checkmark** (✓) to save

### 3.5 Add CNAME Record for www

1. **Click "Add New Record"** again
2. **Select Type**: `CNAME Record`
3. **Fill in**:
   - **Host**: `www`
   - **Value**: `stately-rabanadas-726bf5.netlify.app` (from Netlify)
   - **TTL**: `Automatic` (or `30 min`)
4. **Click the checkmark** (✓) to save

### 3.6 Remove Conflicting Records (if any)

**Important**: If you see any existing A or CNAME records for `@` or `www`, you should:
- **Delete them** (click the trash icon)
- **Or edit them** to use Netlify's values

**Common records to check:**
- Any A record with Host `@` pointing to a different IP
- Any CNAME record with Host `www` pointing elsewhere

---

## Step 4: Verify DNS Records

After adding records, your Namecheap DNS should look like this:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | `75.2.60.5` | Automatic |
| CNAME Record | www | `stately-rabanadas-726bf5.netlify.app` | Automatic |

**Note**: The IP address (`75.2.60.5`) is an example - use the actual IP from Netlify.

---

## Step 5: Wait for DNS Propagation

1. **DNS changes take 5 minutes to 48 hours** (usually 15-30 minutes for Namecheap)
2. **Check status in Netlify**:
   - Go back to **Netlify Domain settings**
   - You'll see "DNS configuration detected" when ready
   - Status will change from "Pending" to "Active"

3. **Verify DNS propagation** (optional):
   - Go to: 
   - Enter `pcjohncorp.com`
   - Should show Netlify IP addresses after propagation

---

## Step 6: SSL Certificate (Automatic)

1. **Netlify automatically provisions SSL** (Let's Encrypt)
2. **Takes 5-30 minutes** after DNS is detected
3. **Check in Netlify Domain settings**:
   - Should show "SSL certificate active"
   - HTTPS will be enabled automatically

---

## Step 7: Test Your Domain

After DNS propagates and SSL is active:

1. **Visit**: `https://pcjohncorp.com`
2. **Visit**: `https://www.pcjohncorp.com`
3. **Both should load your site** with HTTPS

---

## Step 8: Set Primary Domain (Optional)

1. **In Netlify Domain settings**
2. **Click "Options"** (three dots) next to `pcjohncorp.com`
3. **Click "Set as primary domain"**
4. **Choose redirect preference**:
   - **www to non-www**: `www.pcjohncorp.com` → `pcjohncorp.com`
   - **non-www to www**: `pcjohncorp.com` → `www.pcjohncorp.com`

---

## ✅ Namecheap-Specific Checklist

- [ ] Logged into Namecheap account
- [ ] Opened "Advanced DNS" for pcjohncorp.com
- [ ] Added A Record: Host `@`, Value = Netlify IP
- [ ] Added CNAME Record: Host `www`, Value = Netlify site URL
- [ ] Removed any conflicting DNS records
- [ ] Saved all changes in Namecheap
- [ ] Waited for DNS propagation (15-30 minutes)
- [ ] Verified "DNS configuration detected" in Netlify
- [ ] SSL certificate active in Netlify
- [ ] Site loads at `https://pcjohncorp.com`
- [ ] Site loads at `https://www.pcjohncorp.com`

---

## 🆘 Troubleshooting for Namecheap

### DNS not updating after 1 hour?

1. **Double-check records in Namecheap**:
   - Make sure Host `@` has the correct IP
   - Make sure Host `www` has the correct CNAME
   - Check for typos

2. **Clear DNS cache**:
   - Windows: Open Command Prompt → `ipconfig /flushdns`
   - Mac: `sudo dscacheutil -flushcache`
   - Or use: https://1.1.1.1/help (Cloudflare DNS)

3. **Check DNS propagation**: https://www.whatsmydns.net

### "DNS configuration detected" not showing in Netlify?

1. **Wait longer** - Namecheap DNS can take up to 30 minutes
2. **Verify records are correct** in Namecheap
3. **Check for conflicting records** (old A/CNAME records)
4. **Make sure you're using the correct Netlify IP** (check Netlify domain settings)

### SSL certificate not issued?

1. **Wait 24 hours** - Netlify automatically provisions SSL
2. **Make sure DNS is pointing to Netlify** correctly
3. **Check Domain settings** in Netlify for any errors

### www subdomain not working?

1. **Verify CNAME record** is correct in Namecheap
2. **Make sure Host is exactly `www`** (not `www.` or anything else)
3. **Wait for DNS propagation** (can take up to 30 minutes)

---

## 📝 Namecheap-Specific Notes

- **TTL**: Use "Automatic" or "30 min" - don't set it too high
- **Host `@`**: This represents the root domain (pcjohncorp.com)
- **Changes save immediately** in Namecheap, but DNS propagation takes time
- **No need to change nameservers** - keep using Namecheap's nameservers
- **Both www and non-www work** - you can set one as primary in Netlify

---

## 🎯 Quick Reference

**Namecheap DNS Settings:**
- **A Record**: `@` → Netlify IP (e.g., `75.2.60.5`)
- **CNAME Record**: `www` → Netlify site URL (e.g., `stately-rabanadas-726bf5.netlify.app`)

**Netlify Domain Settings:**
- Shows the exact IP and CNAME values you need
- Shows DNS status ("Pending" → "Active")
- Shows SSL certificate status

---

**Need help?** 
- Namecheap Support: https://www.namecheap.com/support/
- Netlify Support: https://www.netlify.com/support/




