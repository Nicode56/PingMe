# PingMe Deployment Guide

Complete instructions for deploying PingMe to various platforms.

## Quick Start

```bash
# 1. Build the app
npm run build

# 2. Test production build locally
npm run preview

# 3. Deploy the `dist` folder to your platform
```

---

## GitHub Pages

### Setup (One-time)

1. **Enable GitHub Pages in repository settings:**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main (or your default branch)

2. **Update package.json:**
   ```json
   {
     "homepage": "https://yourusername.github.io/pingme"
   }
   ```

3. **Install gh-pages package:**
   ```bash
   npm install --save-dev gh-pages
   ```

4. **Add deploy scripts to package.json:**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

### Deploy

```bash
npm run deploy
```

Your app will be live at: `https://yourusername.github.io/pingme`

---

## Netlify

### Method 1: Connect GitHub (Recommended)

1. **Create `netlify.toml` in project root:**
   ```toml
   [build]
   command = "npm run build"
   publish = "dist"

   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   ```

2. **Push to GitHub**

3. **Visit [netlify.com](https://netlify.com):**
   - Click "New site from Git"
   - Select your GitHub repository
   - Auto-detect settings (Netlify will use netlify.toml)
   - Click "Deploy site"

4. **Set environment variables:**
   - Go to Site Settings → Build & deploy → Environment
   - Add your `.env.production` variables

### Method 2: Manual Deploy

```bash
npm run build
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

---

## Vercel

### Method 1: Connect GitHub (Recommended)

1. **Visit [vercel.com](https://vercel.com)** and sign in with GitHub

2. **Import project:**
   - Click "Add New" → "Project"
   - Select your repository
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables:**
   - In project settings, add variables from `.env.production`

4. **Deploy** - Vercel auto-deploys on push

### Method 2: CLI Deploy

```bash
npm install -g vercel
vercel
```

---

## Firebase Hosting

### Setup

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase:**
   ```bash
   firebase login
   firebase init hosting
   ```

   When prompted:
   - Public directory: `dist`
   - Single-page app: Yes

3. **Create `firebase.json`:**
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

### Deploy

```bash
npm run build
firebase deploy
```

Your app will be live at: `https://your-project.firebaseapp.com`

---

## AWS Amplify

### Setup

1. **Install Amplify CLI:**
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

2. **Initialize Amplify:**
   ```bash
   amplify init
   ```

3. **Add hosting:**
   ```bash
   amplify add hosting
   ```

### Deploy

```bash
amplify publish
```

---

## Docker Deployment

### Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Create `.dockerignore`:

```
node_modules
npm-debug.log
dist
.git
.gitignore
```

### Build and run:

```bash
docker build -t pingme .
docker run -p 3000:3000 pingme
```

---

## Environment Variables by Platform

### GitHub Pages / Netlify / Vercel / Firebase

Add these in your platform's environment settings:

```
VITE_APP_NAME=PingMe
VITE_APP_VERSION=1.0.0
VITE_SOUND_ENABLED=true
VITE_SHARE_ENABLED=true
VITE_TIME_REMINDERS_ENABLED=true
VITE_MAX_REMINDERS=100
```

---

## CI/CD Pipeline

GitHub Actions workflow is configured in `.github/workflows/deploy.yml`

It automatically:
- Runs tests on every push
- Builds production bundle
- Deploys to your platform on merge to main

---

## Troubleshooting

### Build fails
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment variables not loading
- Ensure variables are prefixed with `VITE_`
- Rebuild after changing env variables
- Check platform's environment variable settings

### App shows 404 after deployment
- Ensure SPA redirect is configured (see platform-specific instructions)
- Check that `dist/index.html` exists in build

### Large bundle size
```bash
npm install --save-dev vite-plugin-compression
# Add to vite.config.js for compression
```

---

## Monitoring

Add monitoring to production:

### Sentry (Error tracking)
```bash
npm install --save @sentry/react @sentry/tracing
```

### Google Analytics
```bash
npm install --save gtag.js
```

See `package.json` for optional dependency management.
