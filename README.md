# Trivia Murder Party - Supabase Edition 🎯

This is a mobile-friendly, real-time multiplayer trivia game inspired by Jackbox's Trivia Murder Party.

## 🚀 Features
- Multiplayer via Supabase with live syncing
- Minigames (like Hunting Season)
- Trivia questions via external APIs or backups
- Game phases (Lobby, Questions, Minigames, Final Round)
- One-click deploy to Netlify or Vercel

## 📦 Deploy Instructions

### ✅ One-click Deploy (Netlify)
1. Fork this repo to your GitHub account.
2. Go to [Netlify](https://netlify.com) and connect your GitHub.
3. Choose this repo to deploy.
4. Done! Your game is live and updated on each GitHub push.

### ✅ One-click Deploy (Vercel)
1. Fork this repo to your GitHub account.
2. Go to [Vercel](https://vercel.com) and import your repo.
3. Set the root as `/` and deploy.
4. Done!

## 🔧 Supabase Setup

You must create the required tables in Supabase.
Use the SQL below in your Supabase SQL Editor:

```sql
-- See game setup script in instructions.
```