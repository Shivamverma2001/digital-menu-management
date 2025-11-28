# SendGrid Setup - Detailed Step-by-Step Guide

## Step 1: Sign Up for SendGrid

1. Go to: https://sendgrid.com
2. Click **"Start for free"** or **"Sign Up"** button (usually top right)
3. Fill in:
   - Email address
   - Password
   - Or sign up with GitHub/Google
4. Verify your email address (check inbox)

---

## Step 2: Complete Account Setup

After signing up, you might see:
- Welcome screen
- Account setup form
- Just fill in basic info and continue

---

## Step 3: Navigate to API Keys

**There are multiple ways to get to API Keys:**

### Method 1: From Dashboard (Most Common)
1. After logging in, you'll see the **SendGrid Dashboard**
2. Look at the **left sidebar menu**
3. Click on **"Settings"** (usually has a gear icon ⚙️)
4. Under Settings, click **"API Keys"**

### Method 2: Direct URL
1. Go directly to: https://app.sendgrid.com/settings/api_keys
2. This takes you straight to API Keys page

### Method 3: From Top Navigation
1. Look at the **top navigation bar**
2. Find **"Settings"** dropdown
3. Click it and select **"API Keys"**

### What You Should See:
- A page titled "API Keys" or "API Key Management"
- A button that says **"Create API Key"** (usually green or blue)
- A list of existing API keys (if any)

---

## Step 4: Create API Key

1. **Click the "Create API Key" button**
   - Usually green/blue, prominent on the page
   - Might be at top right or center

2. **A modal/popup will appear** with options:

3. **API Key Name:**
   - Enter: `Digital Menu App`
   - Or any name you prefer

4. **API Key Permissions:**
   You'll see options like:
   - **"Full Access"** - Can do everything (easiest for development)
   - **"Restricted Access"** - Choose specific permissions
   
   **For Restricted Access, select:**
   - ✅ Mail Send (required)
   - You can leave others unchecked for now

5. **Click "Create & View"** or **"Create API Key"** button

---

## Step 5: Copy Your API Key

**IMPORTANT:** After clicking "Create & View":

1. **A modal will show your API key**
   - It starts with `SG.` followed by random characters
   - Example: `SG.abcdefghijklmnopqrstuvwxyz1234567890`

2. **Copy the entire key immediately:**
   - Click the copy button (📋 icon) next to the key
   - Or select all and copy (Cmd+C / Ctrl+C)

3. **Save it somewhere safe:**
   - Paste it in a text file temporarily
   - You'll add it to `.env` file next

4. **Click "Done"** or close the modal

**⚠️ WARNING:** 
- You can only see the full key ONCE
- If you lose it, you'll need to create a new one
- The key shown is the only time you'll see it completely

---

## Step 6: Verify Sender Identity

Before you can send emails, SendGrid needs to verify you own the email address:

1. **Go to Settings → Sender Authentication**
   - Left sidebar → Settings → Sender Authentication
   - Or direct URL: https://app.sendgrid.com/settings/sender_auth

2. **Click "Verify a Single Sender"**
   - Green button on the page

3. **Fill in the form:**
   - **From Name:** Your name (e.g., "Shivam")
   - **From Email:** Your email (e.g., `believemesv2001@gmail.com`)
   - **Reply To:** Same email
   - **Company:** (optional)
   - **Address:** (optional for testing)

4. **Click "Create"**

5. **Check your email inbox:**
   - SendGrid will send a verification email
   - Click the verification link in the email
   - Your sender is now verified!

---

## Step 7: Update Your .env File

1. **Open your `.env` file** in the project root

2. **Add these lines:**
   ```env
   SENDGRID_API_KEY="SG.your_actual_key_here"
   EMAIL_FROM="believemesv2001@gmail.com"
   ```

3. **Replace:**
   - `SG.your_actual_key_here` with your actual API key
   - `believemesv2001@gmail.com` with your verified email

4. **Save the file**

---

## Step 8: Restart Your Server

1. **Stop your current server** (Ctrl+C in terminal)
2. **Start it again:**
   ```bash
   npm run dev
   ```

---

## Troubleshooting

### Can't Find API Keys Section?
- Make sure you're logged in
- Try the direct URL: https://app.sendgrid.com/settings/api_keys
- Look for "Settings" in the left sidebar

### Don't See "Create API Key" Button?
- You might need to complete account verification first
- Check if there's a banner asking you to verify your account
- Some accounts need phone verification

### API Key Doesn't Work?
- Make sure you copied the ENTIRE key (starts with SG.)
- Check for extra spaces when pasting
- Make sure the key is in quotes in `.env` file

### Can't Send Emails?
- Make sure you verified your sender email (Step 6)
- Check that `EMAIL_FROM` matches your verified email
- Wait a few minutes after verification

---

## Alternative: If SendGrid UI Looks Different

SendGrid sometimes updates their interface. If you can't find something:

1. **Use the search bar** (usually at top)
   - Type "API Keys" and search
   - Type "Settings" and search

2. **Check the help documentation:**
   - https://docs.sendgrid.com/ui/account-and-settings/api-keys

3. **Contact SendGrid support** (they're helpful!)

---

## Quick Checklist

- [ ] Signed up for SendGrid account
- [ ] Verified email address
- [ ] Found Settings → API Keys
- [ ] Created API key with name "Digital Menu App"
- [ ] Copied the API key (starts with SG.)
- [ ] Verified sender identity (your email)
- [ ] Added SENDGRID_API_KEY to .env file
- [ ] Updated EMAIL_FROM in .env file
- [ ] Restarted server

---

**Once you complete these steps, you'll be able to send verification codes to ANY email address!** 🎉

