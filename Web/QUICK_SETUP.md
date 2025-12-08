# ⚡ Quick Setup Guide - Fix "Supabase client not initialized"

## The Problem
You're seeing "Supabase client not initialized" because you haven't added your Supabase credentials yet.

## The Solution (3 Steps)

### Step 1: Create Supabase Account & Project (2 minutes)

1. Go to **[https://supabase.com](https://supabase.com)**
2. Click **"Start your project"** → Sign up (free)
3. Create a **New Project**:
   - Name: `alnoor` (or anything you like)
   - Database Password: Create a strong password (save it!)
   - Region: Choose closest to you
4. Wait 1-2 minutes for project to be created

### Step 2: Get Your API Keys (1 minute)

1. In your Supabase project, click **⚙️ Settings** (bottom left)
2. Click **API** (under Project Settings)
3. Copy these **two values**:
   - **Project URL**: Something like `https://abcdefghijklmnop.supabase.co`
   - **anon public key**: A long string starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 3: Update Config File (1 minute)

1. Open `assets/js/supabase-config.js` in VS Code
2. Find these lines (around line 11-12):

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

3. Replace with your actual values:

```javascript
const SUPABASE_URL = 'https://abcdefghijklmnop.supabase.co';  // Your Project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDAwMDAwMCwiZXhwIjoxOTQ1NTc2MDAwfQ.example';  // Your anon key
```

4. **Save the file** (Ctrl+S)

### Step 4: Set Up Database (One-Time Setup)

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open `supabase/schema.sql` from your project folder
4. **Copy ALL the SQL code** and paste into Supabase SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

### Step 5: Test It!

1. **Refresh your login page** in the browser
2. Click "Create an account"
3. Fill in the form and submit
4. It should work now! ✅

---

## Still Not Working?

**Check the browser console** (F12) for error messages. Common issues:

- ❌ "Supabase JS library not loaded" → Make sure the script tag is in login.html
- ❌ "Invalid API key" → Double-check you copied the entire anon key (it's very long!)
- ❌ Still says "not configured" → Make sure you saved the config file and refreshed the page

---

## Need More Help?

See detailed instructions in `supabase/SETUP_INSTRUCTIONS.md`

