# Safe GitHub push checklist

This ZIP is intended to be pushed to GitHub. Real local `.env` files, environment-specific secrets, dependencies, and build output are excluded. `.env.example` files are templates only.

## Before pushing
1. Keep your real `server/.env` and `client/.env.local` outside this ZIP/repository.
2. Open `.env.example` files and ensure they contain placeholders only.
3. Add production credentials later in Vercel Project Settings → Environment Variables; never put secrets in `VITE_*` variables.
4. If a real credential was ever committed or shared, rotate it in the provider dashboard. Deleting it from a later commit does not remove it from Git history.

## Push
Extract this ZIP, open the folder containing `vercel.json`, then:

```bash
git init
git add .
git status --short
git commit -m "Prepare CampusMart Pro for deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Check `git status --short` before committing and confirm no `.env` or credentials file is staged. Replace `YOUR_GITHUB_REPOSITORY_URL` with your own repository URL.
