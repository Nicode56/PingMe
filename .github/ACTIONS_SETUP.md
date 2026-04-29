# GitHub Actions Setup Guide

This guide explains how to set up and configure the CI/CD workflows for PingMe.

## Available Workflows

### 1. CI/CD Pipeline (`ci-cd.yml`)
Runs on every push and pull request.

**Features:**
- ESLint validation
- Build testing
- Runs unit tests
- Automatic deployment to Netlify on main branch
- PR preview comments

**Trigger:** Push to `main` or `develop`, Pull requests

### 2. Vercel Deployment (`deploy-vercel.yml`)
Deploys to Vercel hosting.

**Trigger:** Push to `main` or `develop`

### 3. Firebase Deployment (`deploy-firebase.yml`)
Deploys to Firebase Hosting.

**Trigger:** Push to `main`

### 4. GitHub Pages Deployment (`deploy-github-pages.yml`)
Deploys to GitHub Pages.

**Trigger:** Push to `main`

---

## Setup Instructions

### General Setup

1. **Ensure workflows are enabled:**
   - Go to your repository
   - Settings → Actions → General
   - Ensure "All actions and reusable workflows" is selected

2. **Add repository secrets:**
   - Settings → Secrets and variables → Actions
   - Add the secrets from the table below

---

## Platform-Specific Setup

### Netlify

**Required Secrets:**
- `NETLIFY_AUTH_TOKEN` - Your Netlify personal access token
- `NETLIFY_SITE_ID` - Your site ID from Netlify

**Get tokens:**
1. Visit [app.netlify.com](https://app.netlify.com)
2. User settings → Applications → Personal access tokens
3. Create new token, copy it
4. Go to Site settings → Build & deploy → Environment variables
5. Find your Site ID in Site overview

**Add to GitHub:**
```
NETLIFY_AUTH_TOKEN=your_token_here
NETLIFY_SITE_ID=your_site_id_here
```

### Vercel

**Required Secrets:**
- `VERCEL_TOKEN` - Your Vercel API token

**Get token:**
1. Visit [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Create new token
3. Copy token value

**Add to GitHub:**
```
VERCEL_TOKEN=your_token_here
```

### Firebase

**Required Secrets:**
- `FIREBASE_SERVICE_ACCOUNT` - Service account JSON
- `FIREBASE_PROJECT_ID` - Your Firebase project ID

**Get service account:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Project settings → Service accounts
3. Click "Generate New Private Key"
4. Copy the JSON content

**Add to GitHub:**
```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...entire JSON...}
FIREBASE_PROJECT_ID=your-project-id
```

### GitHub Pages

**Required Setup:**
1. Repository must be public (or use GitHub Pro)
2. Settings → Pages → Source: GitHub Actions
3. No additional secrets needed (uses built-in GitHub token)

---

## Manual Secret Management

### Add a secret via GitHub CLI:

```bash
gh secret set SECRET_NAME -b "secret_value"
```

### Add secrets from `.env.production`:

```bash
gh secret set VITE_APP_NAME -b "PingMe"
gh secret set VITE_SOUND_ENABLED -b "true"
```

---

## Workflow Status

Check workflow runs:
- Go to Actions tab in your repository
- See all workflow runs and their status
- Click on a run to see detailed logs

---

## Troubleshooting

### Build fails in GitHub Actions

**Check logs:**
1. Go to Actions tab
2. Click on failed workflow run
3. Expand job steps to see errors

**Common issues:**
- Missing secrets → Add to repository secrets
- Wrong Node version → Check `.github/workflows/*.yml`
- Dependency issues → Run `npm ci` (not `npm install`)

### Deployment not triggering

- Verify workflow file syntax (valid YAML)
- Check branch name matches workflow condition (`main` vs `master`)
- Ensure workflow file is in `.github/workflows/` directory
- Commit must be on the specified branch

### Secrets not loading

- Case-sensitive: ensure names match exactly
- Verify secret value is not empty
- Try removing and re-adding the secret
- GitHub might need 5-10 minutes to fully propagate

---

## Environment Variables in Workflows

Add to your workflow files to use environment-specific variables:

```yaml
env:
  VITE_APP_NAME: PingMe
  VITE_SOUND_ENABLED: 'true'
  VITE_MAX_REMINDERS: '100'
```

Or pass them as secrets (preferred):

```yaml
env:
  VITE_APP_NAME: ${{ secrets.VITE_APP_NAME }}
```

---

## Customization

### Change trigger branches:

In any workflow file, modify:
```yaml
on:
  push:
    branches: [main, staging]  # Add or remove branches
```

### Run only on specific paths:

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'package.json'
```

### Schedule workflows:

```yaml
on:
  schedule:
    - cron: '0 9 * * MON'  # Every Monday at 9 AM
```

---

## Monitoring & Notifications

### GitHub Notifications

- GitHub emails on workflow failures by default
- Customize in Settings → Notifications

### Slack Integration

Add to `.github/workflows/ci-cd.yml`:

```yaml
- name: Notify Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Build failed on ${{ github.ref }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Next Steps

1. Choose your deployment platform (Netlify, Vercel, Firebase, or GitHub Pages)
2. Add required secrets to GitHub repository
3. Push changes to trigger workflows
4. Monitor Actions tab for build status
5. Workflows will auto-deploy on success

For platform-specific help, see `DEPLOYMENT.md`
