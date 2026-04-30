# GitHub Actions Setup Guide

This file explains how to enable and configure the GitHub Actions workflows for PingMe.

## Enable Actions

1. Open your GitHub repository.
2. Go to **Settings → Actions → General**.
3. Select **Allow all actions and reusable workflows**.
4. Save changes.

## Secrets Required

Add the following repository secrets depending on the platforms you want to deploy to.

### Netlify
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

### Vercel
- `VERCEL_TOKEN`

### Firebase
- `FIREBASE_SERVICE_ACCOUNT`
- `FIREBASE_PROJECT_ID`

### GitHub Pages
- No secrets required.
- Ensure `package.json` has the correct `homepage` URL for your repository.
- Use `npm run deploy` for manual deployment.

## Add Secrets via GitHub UI

1. Go to **Settings → Secrets and variables → Actions**.
2. Click **New repository secret**.
3. Enter the secret name and value.
4. Save.

## Add Secrets via GitHub CLI

```bash
gh secret set NETLIFY_AUTH_TOKEN -b "your_token_here"
gh secret set NETLIFY_SITE_ID -b "your_site_id_here"
gh secret set VERCEL_TOKEN -b "your_token_here"
gh secret set FIREBASE_SERVICE_ACCOUNT -b "$(cat firebase-service-account.json)"
gh secret set FIREBASE_PROJECT_ID -b "your_project_id"
```

## Workflow Files

- `.github/workflows/ci-cd.yml` — Lint, build, and test on every push and pull request.
- `.github/workflows/deploy-vercel.yml` — Deploy to Vercel on pushes to `main`/`develop`.
- `.github/workflows/deploy-firebase.yml` — Deploy to Firebase Hosting on `main`.
- `.github/workflows/deploy-github-pages.yml` — Deploy to GitHub Pages on `main`.

## Common Setup Issues

### Actions not running
- Ensure workflows are enabled in repository settings.
- Confirm workflow files are committed to `.github/workflows/`.
- Check branch names in `on:` settings.

### Secrets not loading
- Secret names are case-sensitive.
- Make sure values are not empty.
- After adding secrets, rerun the workflow.

## Recommended Workflow

1. Push feature branch to GitHub.
2. Open a pull request.
3. Verify `ci-cd.yml` runs successfully.
4. Merge into `main`.
5. Production deployment workflows run automatically.
