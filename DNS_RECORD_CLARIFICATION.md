# 🔍 DNS Record Clarification: resend._domainkey

## Quick Answer

**Use `resend._domainkey` EXACTLY as Resend provides - DO NOT change it to "@"**

---

## Understanding DNS Records for Resend

Resend requires different types of DNS records, each with a specific purpose:

### 1. Domain Verification (TXT Record)
- **Type**: TXT
- **Host**: `@` (represents root domain: pcjohncorp.com)
- **Value**: `resend-domain-verification=abc123xyz...`
- **Purpose**: Verifies you own the domain

### 2. SPF Record (TXT Record)
- **Type**: TXT
- **Host**: `@` (represents root domain: pcjohncorp.com)
- **Value**: `v=spf1 include:resend.com ~all`
- **Purpose**: Authorizes Resend to send emails from your domain

### 3. DKIM Record (TXT Record) ⭐
- **Type**: TXT
- **Host**: `resend._domainkey` (subdomain - use EXACTLY as shown)
- **Value**: `p=MIGfMA0GCSqGSIb3DQEB...` (long public key starting with `p=`)
- **Purpose**: Email authentication (DKIM signing)

### 4. MX Record (Optional)
- **Type**: MX
- **Host**: `@` (represents root domain: pcjohncorp.com)
- **Value**: `feedback-smtp.resend.com`
- **Purpose**: Email feedback loop

---

## Why `resend._domainkey` Must Stay As-Is

### What It Creates

When you add a TXT record with host `resend._domainkey`, it creates:
- **Subdomain**: `resend._domainkey.pcjohncorp.com`
- This subdomain contains the DKIM public key for email authentication

### If You Change It to "@"

❌ **Wrong**: Changing `resend._domainkey` to `@` would:
- Try to create a CNAME for the root domain
- Conflict with other records
- Break DKIM authentication
- Prevent domain verification

### Correct Usage

✅ **Correct**: Use `resend._domainkey` exactly as Resend provides:
- Creates the proper subdomain
- Enables DKIM email authentication
- Works with Resend's infrastructure

---

## Namecheap Configuration

### For TXT Records (Verification & SPF):
```
Type: TXT Record
Host: @
Value: (copy from Resend)
TTL: Automatic
```

### For DKIM TXT Record:
```
Type: TXT Record
Host: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEB... (long public key from Resend)
TTL: Automatic
```

**Important**: 
- The Host field should be exactly `resend._domainkey`
- Do NOT include the domain name (Namecheap adds it automatically)
- Do NOT change it to `@`
- The Value is a long public key string - copy it completely from Resend

---

## Common Mistakes

### ❌ Mistake 1: Changing Host to "@"
```
Type: CNAME
Host: @  ← WRONG!
Value: resend._domainkey.resend.com
```
**Result**: Will conflict with other records and break DKIM

### ❌ Mistake 2: Using CNAME Instead of TXT
```
Type: CNAME Record  ← WRONG TYPE!
Host: resend._domainkey
Value: resend._domainkey.resend.com
```
**Result**: DKIM won't work - must be TXT with the public key

### ✅ Correct Configuration
```
Type: TXT Record
Host: resend._domainkey  ← CORRECT!
Value: p=MIGfMA0GCSqGSIb3DQEB... (long public key from Resend)
```

---

## Summary

| Record Type | Host Value | When to Use |
|------------|------------|-------------|
| TXT | `resend._domainkey` | DKIM authentication |
| TXT | `send` | SPF (sending authorization) |
| TXT | `_dmarc` | DMARC policy (optional) |
| MX | `send` | Email feedback for sending |
| MX | `@` | Email receiving (optional) |

**Key Points:**
1. ✅ Use `resend._domainkey` exactly as Resend provides
2. ✅ It's a TXT record containing the DKIM public key
3. ✅ It creates a subdomain for DKIM: `resend._domainkey.pcjohncorp.com`
4. ✅ The value is a long string starting with `p=` - copy it completely
5. ❌ Don't change the host to "@"

---

## Verification

After adding all records:

1. **Check in Resend**: Domain should show "Verified" status
2. **Check DNS propagation**: https://www.whatsmydns.net
   - Search for: `resend._domainkey.pcjohncorp.com`
   - Should show TXT record with the DKIM public key
3. **Wait 15-30 minutes** for DNS propagation

---

**Need help?** See `RESEND_DOMAIN_VERIFICATION.md` for complete setup guide.

