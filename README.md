# AI Design Reconstructor — Vercel Deployment Guide

## Project Structure
```
design-reconstructor/
├── api/
│   └── reconstruct.js     ← Backend (calls Claude API securely)
├── public/
│   └── index.html         ← Frontend
├── package.json
├── vercel.json
└── README.md
```

---

## Deploy to Vercel (Step by Step)

### Step 1 — Create a GitHub repo
1. Go to https://github.com/new
2. Name it `ai-design-reconstructor`
3. Keep it **Private** (recommended — your API key is in environment variables, not code)
4. Click **Create repository**

### Step 2 — Upload these files
Upload the entire project folder to GitHub.
You can drag and drop the files in the GitHub web UI, or use Git:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ai-design-reconstructor.git
git push -u origin main
```

### Step 3 — Deploy on Vercel
1. Go to https://vercel.com and sign in (use GitHub login)
2. Click **"Add New Project"**
3. Import your `ai-design-reconstructor` repo
4. Leave all build settings as default
5. Click **"Deploy"** — wait ~1 minute

### Step 4 — Add your API Key (IMPORTANT)
1. In Vercel, go to your project → **Settings** → **Environment Variables**
2. Add this variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your Claude API key (get it from https://console.anthropic.com)
3. Click **Save**
4. Go to **Deployments** → click the 3 dots on your latest deploy → **Redeploy**

### Step 5 — Your app is live! 🎉
Vercel gives you a URL like: `https://ai-design-reconstructor.vercel.app`

---

## Get your Anthropic API Key
1. Go to https://console.anthropic.com
2. Sign up / log in
3. Go to **API Keys** → **Create Key**
4. Copy the key and paste it in Vercel environment variables

---

## How it Works
- Frontend (public/index.html) sends image to `/api/reconstruct`
- Backend (api/reconstruct.js) calls Claude API **server-side** (no CORS issues)
- Claude analyzes image and returns clean SVG
- Frontend displays result with Preview / Compare / Details tabs

## Notes
- Image size limit: ~5MB (Vercel free tier)
- Processing time: 10–30 seconds depending on image complexity
- Output: Scalable SVG (works at any print size)
