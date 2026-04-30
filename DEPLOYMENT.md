# Deployment Guide

This guide shows how to deploy PingMe to multiple hosting platforms.

## 1. Netlify

### Option A: GitHub Integration

1. Create a Netlify account.
2. Connect your GitHub repository.
3. Set build command to `npm run build`.
4. Set publish directory to `dist`.
5. Add environment variables from `.env.production` in the Netlify site settings.
6. Deploy.

### Option B: Manual Deploy

```bash
npm run build
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Redirects

Create `netlify.toml` in the project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 2. Vercel

### GitHub Integration

1. Create a Vercel account.
2. Import your GitHub repository.
3. Set framework preset to **Vite**.
4. Set build command to `npm run build`.
5. Set output directory to `dist`.
6. Add environment variables from `.env.production`.
7. Deploy.

### CLI Deploy

```bash
npm install -g vercel
vercel login
vercel --prod
```

## 3. Firebase Hosting

### Setup

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```
2. Login:
```bash
firebase login
```
3. Initialize hosting:
```bash
firebase init hosting
```
4. When prompted:
- Select your Firebase project
- Set public directory to `dist`
- Choose `Yes` for single-page app

### Deploy

```bash
npm run build
firebase deploy
```

## 4. GitHub Pages

### Setup

1. In `package.json`, add the `homepage` field:
```json
"homepage": "https://yourusername.github.io/pingme"
```
2. Install `gh-pages`:
```bash
npm install --save-dev gh-pages
```
3. Add scripts:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```
4. Deploy:
```bash
npm run deploy
```

## 5. Docker

### Dockerfile

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Build and run

```bash
docker build -t pingme .
docker run -p 3000:3000 pingme
```

## 6. Environment Variables

### Local development
Copy `.env.example` to `.env.local`.

### Production
Use `.env.production` values or set environment variables via hosting provider.


## 7. Troubleshooting

### Build errors

```bash
rm -rf node_modules dist package-lock.json
npm install
npm run build
```

### Environment variables not taking effect
- Ensure env var names start with `VITE_`
- Restart the dev server
- Rebuild production

### GitHub Actions not triggering
- Confirm workflow files are in `.github/workflows/`
- Ensure repository Actions are enabled
- Check branch names in workflow triggers
