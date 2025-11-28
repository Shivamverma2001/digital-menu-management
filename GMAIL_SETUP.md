# Gmail SMTP Setup Guide (Quick & Reliable)

This guide will help you set up Gmail SMTP to send verification codes. **This works immediately and emails will arrive in your inbox!**

## Why Gmail SMTP?

- ✅ **Free** - No cost
- ✅ **Works immediately** - No verification delays
- ✅ **Reliable delivery** - Emails go to inbox (not spam)
- ✅ **Easy setup** - 5 minutes
- ✅ **Perfect for 1 month** - No limits for your use case

## Step 1: Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Find **"2-Step Verification"** and click it
3. Follow the steps to enable it (you'll need your phone)

## Step 2: Generate App Password

1. Go to [Google Account App Passwords](https://myaccount.google.com/apppasswords)
   - Or: Google Account → Security → 2-Step Verification → App passwords
2. Select **"Mail"** as the app
3. Select **"Other (Custom name)"** as device
4. Type: **"Digital Menu App"**
5. Click **"Generate"**
6. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)
   - ⚠️ **You'll only see it once!** Save it now.

## Step 3: Add to .env File

Open your `.env` file and add these two lines:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

**Important:**
- Replace `your-email@gmail.com` with your actual Gmail address
- Replace `abcd efgh ijkl mnop` with the app password you just generated
- Remove spaces from the app password (or keep them, both work)

## Step 4: Restart Your Server

```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 5: Test It!

1. Go to your registration page
2. Enter your email
3. Click "Send Code"
4. **Check your inbox** - the email should arrive within seconds!

## Example .env File

```env
DATABASE_URL="your-database-url"
JWT_SECRET="your-jwt-secret"
GMAIL_USER=shivamverma2001sj@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Troubleshooting

### "Invalid login" error
- Make sure you're using the **App Password** (16 characters), not your regular Gmail password
- Make sure 2-Step Verification is enabled

### "Less secure app" error
- This shouldn't happen with App Passwords
- Make sure you're using App Password, not regular password

### Email not arriving
- Check spam folder (shouldn't happen with Gmail SMTP)
- Make sure Gmail account is not locked
- Check terminal for error messages

## That's It!

Once set up, Gmail SMTP will be used automatically. The system will:
1. Try Gmail SMTP first (most reliable)
2. Fall back to SendGrid if Gmail not configured

**Your emails will now arrive in the inbox!** 🎉

