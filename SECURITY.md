# Security Policy

Report vulnerabilities privately to the repository owner; do not publish exploit details in an issue.

## Deployment checklist
- Use HTTPS and a strong unique NEXTAUTH_SECRET.
- Store OAuth credentials only in encrypted host environment variables.
- Keep ANTHROPIC_API_KEY in GitHub Actions secrets, never in source, browser code, or task prompts.
- Protect the default branch and require pull-request review.
- Review third-party Actions and pin them to immutable commit SHAs before production.
- Configure provider budgets and monitor billing; free usage is not guaranteed.
- Add rate limiting, abuse monitoring, audit logging, and stricter authorization before opening this service to multiple users.

The initial dispatcher is restricted to repositories owned by the signed-in GitHub user and asks the agent to open a PR rather than merging or deploying. This is a baseline, not a full security audit.
