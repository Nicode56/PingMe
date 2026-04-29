# PingMe - Simple Reminder App

A React-based reminder application built with Vite that reminds you of tasks when you open the browser until they're completed.

## Environment Variables

This app supports configuration through environment variables. Copy `.env.example` to `.env.local` and customize as needed.

### Available Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_APP_NAME` | PingMe | The name displayed in the app header |
| `VITE_APP_VERSION` | 1.0.0 | Version string for the app |
| `VITE_SOUND_ENABLED` | true | Enable/disable reminder sound notifications |
| `VITE_SHARE_ENABLED` | true | Enable/disable reminder sharing functionality |
| `VITE_TIME_REMINDERS_ENABLED` | true | Enable/disable time-based reminders |
| `VITE_MAX_REMINDERS` | 100 | Maximum number of reminders allowed |

### Example .env.local

```env
VITE_APP_NAME=PingMe (Dev)
VITE_APP_VERSION=1.0.0-dev
VITE_SOUND_ENABLED=true
VITE_SHARE_ENABLED=true
VITE_TIME_REMINDERS_ENABLED=true
VITE_MAX_REMINDERS=100
```

## Features

- ✅ Simple task reminders
- ✅ Time-based reminders (optional)
- ✅ Persistent alerts on browser open
- ✅ Snooze functionality (10 minutes)
- ✅ Share reminders via links
- ✅ Import shared reminders
- ✅ Sound notifications (configurable)
- ✅ Local storage persistence

## 🚀 Quick Start

### Option 1: Automated Setup
```bash
# Windows
setup.bat

# Mac/Linux
bash setup.sh
```

### Option 2: Manual
```bash
npm install && cp .env.example .env.local && npm run dev
```

## 🌐 Deployment

**All platforms supported with GitHub Actions CI/CD!**

- **[Netlify](DEPLOYMENT.md#netlify)** ✅ Auto-deploy
- **[Vercel](DEPLOYMENT.md#vercel)** ✅ Auto-deploy  
- **[Firebase](DEPLOYMENT.md#firebase-hosting)** ✅ Auto-deploy
- **[GitHub Pages](DEPLOYMENT.md#github-pages)** ✅ Auto-deploy
- **[Docker](DEPLOYMENT.md#docker-deployment)** & more

📖 **Full guide:** [DEPLOYMENT.md](DEPLOYMENT.md) | ⚙️ **CI/CD Setup:** [.github/ACTIONS_SETUP.md](.github/ACTIONS_SETUP.md)

## 📚 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to Netlify, Vercel, Firebase, GitHub Pages, AWS, Docker
- **[.github/ACTIONS_SETUP.md](.github/ACTIONS_SETUP.md)** - GitHub Actions CI/CD setup
- **[setup.sh / setup.bat](setup.sh)** - Automated project setup

## 🏗️ Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server  
- **ESLint** - Code quality
- **Web Audio API** - Sound notifications
- **Local Storage** - Data persistence

