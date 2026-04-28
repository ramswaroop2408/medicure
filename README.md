# MedCare Pro - B2B Healthcare SaaS Platform

A modern healthcare management dashboard built with React, TypeScript, Zustand, and Firebase Authentication.

## Features

- **Authentication** — Firebase Auth with demo/fallback mode
- **Dashboard** — Stats overview, patient trend charts, recent patients
- **Analytics** — Interactive charts (Area, Bar, Pie) with tab navigation
- **Patient Management** — Grid/List toggle, search, responsive design
- **Notifications** — Service Worker push/local notifications
- **State Management** — Zustand for global app state
- **Responsive** — Mobile-friendly sidebar, adaptive layouts

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 18 + TypeScript |
| State | Zustand |
| Auth | Firebase Authentication |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router v6 |

## Getting Started

```bash
# Install dependencies
npm install

# (Optional) Configure Firebase — copy .env.example to .env and fill in values
# The app works in demo mode without real Firebase credentials

# Start development server
npm start
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Auth/          # ProtectedRoute
│   ├── Layout/        # AppLayout, Sidebar, Header
│   └── Patients/      # PatientGrid, PatientList
├── config/            # Firebase configuration
├── contexts/          # AuthContext (React Context)
├── data/              # Mock data
├── pages/             # Page components
│   ├── Login/
│   ├── Dashboard/
│   ├── Analytics/
│   └── Patients/
├── store/             # Zustand store
├── types/             # TypeScript interfaces
└── utils/             # Notification helpers
public/
├── sw.js              # Service Worker
└── manifest.json      # PWA manifest
```

## Demo Mode

The app includes a fallback demo mode. If Firebase isn't configured, enter any valid email and a 6+ character password (or click "Try Demo Account") to explore the full UI.

## Available Scripts

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
