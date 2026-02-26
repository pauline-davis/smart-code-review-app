#!/bin/bash
set -e

echo "🚀 Setting up AI Engineering Workshop environment..."

# Bridge Codespace secrets to backend .env file
echo "🔑 Configuring environment variables..."
ENV_FILE="src/backend/.env"
if [ ! -f "$ENV_FILE" ]; then
  cp src/backend/.env.example "$ENV_FILE"
  # Populate from Codespace secrets if available
  if [ -n "$AZURE_OPENAI_ENDPOINT" ]; then
    sed -i "s|https://your-resource.openai.azure.com/|$AZURE_OPENAI_ENDPOINT|" "$ENV_FILE"
  fi
  if [ -n "$AZURE_OPENAI_KEY" ]; then
    sed -i "s|your-api-key-here|$AZURE_OPENAI_KEY|" "$ENV_FILE"
  fi
  # Also support AZURE_OPENAI_API_KEY if set directly
  if [ -n "$AZURE_OPENAI_API_KEY" ]; then
    sed -i "s|your-api-key-here|$AZURE_OPENAI_API_KEY|" "$ENV_FILE"
  fi
  echo "   ✅ .env file created"
else
  echo "   ⏭️  .env file already exists, skipping"
fi

# Install backend dependencies in a virtual environment
echo "📦 Setting up Python virtual environment..."
python -m venv src/backend/.venv
source src/backend/.venv/bin/activate
cd src/backend
pip install -r requirements.txt --quiet
cd ../..

# Install frontend dependencies
echo "📦 Installing Node dependencies..."
cd src/frontend
npm install --silent
cd ../..

# Install Azure SWA CLI for Session 05
echo "☁️  Installing Azure deployment tools..."
npm install -g @azure/static-web-apps-cli --silent 2>/dev/null || true

echo ""
echo "=========================================="
echo "  ✅ Workshop environment ready!"
echo "=========================================="
echo ""
echo "  Quick Start:"
echo "    Backend:  cd src/backend && uvicorn app.main:app --reload --port 8000"
echo "    Frontend: cd src/frontend && npm run dev"
echo ""
echo "  Begin:  Open docs/workshop/SESSION-01.md"
echo ""

# Check if Azure OpenAI is configured
if grep -q "your-api-key-here" src/backend/.env 2>/dev/null; then
  echo "  ⚠️  Azure OpenAI not configured — API calls will use mock mode."
  echo "     Your facilitator will provide credentials during Session 02."
  echo ""
fi
