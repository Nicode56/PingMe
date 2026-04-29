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

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env.local` and configure as needed
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Open http://localhost:5173

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- React 19
- Vite
- ESLint with React Refresh plugin
- Web Audio API for sound notifications
- Local Storage for data persistence

