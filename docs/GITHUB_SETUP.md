# GitHub set-up and routine

## One-off set-up
1. Cloudflare dashboard, My Profile, API Tokens, Create Token. Use the "Edit Cloudflare Workers" template or a custom token with **Account / Cloudflare Pages / Edit**. Copy the token once.
2. Cloudflare dashboard, Workers & Pages: copy your **Account ID** from the right-hand side.
3. GitHub repository, Settings, Secrets and variables, Actions:
   - Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
   - Variables: `CF_PROJECT_DEV` (the DEV Pages project name) and `CF_PROJECT_PROD` (the PROD project name).
4. Branches: `main` is what is live; `dev` is what is being tested.

## Everyday routine
1. Work on `dev`. Each push runs every test; if they pass, the DEV site updates by itself.
2. Test on DEV.
3. When happy, merge `dev` into `main` (a pull request, then Merge).
4. Actions tab, "Deploy to PROD", Run workflow, type PROD. It re-runs the tests and uploads the `main` version to the live site.

## Safety
- PROD never updates by itself.
- Secrets are never in the code. If a token leaks, delete it in Cloudflare and make a new one.

## Deploy check
First automatic DEV upload: 12-Nov-2026.
