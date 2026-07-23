# AmnShield Site

Static marketing/documentation site for the AmnShield ecosystem, deployed on Firebase Hosting.

## Requirements

- Node.js 18+
- npm
- Firebase CLI (for deploys)

## Install

```bash
npm install
```

## Local development

Build Tailwind CSS in watch mode while editing pages:

```bash
npm run dev
```

## Production build

```bash
npm run build
```

This generates `assets/css/tailwind.css` from `assets/css/tailwind-input.css` using `tailwind.config.js`.

## Deploy

```bash
npm run deploy
```

If you prefer manual deployment:

```bash
npm run build
firebase deploy --only hosting:amnshield
```

