# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

1. Create an issue in this GitHub Repo
2. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes

We will respond and work with you to resolve the issue.

## Security Requirements

### For All Contributors

1. **Never commit secrets** - API keys, passwords, tokens must go in `/secrets/` directory
2. **Use environment variables** - Reference secrets via environment variables, not hardcoded values
3. **Review AI-generated code** - Always review code suggested by AI tools before committing
4. **Keep dependencies updated** - Address Dependabot alerts promptly

### Secret Management

| Do | Don't |
|----|-------|
| Store credentials in `/secrets/` | Commit `.env` files to git |
| Use environment variables | Hardcode API keys in code |
| Use secret managers in production | Share credentials in Slack/email |
| Rotate credentials regularly | Use the same password everywhere |

### Pre-commit Hooks

This repository uses pre-commit hooks to catch issues early:

```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install

# Run manually
pre-commit run --all-files
```

Hooks include:
- **Gitleaks** - Detects secrets in code
- **detect-secrets** - Additional secret patterns
- **check-added-large-files** - Prevents accidental large file commits
- **detect-private-key** - Catches private keys

### CI/CD Security Checks

Every pull request runs:
- Secret scanning (Gitleaks)
- Dependency vulnerability scanning
- SAST analysis (CodeQL + Veracode)

PRs with **critical** security findings will be blocked from merging.

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | ✅ Yes    |
| < 1.0   | ❌ No     |

## Security Features

This template includes:

- ✅ Secret scanning in CI/CD
- ✅ Pre-commit hooks for local development
- ✅ Dependency vulnerability scanning
- ✅ SAST (Static Application Security Testing)
- ✅ Protected `/secrets/` directory (git-ignored, AI-restricted)
- ✅ PR template with security checklist
- ✅ Branch protection recommendations

## Contact

- Security Team: 
   - james.milward@credera.co.uk OR
   - nick.green@credera.co.uk OR
   - rob.merrett@credera.co.uk
- Documentation: [AIRE Reference](https://github.com/crederauk/aire-ai-reference-for-engineering)
