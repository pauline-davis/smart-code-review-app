# CLAUDE.md - AI Engineering Workshop

## Project Overview

This is a hands-on workshop repository for learning AI-assisted development. Participants build a Code Review Assistant using FastAPI (backend) and React (frontend) with Azure OpenAI integration.

## Repository Structure

- `docs/workshop/` - Session guides (SESSION-01.md through SESSION-05.md)
- `src/backend/` - FastAPI application with Azure OpenAI client
- `src/frontend/` - React + TypeScript + Tailwind application
- `scripts/` - Helper scripts for setup and deployment
- `.devcontainer/` - GitHub Codespaces configuration

## Key Technologies

- Python 3.11 with FastAPI and uvicorn
- Node.js 20 with React, Vite, and TypeScript
- Azure OpenAI (GPT-4o-mini model)
- Azure App Service and Static Web Apps for deployment

## Workshop Context

This is a training environment. Code contains intentional TODO comments that participants complete during the workshop. When assisting:

1. Look for TODO comments to understand what needs implementation
2. Preserve the learning structure - don't complete all TODOs at once
3. Guide participants through the implementation step by step

## Development Commands

Backend:
```bash
cd src/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Frontend:
```bash
cd src/frontend
npm install
npm run dev
```

## Environment Variables

Required for Azure OpenAI:
- AZURE_OPENAI_ENDPOINT
- AZURE_OPENAI_API_KEY
- AZURE_OPENAI_DEPLOYMENT (default: gpt-4o-mini)

## Security Notes

- Never commit API keys or credentials
- Use environment variables for all secrets
- The /secrets directory is git-ignored and AI-restricted
