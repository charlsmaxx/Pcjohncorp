# Email Connection Troubleshooting Guide

## Current Issue: Connection Timeout

Your email connection is timing out because DNS is resolving `smtp.gmail.com` to an incorrect IP address (`192.178.223.109`), which is not a valid Gmail SMTP server.

## Solutions

### Solution 1: Fix DNS Resolution (Recommended)

The DNS is resolving to an incorrect IP. Try one of these:

**Option A: Use Google's Public DNS**
1. Open Control Panel → Network and Internet → Network and Sharing Center
2. Click on your active connection
3. Click Properties → Internet Protocol Version 4 (TCP/IPv4) → Properties
4. Select "Use the following DNS server addresses"
5. Set:
   - Preferred DNS server: `8.8.8.8`
   - Alternate DNS server: `8.8.4.4`
6. Click OK and restart your computer

**Option B: Use IP Address Directly (Temporary Fix)**
Edit your `.env` file and add:
```
SMTP_HOST=74.125.195.108
```
(Note: This is a temporary fix - IPs can change)

### Solution 2: Check Firewall/Antivirus

Your firewall or antivirus might be blocking outbound SMTP connections:

1. **Windows Firewall:**
   - Open Windows Defender Firewall
   - Click "Allow an app or feature"
   - Check if Node.js or your terminal is allowed
   - If not, add it

2. **Antivirus Software:**
   - Check your antivirus settings
   - Temporarily disable it to test
   - Add Node.js to the exception list

3. **Corporate/Network Firewall:**
   - If you're on a corporate network, contact IT
   - Ports 587 and 465 may be blocked

### Solution 3: Use Gmail OAuth2 (More Complex)

If SMTP is blocked, you can use OAuth2 authentication instead of App Passwords. This requires additional setup.

### Solution 4: Use Alternative Email Service

Consider using:
- **SendGrid** (free tier available)
- **Mailgun** (free tier available)
- **Amazon SES** (free tier available)

These services typically have better deliverability and fewer firewall issues.

### Solution 5: Test from Different Network

Try running the server from:
- A different Wi-Fi network
- Mobile hotspot
- Different location

This will help determine if it's a network-specific issue.

## Quick Test Commands

Test DNS resolution:
```powershell
nslookup smtp.gmail.com 8.8.8.8
```

Test port connectivity:
```powershell
Test-NetConnection smtp.gmail.com -Port 587
Test-NetConnection smtp.gmail.com -Port 465
```

## Next Steps

1. Try Solution 1 first (fix DNS)
2. Restart your computer after changing DNS
3. Restart the server: `node server.js`
4. Test the email again

If none of these work, you may need to use an alternative email service or contact your network administrator.




