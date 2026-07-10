# Fix Your .env File

Your current `.env` file has formatting issues that are causing build errors. Please update it with the correct format:

## Current Issues:
1. `NEXT_PUBLIC_SITE_URL=alihamieh.com` - Missing `https://` protocol
2. `mongodb = mongodb+srv://...` - Wrong variable name and has spaces

## Correct .env Format:

```env
# Local secrets — gitignored. Copy the same keys into Vercel.

# Canonical site URL (production default: https://printslb.com)
# MUST include https://
NEXT_PUBLIC_SITE_URL=https://printslb.com

# Your admin password (min 8 characters)
ADMIN_PASSWORD=your-secret-password-min-8-chars

# Session signing for /admin
ADMIN_SESSION_SECRET=dbe68e23d85c0a8a3a476cee9b923122775de89128539c0770dd18746af6796d

# MongoDB Atlas — required for database storage
MONGODB_URI=mongodb+srv://alihamiehlb_db_user:YTR6fRrENRJZk5G0@portfolio.dsi4uop.mongodb.net/?appName=portfolio

# Paste from Vercel → Storage → Blob → Connect project → copy BLOB_READ_WRITE_TOKEN
BLOB_READ_WRITE_TOKEN=
```

## Key Changes:
- Changed `NEXT_PUBLIC_SITE_URL=alihamieh.com` to `NEXT_PUBLIC_SITE_URL=https://printslb.com`
- Changed `mongodb = mongodb+srv://...` to `MONGODB_URI=mongodb+srv://...`
- Removed spaces around the `=` sign
- Used correct variable name `MONGODB_URI`

## After Fixing:
1. Save the `.env` file
2. Run `npm run build` to test
3. If successful, commit and push changes
