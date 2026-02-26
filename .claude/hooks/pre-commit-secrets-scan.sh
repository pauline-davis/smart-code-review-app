#!/bin/bash
#
# Pre-commit hook: Scan for potential secrets in staged files
#
# This hook scans files being committed for patterns that look like
# API keys, tokens, passwords, and other secrets.
#
# Installation:
#   cp .claude/hooks/pre-commit-secrets-scan.sh .git/hooks/pre-commit
#   chmod +x .git/hooks/pre-commit
#
# Or use with Claude Code hooks in .claude/settings.json:
#   "hooks": {
#     "PreToolUse": [
#       { "matcher": "Bash", "hooks": [".claude/hooks/pre-commit-secrets-scan.sh"] }
#     ]
#   }

set -e

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

# Patterns that indicate potential secrets
# Each pattern: "description:regex"
SECRET_PATTERNS=(
    "AWS Access Key:AKIA[0-9A-Z]{16}"
    "AWS Secret Key:[A-Za-z0-9/+=]{40}"
    "GitHub Token:ghp_[A-Za-z0-9]{36}"
    "GitHub OAuth:gho_[A-Za-z0-9]{36}"
    "Generic API Key:api[_-]?key['\"]?\s*[:=]\s*['\"][A-Za-z0-9]{20,}"
    "Generic Secret:secret['\"]?\s*[:=]\s*['\"][A-Za-z0-9]{20,}"
    "Generic Token:token['\"]?\s*[:=]\s*['\"][A-Za-z0-9]{20,}"
    "Generic Password:password['\"]?\s*[:=]\s*['\"][^'\"]{8,}"
    "Private Key:-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----"
    "Azure Storage Key:[A-Za-z0-9+/]{86}=="
    "Slack Token:xox[baprs]-[0-9]{10,13}-[0-9]{10,13}-[a-zA-Z0-9]{24}"
    "Google API Key:AIza[0-9A-Za-z\\-_]{35}"
)

# Files/paths to skip
SKIP_PATTERNS=(
    "*.lock"
    "package-lock.json"
    "yarn.lock"
    "*.min.js"
    "*.min.css"
    ".git/*"
)

found_secrets=0

echo -e "${YELLOW}Scanning staged files for potential secrets...${NC}"

# Get list of staged files
staged_files=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null || echo "")

if [ -z "$staged_files" ]; then
    echo -e "${GREEN}No staged files to scan.${NC}"
    exit 0
fi

for file in $staged_files; do
    # Skip binary files and certain patterns
    skip=false
    for pattern in "${SKIP_PATTERNS[@]}"; do
        if [[ "$file" == $pattern ]]; then
            skip=true
            break
        fi
    done

    if [ "$skip" = true ]; then
        continue
    fi

    # Skip if file doesn't exist (deleted)
    if [ ! -f "$file" ]; then
        continue
    fi

    # Scan file content
    for secret_pattern in "${SECRET_PATTERNS[@]}"; do
        description="${secret_pattern%%:*}"
        pattern="${secret_pattern#*:}"

        if grep -qE "$pattern" "$file" 2>/dev/null; then
            echo -e "${RED}POTENTIAL SECRET FOUND${NC}"
            echo -e "  File: ${YELLOW}$file${NC}"
            echo -e "  Type: ${RED}$description${NC}"
            echo ""
            found_secrets=$((found_secrets + 1))
        fi
    done
done

if [ $found_secrets -gt 0 ]; then
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}COMMIT BLOCKED: $found_secrets potential secret(s) found${NC}"
    echo -e "${RED}========================================${NC}"
    echo ""
    echo "Please review and remove secrets before committing."
    echo "If this is a false positive, you can:"
    echo "  1. Add the pattern to .gitignore"
    echo "  2. Use 'git commit --no-verify' to skip this check (not recommended)"
    echo "  3. Store the secret in ./secrets/ directory instead"
    exit 1
else
    echo -e "${GREEN}No secrets detected in staged files.${NC}"
    exit 0
fi
