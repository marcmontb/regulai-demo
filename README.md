# RegulAI — AI-Powered Regulatory Affairs Platform

A demo platform showcasing AI-native capabilities for optimizing Regulatory Affairs (RA) processes in a chemical distribution company.

## Architecture

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Recharts, ReactFlow
- **Backend**: Python FastAPI with mock AI engine
- **i18n**: Bilingual support (English / Español) with real-time language switching

## Quick Start

### Frontend (Port 3000)

```bash
cd frontend
npm install
npm run dev
```

### Backend (Port 8000)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Platform Modules

### Active (Fully Interactive)

| # | Module | Description |
|---|--------|-------------|
| 1 | **Supplier Homologation** | AI-powered comparison of supplier questionnaires with anomaly detection, risk scoring, and incident management |
| 2 | **Client Questionnaires** | Automatic AI responses to client regulatory questionnaires with confidence scoring and PDF export |
| 3 | **Manufacturing Flowcharts** | AI generates consolidated manufacturing process flowcharts from supplier documentation |
| 4 | **REACH Dashboard** | Monitor REACH quotas, monthly consumption, year-over-year comparisons, and ECHA database integration |
| 5 | **Change Management** | Automated detection of regulatory/spec changes with client impact analysis and AI-drafted notifications |

### Coming Soon (Visual Preview)

| # | Module | Description |
|---|--------|-------------|
| 6 | Internal Homologation Record | Automated internal specification record management |
| 7 | Supplier Standardization | Standardized supplier qualification and scoring |
| 8 | SDS Data Extraction | AI extraction from Safety Data Sheets |
| 9 | FEED Requirements | Animal feed-specific homologation processes |

## Sample Data

The demo includes realistic (but fictional) data:

- **5 suppliers** across Germany, Singapore, France, USA, and Japan
- **8 materials** (Linalool, Limonene, Citral, Vanillin, Eugenol, Geraniol, Menthol, Cinnamaldehyde)
- **6 REACH substances** with 12-month consumption data
- **4 change records** with affected client matrices and AI-drafted notifications
- **3 manufacturing flowcharts** with detailed process conditions

## Design

- Color palette: Deep blue (#1e3a5f) + teal accent (#0d9488)
- All AI responses are simulated with realistic delays (no API keys required)
- No references to specific ERP systems or proprietary software

---

## Deploy to Netlify (free)

The demo runs entirely in the browser (no backend required for the demo). Deploy the frontend to Netlify:

1. **Push this repo to GitHub** (if not already).

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com) → Sign in → **Add new site** → **Import an existing project**.
   - Choose **GitHub** and select the repo. Netlify will use the root `netlify.toml`, which points to the `frontend` folder and runs `npm run build` with the Next.js plugin.

3. **Deploy**
   - Leave **Build command** and **Publish directory** as auto-detected (from `netlify.toml`).
   - Click **Deploy site**. The first build installs dependencies and builds the Next.js app (about 2–3 minutes).

4. **Result**
   - You get a URL like `https://your-site-name.netlify.app`. The full demo (dashboard, homologation, questionnaires, flowcharts, REACH, changes, and “Coming soon” pages) works with no extra configuration.

**Note:** The repo root must contain `netlify.toml` and the Next.js app must live in the `frontend` folder. If your app is at the repo root instead, move the contents of `frontend` to the root and set `base = "."` in `netlify.toml` (and remove the `base` line if you prefer).

---

## Deploy to Vercel (free, alternative)

Vercel is made for Next.js and is also free for personal/small projects:

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. Import your Git repo.
3. Set **Root Directory** to `frontend` (if the app is in a `frontend` subfolder).
4. Leave **Framework Preset** as Next.js and click **Deploy**.

You get a URL like `https://your-project.vercel.app`.
