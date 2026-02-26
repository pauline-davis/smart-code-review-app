# Contributing Guidelines

Thank you for contributing to this project! Please follow these guidelines to ensure a smooth process.

## Getting Started

1. **Fork the repository** and clone it locally
2. **Install pre-commit hooks**:
   ```bash
   pip install pre-commit
   pre-commit install
   ```
3. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Before You Code

1. Check existing issues and PRs to avoid duplicating work
2. For significant changes, open an issue first to discuss the approach
3. Ensure you have the latest changes from `main`

### While Coding

1. **Follow existing code style** - consistency is important
2. **Write tests** for new functionality
3. **Keep commits focused** - one logical change per commit
4. **Write clear commit messages**:
   ```
   feat: add user authentication
   fix: resolve login timeout issue
   docs: update API documentation
   refactor: simplify database queries
   ```

### Before Submitting

1. **Run pre-commit hooks**:
   ```bash
   pre-commit run --all-files
   ```
2. **Run tests**:
   ```bash
   # Add your test command here
   ```
3. **Update documentation** if needed

## Security Requirements

### All contributions MUST follow these security practices:

| Requirement | Details |
|-------------|---------|
| **No secrets in code** | Never commit API keys, passwords, or tokens |
| **Use `/secrets/` directory** | Store local credentials in the git-ignored `/secrets/` folder |
| **Environment variables** | Reference secrets via environment variables |
| **Review AI code** | Carefully review any AI-generated code before committing |
| **Address security findings** | Fix critical/high severity issues before merge |

### What Gets Blocked

PRs will be blocked from merging if they contain:
- Detected secrets or credentials (Gitleaks scan)
- Critical severity vulnerabilities
- `.env` files outside `/secrets/`

### Pre-commit Hooks

The following hooks run automatically:
- **Gitleaks** - Scans for secrets
- **detect-secrets** - Additional secret patterns
- **check-yaml/json** - Validates configuration files
- **no-commit-to-branch** - Prevents direct commits to main

## Pull Request Process

1. **Fill out the PR template** completely
2. **Complete the security checklist**
3. **Wait for CI checks** to pass
4. **Address review comments** promptly
5. **Squash commits** if requested

### PR Checklist

- [ ] Pre-commit hooks pass
- [ ] All tests pass
- [ ] Security checklist completed
- [ ] Documentation updated
- [ ] No secrets or credentials included

## Code Review

### What Reviewers Look For

- Security issues
- Code quality and readability
- Test coverage
- Documentation
- Adherence to project standards

## Getting Help

- **Questions?** Open a discussion or ask in your team channel
- **Found a bug?** Open an issue with reproduction steps
- **Security issue?** See [SECURITY.md](./SECURITY.md) - do NOT open a public issue

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

_This project follows the [AIRE](https://github.com/crederauk/aire-ai-reference-for-engineering) security guidelines._
