# TrustGuard AI - Production Deployment Guide

This guide outlines the production deployment of TrustGuard AI:
- **Backend**: FastAPI on [Render.com](https://render.com)
- **Frontend**: React + Vite on [Vercel](https://vercel.com)
- **Database & Storage**: [Supabase](https://supabase.com)

---

## 1. Backend Deployment to Render.com

### Option A: Render Blueprint (Recommended - 1-Click Setup)
1. Fork or push this repository to GitHub.
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repository.
5. Render will detect [`render.yaml`](file:///render.yaml) automatically and configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Python Version**: `3.11.8`
6. Fill in the requested Environment Variables:
   - `SUPABASE_URL`: `https://<your-project>.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key
   - `FRONTEND_URL`: `https://your-trustguard-app.vercel.app` (or `*` during initial testing)
7. Click **Apply**. Once deployed, copy your Render service URL (e.g., `https://trustguard-backend.onrender.com`).

### Option B: Manual Web Service
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Select your repository.
3. Configure the following fields:
   - **Name**: `trustguard-backend`
   - **Region**: Oregon (US West) or closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Under **Environment Variables**, add:
   - `PYTHON_VERSION`: `3.11.8`
   - `SUPABASE_URL`: `https://<your-project>.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key
   - `FRONTEND_URL`: `https://your-trustguard-app.vercel.app`
5. Click **Create Web Service**.

---

## 2. Frontend Deployment to Vercel

### Step 1: Connect Repository to Vercel
1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your TrustGuard AI Git repository.

### Step 2: Configure Project Settings
- **Framework Preset**: `Vite`
- **Root Directory**: `./` (leave default)
- **Build Command**: `vite build` (or `npm run build`)
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Add Environment Variables
Under the **Environment Variables** section, add:
- **`VITE_API_URL`**: `https://trustguard-backend.onrender.com` (use your actual Render backend URL)

### Step 4: Deploy
Click **Deploy**.
[`vercel.json`](file:///vercel.json) at the root ensures that:
- Single-page application (SPA) routes like `/analyze`, `/results`, `/trace`, and `/report` resolve to `/index.html` on direct reload or deep links.
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`) are added automatically.

---

## 3. Verify Full-Stack Integration

1. Visit your Vercel public URL: `https://your-trustguard-app.vercel.app`.
2. Inspect the top Navbar: The health indicator should pulse green with:
   - `INGRESS DEFENSE: ACTIVE`
   - `Connected DB: Supabase`
3. Navigate to `/analyze` and upload:
   - **Authentic Video/Photo**: Confirms `14% INGRESS PASSED`
   - **Deepfake Video/Document**: Confirms `84%+ BLOCKED AT INGRESS`
4. Inspect Network tab to verify calls to `https://trustguard-backend.onrender.com/api/analyze` and `api/health` return HTTP 200 with CORS headers.
