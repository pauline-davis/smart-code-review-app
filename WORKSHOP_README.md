# AI Engineering Workshop

A hands-on single-day workshop for engineers new to AI-assisted development.

## Workshop Overview

This workshop takes you from zero to deploying an AI-powered application in approximately 6 hours. You will build a Code Review Assistant that uses Azure OpenAI GPT-4o-mini to analyze code and provide intelligent suggestions.

### What You Will Learn

| Session | Topic | Duration |
|---------|-------|----------|
| 01 | Environment Setup and LLM Fundamentals | 60 min |
| 02 | Using Copilot for Backend Development | 75 min |
| 03 | Building the Frontend with AI Assistance | 75 min |
| 04 | Integration and Testing | 60 min |
| 05 | Azure Deployment | 60 min |

### What You Will Build

A full-stack application with:
- Backend: FastAPI (Python) with Azure OpenAI integration
- Frontend: React + TypeScript + Tailwind CSS
- Deployment: Azure App Service + Static Web Apps

## Quick Start

### Prerequisites

- GitHub account with Codespaces access
- Azure account (provided for workshop)
- Basic Python and/or JavaScript knowledge

### Launch in Codespaces

1. Click the green Code button above
2. Select Codespaces tab
3. Click Create codespace on main
4. Wait ~2 minutes for environment setup

> **Note:** If your facilitator has configured Codespace secrets, Azure OpenAI credentials are automatically populated into `src/backend/.env` during setup. See [Codespace Secrets](.github/CODESPACES-SECRETS.md) for details.

## Workshop Sessions

Start with Session 01 and work through each session in order.

- [Session 01: Environment Setup and LLM Fundamentals](docs/workshop/SESSION-01.md)
- [Session 02: Backend Development with Copilot](docs/workshop/SESSION-02.md)
- [Session 03: Frontend Development with AI](docs/workshop/SESSION-03.md)
- [Session 04: Integration and Testing](docs/workshop/SESSION-04.md)
- [Session 05: Azure Deployment](docs/workshop/SESSION-05.md)

## Project Structure

```
docs/workshop/          # Session guides
src/
  backend/              # FastAPI application
    app/
      main.py           # API endpoints
      llm.py            # Azure OpenAI client
    tests/              # pytest test directory
    requirements.txt
    .env.example        # Environment variable template
  frontend/             # React application
    src/
      components/
      services/
    vitest.config.ts    # Test configuration
    package.json
.devcontainer/          # Codespaces configuration
```

## Security

This repository follows the AIRE security guidelines. See SECURITY.md for details.

## Additional Resources

- [AIRE Reference Architecture](https://github.com/crederauk/ai-engineering-reference-architecture)
- [Azure OpenAI Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)

## Contributing

See CONTRIBUTING.md for guidelines.

---

Part of the AI Engineering Reference Architecture (AIRE)
