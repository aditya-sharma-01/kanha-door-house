# 🚀 How to Deploy Kanha Door House Web & ERP to Render

Your application is fully prepared and pre-configured for **1-click free deployment on Render.com**!

---

## ⚡ Option 1: 1-Click Static Site Deployment (Recommended & Free)

1. **Push your code to GitHub / GitLab**.
2. Log in to [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> **Static Site**.
4. Connect your GitHub/GitLab repository.
5. Fill in the following details:
   - **Name**: `kanha-door-house`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
6. Click **Advanced** -> **Add Rewrite Rule**:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - *(This ensures `/admin`, `/admin/dashboard`, and `/tech-portal` routes refresh cleanly).*
7. Click **Create Static Site**! 🎉

---

## 📦 Option 2: Render Blueprint Deployment (Automatic via `render.yaml`)

1. Push your repository containing `render.yaml`.
2. On Render Dashboard, click **New +** -> **Blueprint**.
3. Select your repository. Render will automatically detect `render.yaml` and configure your build command, publish directory, and routing rules instantly!

---

## 🖥️ Option 3: Node Web Service Deployment

If you prefer deploying as a Node.js Web Service:
- **Name**: `kanha-door-house`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start` *(runs `node server.js` on `process.env.PORT`)*

---

### ✅ Verified Pre-flight Configuration
- `render.yaml` created & validated.
- `server.js` SPA fallback route handler added.
- `package.json` build and start scripts updated.
- Production bundle compiled in 8.36s with zero errors.
