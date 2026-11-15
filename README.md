# Kudex Claude Cloud Builder

A self-hostable cloud coding workspace that dispatches tasks to GitHub Actions and runs Claude Code against a repository. The first release focuses on authenticated dispatch, owner-only repository access, isolated execution, and pull-request-based delivery.

## Included
- Next.js dashboard with GitHub OAuth sign-in.
- Server-side workflow dispatcher; OAuth tokens stay on the server.
- Owner and repository permission checks, bounded task input.
- Manually triggered GitHub Actions workflow for Claude Code.
- Pull-request-first delivery; no automatic merge or production deployment.

## Flow
1. Sign in with GitHub OAuth.
2. Server verifies the signed-in user owns the target repository and has push permission.
3. Server dispatches `.github/workflows/claude-cloud-builder.yml`.
4. GitHub Actions runs Claude Code using the repository secret `ANTHROPIC_API_KEY`.
5. Review the resulting pull request and merge it manually if appropriate.

The web server does not execute arbitrary shell commands. The coding agent runs on an ephemeral GitHub-hosted runner.

## Setup
Requirements: Node.js 20.9+, npm, GitHub OAuth App, GitHub Actions enabled, and an Anthropic API key.

1. Create a GitHub OAuth App at https://github.com/settings/developers.
2. Set callback URL to `http://localhost:3000/api/auth/callback/github`.
3. Copy `.env.example` to `.env.local` and fill in OAuth credentials and a strong session secret.
4. Add `ANTHROPIC_API_KEY` as a GitHub Actions repository secret.
5. Run `npm install && npm run dev` and open http://localhost:3000.

Generate a session secret with `openssl rand -base64 32`.

## Environment
- `GITHUB_ID`: OAuth App client ID.
- `GITHUB_SECRET`: OAuth App client secret.
- `NEXTAUTH_SECRET`: strong random session secret.
- `NEXTAUTH_URL`: public app URL.

Never commit real credentials. The Anthropic key belongs in GitHub Actions secrets, not this app's environment or browser bundle.

## Deployment
Deploy to a Node-compatible Next.js host. Configure all four environment variables and update the OAuth callback URL to `https://YOUR-DOMAIN/api/auth/callback/github`.

## Current boundaries
- Only repositories owned by the signed-in GitHub user are accepted.
- Workflow dispatch is manual and requires authenticated GitHub OAuth.
- Changes should be delivered through a pull request.
- No automatic merge, production deploy, arbitrary shell endpoint, or API-key storage UI.
- Free-model availability is not guaranteed; Claude Code requires valid provider credentials and may incur charges.
- Review and pin third-party Actions to immutable commit SHAs before production.

## Roadmap
Repository picker and run status; session history and cancellation; provider adapters after compatibility and pricing checks; quotas, audit events, and deployment hardening.

MIT License. See [LICENSE](LICENSE).
