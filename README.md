# Kudex Claude Cloud Builder

A self-hostable cloud coding workspace that dispatches tasks to GitHub Actions and runs Claude Code against a repository. The first release focuses on authenticated dispatch, owner-only repository access, isolated execution, and pull-request-based delivery.

## Included
- Next.js dashboard with GitHub OAuth sign-in.
- Server-side workflow dispatcher; OAuth tokens stay on the server.
- Owner and repository permission checks, bounded task input.
- Manually triggered GitHub Actions workflow for Claude Code, routed through OpenRouter.
- Pull-request-first delivery; no automatic merge or production deployment.

## Flow
1. Sign in with GitHub OAuth.
2. Server verifies the signed-in user owns the target repository and has push permission.
3. Server dispatches `.github/workflows/claude-cloud-builder.yml`.
4. GitHub Actions runs Claude Code through OpenRouter using the repository secret `OPENROUTER_API_KEY`.
5. Review the resulting pull request and merge it manually if appropriate.

The web server does not execute arbitrary shell commands. The coding agent runs on an ephemeral GitHub-hosted runner.

## Setup
Requirements: Node.js 20.9+, npm, GitHub OAuth App, GitHub Actions enabled, and an OpenRouter API key with sufficient credits.

1. Create a GitHub OAuth App at https://github.com/settings/developers.
2. Set callback URL to `http://localhost:3000/api/auth/callback/github`.
3. Copy `.env.example` to `.env.local` and fill in your OAuth credentials and a strong session secret.
4. Create an OpenRouter API key at https://openrouter.ai/keys.
5. Add the key as a GitHub Actions repository secret named `OPENROUTER_API_KEY`.
6. Run `npm install && npm run dev` and open http://localhost:3000.

Generate a session secret with `openssl rand -base64 32`.

## Environment
- `GITHUB_ID`: GitHub OAuth App client ID.
- `GITHUB_SECRET`: GitHub OAuth App client secret.
- `NEXTAUTH_SECRET`: strong random session secret.
- `NEXTAUTH_URL`: public app URL.

The OpenRouter key is only needed by the GitHub Actions workflow. Store it in repository Actions secrets as `OPENROUTER_API_KEY`; do not put it in the dashboard's `.env.local`, commit it, or expose it to the browser.

## OpenRouter model compatibility
The workflow sets `ANTHROPIC_BASE_URL=https://openrouter.ai/api` and passes the OpenRouter key as `ANTHROPIC_AUTH_TOKEN`, using OpenRouter's Anthropic-compatible endpoint. Claude Code through this integration is guaranteed to work with Anthropic first-party models; compatibility with non-Anthropic models is not guaranteed. OpenRouter usage is billed against your OpenRouter account balance and is not automatically free.

See the [OpenRouter Claude Code integration guide](https://openrouter.ai/docs/guides/coding-agents/claude-code-integration) for model and routing details.

## Deployment
Deploy to a Node-compatible Next.js host. Configure all four dashboard environment variables and update the OAuth callback URL to `https://YOUR-DOMAIN/api/auth/callback/github`.

## Current boundaries
- Only repositories owned by the signed-in GitHub user are accepted.
- Workflow dispatch is manual and requires authenticated GitHub OAuth.
- Changes should be delivered through a pull request.
- No automatic merge, production deploy, arbitrary shell endpoint, or API-key storage UI.
- OpenRouter requests may incur charges; check model pricing and your account limits before running tasks.
- Review and pin third-party Actions to immutable commit SHAs before production.

## Roadmap
Repository picker and run status; session history and cancellation; quotas, audit events, and deployment hardening.

MIT License. See [LICENSE](LICENSE).
