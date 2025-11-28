# Detailed Project Setup Guide

This guide will walk you through setting up the Digital Menu Management System from scratch.

---

## 📋 Prerequisites

Before starting, make sure you have:
- Node.js 18+ installed ([Download here](https://nodejs.org/))
- npm (comes with Node.js)
- A code editor (VS Code recommended)
- A web browser
- Internet connection

---

## Step 1: Verify Project Files

First, make sure you're in the project directory:

```bash
cd /Users/shivamvermasv/Documents/assignment
```

Check that all files are present:
```bash
ls -la
```

You should see:
- `package.json`
- `prisma/` folder
- `src/` folder
- `node_modules/` folder (after installing dependencies)

---

## Step 2: Install Dependencies

If you haven't already installed dependencies, run:

```bash
npm install
```

**What this does:**
- Downloads all required packages (Next.js, Prisma, tRPC, etc.)
- Automatically runs `prisma generate` to create Prisma client
- Takes 1-2 minutes depending on your internet speed

**Expected output:**
```
✔ Generated Prisma Client
up to date, audited 246 packages
```

---

## Step 3: Set Up PostgreSQL Database on Neon.com

### 3.1 Create Neon.com Account

1. **Go to Neon.com**
   - Visit: https://neon.com
   - Click "Sign Up" (top right)
   - You can sign up with:
     - GitHub account (recommended)
     - Google account
     - Email address

2. **Verify Your Email** (if using email signup)
   - Check your inbox
   - Click the verification link

### 3.2 Create a New Project

1. **After logging in**, you'll see the Neon dashboard
2. **Click "Create Project"** button (usually a green button)
3. **Fill in the project details:**
   - **Project name**: `digital-menu-db` (or any name you prefer)
   - **Region**: Choose closest to you (e.g., `US East (Ohio)`)
   - **PostgreSQL version**: Leave default (usually 15 or 16)
4. **Click "Create Project"**

### 3.3 Get Your Database Connection String

1. **After project creation**, you'll see the project dashboard
2. **Look for "Connection Details"** or "Connection String" section
3. **You'll see something like:**
   ```
   postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. **Click "Copy"** button next to the connection string
5. **Save this somewhere safe** - you'll need it in the next step

**Important Notes:**
- The connection string contains your password - keep it secure!
- If you lose it, you can reset the password in Neon dashboard
- The connection string format: `postgresql://user:password@host/database`

---

## Step 4: Set Up Resend (Email Service)

### 4.1 Create Resend Account

1. **Go to Resend.com**
   - Visit: https://resend.com
   - Click "Sign Up" (top right)
   - Sign up with:
     - GitHub (recommended)
     - Google
     - Email

2. **Verify Your Email** (if needed)

### 4.2 Create API Key

1. **After logging in**, you'll see the Resend dashboard
2. **Click "API Keys"** in the left sidebar
3. **Click "Create API Key"** button
4. **Fill in the details:**
   - **Name**: `Digital Menu App` (or any name)
   - **Permission**: Select "Sending access" (or "Full access" for development)
5. **Click "Add"**
6. **Copy the API key** - it starts with `re_` followed by random characters
   - Example: `re_1234567890abcdefghijklmnop`
   - **Important**: This is the only time you'll see the full key - save it!
7. **Click "Done"**

### 4.3 Set Up Email Domain (For Development)

**Option A: Use Resend Test Domain (Easiest for Development)**
- Resend provides a test domain: `onboarding@resend.dev`
- You can use this for testing without domain verification
- For production, you'll need to verify your own domain

**Option B: Verify Your Domain (For Production)**
1. Go to "Domains" in Resend dashboard
2. Click "Add Domain"
3. Follow the DNS verification steps
4. Once verified, you can use emails like `noreply@yourdomain.com`

**For now, use the test domain:**
- `EMAIL_FROM="noreply@resend.dev"` (or any email with @resend.dev)

---

## Step 5: Generate JWT Secret

You need a secure random string for JWT token signing. Run this command:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Example output:**
```
1f8596964afea02473c7bdc26f47e8e446c02c2e3377ef1b2d9f6063a6c66a69
```

**Copy this value** - you'll use it as `JWT_SECRET` in your `.env` file.

**Note:** You can generate a new one anytime, but changing it will log out all users.

---

## Step 6: Create .env File

### 6.1 Create the File

In your project root directory (`/Users/shivamvermasv/Documents/assignment`), create a file named `.env`:

```bash
touch .env
```

Or create it manually in your code editor.

### 6.2 Add Environment Variables

Open the `.env` file and add the following content:

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
# Replace with your Neon.com connection string
DATABASE_URL="postgresql://username:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require"

# ============================================
# AUTHENTICATION
# ============================================
# Replace with the JWT secret you generated in Step 5
JWT_SECRET="1f8596964afea02473c7bdc26f47e8e446c02c2e3377ef1b2d9f6063a6c66a69"

# ============================================
# EMAIL SERVICE (Resend)
# ============================================
# Replace with your Resend API key from Step 4
RESEND_API_KEY="re_your_actual_api_key_here"

# Email address to send from (use @resend.dev for testing)
EMAIL_FROM="noreply@resend.dev"

# ============================================
# APPLICATION URL
# ============================================
# For local development
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ============================================
# IMAGE UPLOAD (Optional)
# ============================================
# Leave empty for now, or add Vercel Blob token if you have one
# BLOB_READ_WRITE_TOKEN=""
```

### 6.3 Replace Placeholder Values

**Replace these values with your actual credentials:**

1. **DATABASE_URL**: Paste your Neon.com connection string
2. **JWT_SECRET**: Use the secret you generated (or generate a new one)
3. **RESEND_API_KEY**: Paste your Resend API key (starts with `re_`)
4. **EMAIL_FROM**: Use `noreply@resend.dev` for testing
5. **NEXT_PUBLIC_APP_URL**: Keep as `http://localhost:3000` for local development

### 6.4 Verify .env File

Your `.env` file should look something like this (with your actual values):

```env
DATABASE_URL="postgresql://myuser:mypassword@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="1f8596964afea02473c7bdc26f47e8e446c02c2e3377ef1b2d9f6063a6c66a69"
RESEND_API_KEY="re_AbCdEf1234567890GhIjKlMnOpQrStUvWxYz"
EMAIL_FROM="noreply@resend.dev"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Important:**
- Never commit `.env` file to git (it's already in `.gitignore`)
- Keep your credentials secure
- Don't share your `.env` file with anyone

---

## Step 7: Set Up Database Schema

Now that your database is configured, create all the tables:

```bash
npm run db:push
```

**What this does:**
- Connects to your Neon.com database
- Creates all tables (User, Restaurant, Category, Dish, etc.)
- Sets up relationships and indexes
- Takes 10-30 seconds

**Expected output:**
```
✔ Generated Prisma Client
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma

Your database is now in sync with your schema.

✔ Push completed successfully
```

**If you see errors:**
- **"Can't reach database server"**: Check your `DATABASE_URL` in `.env`
- **"Authentication failed"**: Verify your Neon.com password
- **"SSL required"**: Make sure your connection string includes `?sslmode=require`

---

## Step 8: Start Development Server

Start the Next.js development server:

```bash
npm run dev
```

**What this does:**
- Starts the Next.js development server
- Compiles TypeScript
- Sets up hot-reload (changes update automatically)
- Usually runs on port 3000

**Expected output:**
```
  ▲ Next.js 15.2.3
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

**Keep this terminal window open** - the server needs to keep running.

---

## Step 9: Open the Application

1. **Open your web browser**
2. **Navigate to:** http://localhost:3000
3. **You should see:**
   - The app redirects to `/login` page
   - Login/Register interface

---

## Step 10: Test the Application

### 10.1 Register a New User

1. **Click "Register"** or go to http://localhost:3000/register
2. **Enter your email address**
3. **Click "Send Verification Code"**
4. **Check your email inbox** (the email you used for Resend)
   - You should receive an email with a 6-digit code
   - If you don't see it, check spam folder
5. **Enter the verification code**
6. **Fill in:**
   - Full Name: Your name
   - Country Name: A valid country (e.g., "United States", "India", "United Kingdom")
7. **Click "Register"**
8. **You should be redirected to the dashboard**

### 10.2 Create Your First Restaurant

1. **In the dashboard**, click **"+ New Restaurant"**
2. **Fill in:**
   - Restaurant Name: e.g., "Super Restaurant"
   - Location: e.g., "Mumbai"
3. **Click "Create Restaurant"**
4. **You'll see the restaurant management page**

### 10.3 Add Categories

1. **Click "Manage Categories"** on the restaurant page
2. **Click "+ Add Category"**
3. **Enter category name:** e.g., "Starters"
4. **Click "Create"**
5. **Add more categories** like "Main Course", "Desserts", "Drinks"

### 10.4 Add Dishes

1. **Click "Manage Dishes"** on the restaurant page
2. **Click "+ Add Dish"**
3. **Fill in dish details:**
   - Name: e.g., "Aloo Tikki"
   - Image URL: (optional) Paste an image URL
   - Description: e.g., "Crispy potato patties"
   - Price: e.g., 90
   - Spice Level: Select 0-3
   - Dietary Type: Select Vegetarian or Non-Vegetarian
   - Categories: Check the categories this dish belongs to
4. **Click "Create Dish"**
5. **Add more dishes** to different categories

### 10.5 View Public Menu

1. **On the restaurant management page**, you'll see:
   - Menu URL: `http://localhost:3000/menu/[restaurant-id]`
   - QR Code image
2. **Click the Menu URL** or copy it and open in a new tab
3. **You should see:**
   - Beautiful menu interface
   - Categories as tabs
   - Dishes with images, prices, dietary indicators
   - Floating menu button (bottom right)
4. **Test the floating menu button:**
   - Click the pink "Menu" button
   - Category modal should open
   - Click a category to navigate

---

## Troubleshooting

### Problem: "Can't reach database server"

**Solution:**
1. Check your `DATABASE_URL` in `.env`
2. Make sure it includes `?sslmode=require`
3. Verify your Neon.com project is active
4. Try copying the connection string again from Neon dashboard

### Problem: "Failed to send verification code"

**Solution:**
1. Check your `RESEND_API_KEY` in `.env`
2. Verify the API key is correct (starts with `re_`)
3. Make sure you're using a valid email address
4. Check Resend dashboard for any errors

### Problem: "Invalid country name"

**Solution:**
- Use the exact country name from the list
- Examples: "United States", "United Kingdom", "India", "Canada"
- Check `src/server/utils/countries.ts` for the full list

### Problem: Port 3000 already in use

**Solution:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Problem: Prisma client not generated

**Solution:**
```bash
npx prisma generate
```

### Problem: Database schema out of sync

**Solution:**
```bash
npm run db:push
```

---

## Next Steps

Once everything is working:

1. **Add more restaurants** and menus
2. **Test QR code generation** - scan with your phone
3. **Test shared links** - send menu links to others
4. **Customize your menus** with images and descriptions
5. **Deploy to Vercel** when ready (see README.md for deployment guide)

---

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npm run db:push

# Start development server
npm run dev

# Open Prisma Studio (database GUI)
npm run db:studio

# Type check
npm run typecheck

# Build for production
npm run build
```

---

## Need Help?

If you encounter any issues:
1. Check the error message in the terminal
2. Verify all environment variables in `.env`
3. Make sure all services (Neon, Resend) are active
4. Check the browser console for client-side errors

---

**Congratulations!** 🎉 Your Digital Menu Management System is now set up and ready to use!

