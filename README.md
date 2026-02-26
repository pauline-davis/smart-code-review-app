# Smart Code Review Assistant

> AI-powered code review application built with FastAPI, React, and Azure OpenAI GPT-4

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## 🚀 Features

- **AI-Powered Analysis**: Leverages Azure OpenAI GPT-4o-mini for intelligent code review
- **Multi-Language Support**: Python, JavaScript, TypeScript, Java, C++, C#, Go, Ruby, PHP
- **Real-Time Feedback**: Instant code quality assessments with severity categorization
- **Complexity Scoring**: Detailed complexity analysis with actionable recommendations
- **Smart Suggestions**: AI-generated refactoring and improvement suggestions
- **Robust Error Handling**: Error boundary and retry logic with exponential backoff
- **Modern UI**: Vice-inspired minimalist design with responsive layout
- **Production-Ready**: Comprehensive testing, CI/CD pipeline, and Azure deployment configuration

## 📋 Table of Contents

- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  React Frontend │◄───────►│  FastAPI Backend │◄───────►│  Azure OpenAI   │
│   (TypeScript)  │  HTTP   │     (Python)     │   API   │    (GPT-4o)     │
│                 │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

**Technology Stack:**
- **Backend**: FastAPI, Python 3.11+, Azure OpenAI SDK, Pydantic
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Testing**: pytest, Vitest, React Testing Library
- **CI/CD**: GitHub Actions
- **Deployment**: Azure App Service (Backend), Azure Static Web Apps (Frontend)

## ⚡ Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- Azure OpenAI API access

### Backend Setup

```bash
# Navigate to backend directory
cd src/backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your Azure OpenAI credentials

# Start development server
uvicorn app.main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd src/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file in `src/backend/`:

```env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
```

## 📚 API Documentation

### Endpoints

#### `GET /health`
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-26T12:00:00Z"
}
```

#### `POST /review`
Analyze code and provide review feedback

**Request:**
```json
{
  "code": "def example():\n    pass",
  "language": "python"
}
```

**Response:**
```json
{
  "issues": [
    {
      "severity": "medium",
      "message": "Function lacks docstring",
      "line": 1
    }
  ]
}
```

#### `POST /complexity`
Analyze code complexity

**Request:**
```json
{
  "code": "def example():\n    pass",
  "language": "python"
}
```

**Response:**
```json
{
  "score": 3,
  "details": "Low complexity. Code is simple and maintainable."
}
```

#### `POST /suggest`
Get AI-powered refactoring suggestions

**Request:**
```json
{
  "code": "def example():\n    pass",
  "language": "python"
}
```

**Response:**
```json
{
  "suggestions": [
    "Add type hints for better code clarity",
    "Include docstring following PEP 257"
  ]
}
```

### Interactive API Docs

Visit `http://localhost:8000/docs` for Swagger UI documentation.

## 🧪 Testing

### Backend Tests

```bash
cd src/backend
pytest -v

# With coverage
pytest --cov=app --cov-report=html
```

**Test Coverage:** 7 tests covering all endpoints and error scenarios

### Frontend Tests

```bash
cd src/frontend
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

**Test Coverage:** 26 tests covering components, error handling, and user interactions

## 🚢 Deployment

### Azure Deployment

#### Backend (Azure App Service)

```bash
cd src/backend
az webapp up --name smart-code-review-backend --runtime PYTHON:3.11
```

#### Frontend (Azure Static Web Apps)

```bash
cd src/frontend
npm run build
az staticwebapp create \
  --name smart-code-review-frontend \
  --source ./dist \
  --location westus2
```

### Environment Configuration

Set these secrets in Azure App Service and GitHub Actions:
- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_DEPLOYMENT`

### CI/CD Pipeline

GitHub Actions automatically runs:
- Backend tests (pytest)
- Frontend tests (Vitest)
- Security scanning
- Code linting
- Production builds

## 📁 Project Structure

```
smart-code-review-app/
├── src/
│   ├── backend/
│   │   ├── app/
│   │   │   ├── __init__.py
│   │   │   ├── main.py          # FastAPI application
│   │   │   ├── llm.py           # Azure OpenAI integration
│   │   │   └── utils.py         # Utility functions
│   │   ├── tests/
│   │   │   └── test_api.py      # API endpoint tests
│   │   └── requirements.txt
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   │   ├── CodeInput.tsx
│       │   │   ├── ReviewResults.tsx
│       │   │   └── ErrorBoundary.tsx
│       │   ├── services/
│       │   │   └── api.ts       # API client with retry logic
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── package.json
│       └── vite.config.ts
├── .github/
│   └── workflows/
│       └── ci.yml               # CI/CD pipeline
├── docs/
│   └── workshop/                # Training workshop materials
├── README.md
├── LICENSE
└── DEPLOYMENT_PLAN.md
```

## 🔒 Security

- **No Hardcoded Secrets**: All credentials stored in environment variables
- **Input Validation**: Pydantic models validate all API inputs
- **CORS Configuration**: Restricted origins in production
- **Error Sanitization**: No sensitive data leaked in error messages
- **Dependency Scanning**: Automated security checks in CI/CD

**Security Best Practices:**
- Never commit `.env` files
- Rotate API keys regularly
- Use Azure Key Vault for production secrets
- Enable HTTPS in production
- Monitor Azure OpenAI usage quotas

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes using [Conventional Commits](https://www.conventionalcommits.org/)
4. Write tests for new features
5. Ensure all tests pass (`pytest && npm test`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built as part of AI Engineering Training Workshop
- Powered by Azure OpenAI and GPT-4o-mini
- UI design inspired by Vice Media's minimalist aesthetic

## 📧 Contact

**Pauline Davis**
- GitHub: [@pauline-davis](https://github.com/pauline-davis)
- Repository: [smart-code-review-app](https://github.com/pauline-davis/smart-code-review-app)

---

**Note:** This is a portfolio project demonstrating full-stack development, AI integration, and production-ready software engineering practices.
