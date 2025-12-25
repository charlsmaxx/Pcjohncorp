# 📧 How to Add MX Records in Namecheap

## The Problem

You're trying to add MX records for Resend, but you can't find the "MX Record" option when clicking "Add New Record" in Namecheap.

## Solution: Enable Custom MX First

Namecheap requires you to **enable "Custom MX" in Mail Settings** before MX records become available.

---

## Step-by-Step Instructions

### Step 1: Access Advanced DNS

1. **Log in to Namecheap**: https://www.namecheap.com
2. **Go to "Domain List"** (left sidebar)
3. **Find your domain**: `pcjohncorp.com`
4. **Click "Manage"** button
5. **Click "Advanced DNS" tab** (at the top)

### Step 2: Enable Custom MX

1. **Scroll down** to find **"Mail Settings"** section
   - This is usually near the **top** of the Advanced DNS page
   - It may be above the "Host Records" section

2. **Look for a dropdown menu** next to "Mail Settings"
   - It might say "Namecheap BasicDNS" or "Email Forwarding" by default

3. **Click the dropdown** and select **"Custom MX"**

4. **Click "Save All Changes"** or checkmark (if prompted)
   - Wait for confirmation that settings are saved

### Step 3: Add MX Records

Now you can add MX records:

1. **Scroll down to "Host Records" section** (or stay on the same page)

2. **Click "Add New Record"**

3. **Select Type**: You should now see **"MX Record"** as an option
   - If you still don't see it, refresh the page after saving Custom MX

4. **Fill in the MX record details**:
   - **Host**: `send` (from Resend)
   - **Value**: `feedback-smtp.eu-west-...` (copy from Resend)
   - **Priority**: `10` (copy from Resend)
   - **TTL**: `Automatic`

5. **Click checkmark (✓)** to save

---

## Visual Guide

### Mail Settings Section Location:

```
Advanced DNS Page
├── Mail Settings ← Find this section first!
│   └── [Dropdown: Select "Custom MX"]
│   └── [Save button]
│
├── Host Records ← Then add records here
│   ├── Add New Record
│   │   └── Type: MX Record (now available!)
│   └── ...
```

---

## Troubleshooting

### Still Don't See MX Record Option?

1. **Check Mail Settings**:
   - Make sure it's set to "Custom MX"
   - Click "Save All Changes" again
   - Refresh the page

2. **Look in Different Sections**:
   - Some Namecheap interfaces have MX records in a separate "Mail Records" section
   - Check if there's a "Mail" or "Email" tab

3. **Try Adding Other Records First**:
   - Add TXT records first (they're always available)
   - Then try adding MX records

4. **Browser Issues**:
   - Try refreshing the page (F5 or Ctrl+R)
   - Try a different browser
   - Clear browser cache

### Alternative: Contact Namecheap Support

If you still can't add MX records after enabling Custom MX:

1. **Contact Namecheap Support**: https://www.namecheap.com/support/
2. **Ask them to**: Enable Custom MX for your domain
3. **Or ask**: How to add MX records for `pcjohncorp.com`

---

## Quick Checklist

- [ ] Logged into Namecheap
- [ ] Opened Advanced DNS for `pcjohncorp.com`
- [ ] Found "Mail Settings" section
- [ ] Changed Mail Settings to "Custom MX"
- [ ] Saved changes
- [ ] Refreshed page (if needed)
- [ ] Clicked "Add New Record" in Host Records
- [ ] Selected "MX Record" type
- [ ] Added MX record with Host: `send`
- [ ] Saved the record

---

## Important Notes

1. **Custom MX is Required**: You cannot add MX records without first enabling Custom MX

2. **This Affects Email**: Setting to Custom MX means Namecheap's default email forwarding will be disabled (if you were using it)

3. **Multiple MX Records**: You can add multiple MX records - Resend may require 1-2 MX records

4. **Priority Matters**: Make sure to set the correct Priority value from Resend (usually `10`)

---

## Resend MX Records to Add

Based on your Resend configuration:

### MX Record for Sending:
```
Type: MX
Host: send
Value: feedback-smtp.eu-west-... (from Resend)
Priority: 10
TTL: Automatic
```

### MX Record for Receiving (if enabled):
```
Type: MX
Host: @
Value: inbound-smtp.eu-west-... (from Resend)
Priority: 9
TTL: Automatic
```

---

**Need more help?** See `RESEND_DOMAIN_VERIFICATION.md` for complete DNS setup guide.


