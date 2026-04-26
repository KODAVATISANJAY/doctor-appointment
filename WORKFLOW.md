# GitHub Actions Workflow

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment.

### Workflow Triggers
- Push to main branch
- Pull request to main branch
- Manual trigger via GitHub UI

### Jobs

#### Test Job
- Runs npm test on every push
- Checks code quality with ESLint

#### Build Job
- Builds frontend with Vite
- Verifies build output

#### Deploy Job
- Deploys frontend to Vercel
- Deploys backend to Render

### Secrets Required
- VERCEL_TOKEN
- RENDER_API_KEY
- MONGODB_URI

### Status Badges
Add these to your README:
- Build status badge
- Test coverage badge
- Deployment status badge
