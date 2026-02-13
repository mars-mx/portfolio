# portfolio

## Deployment workflow (manual production deploys)

This project is configured to **not** auto-deploy production on every Git push.

### What is configured

- `vercel.json` sets `git.deploymentEnabled.main = false`
- Result: pushes to `main` do not trigger automatic Vercel deployments

### Team deploy flow

1. Create an issue
2. Create a branch
3. Open a PR
4. Merge PR into `main`
5. Trigger deployment manually (intentional deploy), e.g.:
   - via Vercel dashboard **Deploy** action, or
   - via CLI: `vercel --prod`

This keeps production releases explicit and predictable.
