
# SnapSave Backend - ALL IN ONE

Supported: TikTok, YouTube, Instagram, Facebook

## Render.com par Deploy (Recommended)
1. Is ZIP ko GitHub repo me upload karo
2. render.com > New Web Service > Repo connect
3. Build: npm install, Start: npm start
4. Deploy -> URL milega: https://snapsave-backend.onrender.com

## Replit par
1. Replit > Node.js Repl > Files upload
2. Run dabao -> URL milega

## Android App Usage
POST https://YOUR_URL/api/process
Body: { "url": "https://www.tiktok.com/..." }

Response data.download_url se video download karo
