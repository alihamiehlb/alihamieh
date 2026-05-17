# alihamieh

Personal portfolio for **Ali Hamieh** — projects, certificates, CV, and contact.

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Framer Motion** — scroll sections and UI motion
- **React Three Fiber** + **Three.js** — background 3D scene
- **Node scripts** — sync CV PDFs, GitHub repos, certificates into `content/`
- **Vercel** — hosting; optional **Vercel Blob** for admin content saves

## Commands

```bash
npm install
npm run dev          # local http://localhost:3000
npm run dev:lan      # same Wi‑Fi: http://YOUR_PC_IP:3000
npm run build        # production build
```

## Environment (optional)

Copy `.env.example` → `.env.local` for `/admin` only. Never commit real passwords.

| Variable | Purpose |
|----------|---------|
| `ADMIN_PASSWORD` | Admin login |
| `ADMIN_SESSION_SECRET` | Session cookie signing |
| `BLOB_READ_WRITE_TOKEN` | Persist admin edits on Vercel |

## Deploy

Connect this repo on [Vercel](https://vercel.com), framework **Next.js**, add env vars above for admin + Blob.
