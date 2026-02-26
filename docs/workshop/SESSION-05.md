# Session 05: Azure Deployment

**Duration:** 60 minutes

## Learning Objectives

By the end of this session, you will:
- Deploy the backend to Azure App Service
- Deploy the frontend to Azure Static Web Apps
- Configure environment variables securely
- Have a fully functional application in the cloud

---

## Part 1: Azure Setup (10 minutes)

### Prerequisites

Your facilitator has provided:
- Azure subscription access
- Resource group name: `rg-workshop-{your-name}`
- Region: UK South

### Login to Azure

```bash
# Login to Azure CLI
az login

# Set the subscription (if needed)
az account set --subscription "Your Subscription Name"

# Verify
az account show
```

### Create Resource Group (if not exists)

```bash
RESOURCE_GROUP="rg-workshop-yourname"
LOCATION="uksouth"

az group create --name $RESOURCE_GROUP --location $LOCATION
```

---

## Part 2: Deploy Backend to App Service (20 minutes)

### Create App Service Plan

```bash
APP_SERVICE_PLAN="asp-workshop-yourname"

az appservice plan create \
  --name $APP_SERVICE_PLAN \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux
```

### Create Web App

```bash
BACKEND_APP="app-workshop-backend-yourname"

az webapp create \
  --name $BACKEND_APP \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --runtime "PYTHON:3.11"
```

### Configure Environment Variables

```bash
az webapp config appsettings set \
  --name $BACKEND_APP \
  --resource-group $RESOURCE_GROUP \
  --settings \
    AZURE_OPENAI_ENDPOINT="https://your-endpoint.openai.azure.com/" \
    AZURE_OPENAI_API_KEY="your-api-key" \
    AZURE_OPENAI_DEPLOYMENT="gpt-4o-mini"
```

### Deploy the Backend

```bash
cd src/backend

# Create startup command
az webapp config set \
  --name $BACKEND_APP \
  --resource-group $RESOURCE_GROUP \
  --startup-file "uvicorn app.main:app --host 0.0.0.0 --port 8000"

# Deploy code
zip -r backend.zip . -x "*.pyc" -x "__pycache__/*" -x ".env"
az webapp deployment source config-zip \
  --name $BACKEND_APP \
  --resource-group $RESOURCE_GROUP \
  --src backend.zip

# Clean up
rm backend.zip
```

### Verify Backend Deployment

```bash
# Get the URL
BACKEND_URL="https://${BACKEND_APP}.azurewebsites.net"
echo "Backend URL: $BACKEND_URL"

# Test health endpoint
curl "$BACKEND_URL/health"
```

---

## Part 3: Deploy Frontend to Static Web Apps (20 minutes)

### Update API URL

Before building, update the API URL in the frontend:

Create `src/frontend/.env.production`:
```
VITE_API_URL=https://app-workshop-backend-yourname.azurewebsites.net
```

Update `src/frontend/src/services/api.ts`:
```typescript
const API_BASE = import.meta.env.VITE_API_URL || '/api'
```

### Build the Frontend

```bash
cd src/frontend
npm run build
```

### Create Static Web App

```bash
FRONTEND_APP="swa-workshop-yourname"

az staticwebapp create \
  --name $FRONTEND_APP \
  --resource-group $RESOURCE_GROUP \
  --location "westeurope" \
  --source "." \
  --branch "main" \
  --app-location "src/frontend" \
  --output-location "dist" \
  --login-with-github
```

### Alternative: Deploy from CLI

If you prefer to deploy directly without GitHub integration:

```bash
cd src/frontend

# Install SWA CLI
npm install -g @azure/static-web-apps-cli

# Deploy
swa deploy dist \
  --app-name $FRONTEND_APP \
  --resource-group $RESOURCE_GROUP
```

### Configure CORS on Backend

Update the backend to allow requests from your Static Web App:

```bash
FRONTEND_URL="https://${FRONTEND_APP}.azurestaticapps.net"

az webapp cors add \
  --name $BACKEND_APP \
  --resource-group $RESOURCE_GROUP \
  --allowed-origins $FRONTEND_URL
```

---

## Part 4: Verify Full Deployment (10 minutes)

### Test the Application

1. Open your Static Web App URL in a browser
2. Enter some code to review
3. Click "Review Code"
4. Verify results appear correctly

### Troubleshooting

If something isn't working:

**Backend Issues:**
```bash
# Check logs
az webapp log tail --name $BACKEND_APP --resource-group $RESOURCE_GROUP
```

**Frontend Issues:**
- Check browser developer tools (F12) for network errors
- Verify CORS is configured correctly
- Check environment variables are set

**Common Problems:**
- CORS errors: Add frontend URL to backend allowed origins
- 500 errors: Check backend logs for Python errors
- API key issues: Verify environment variables in App Service

---

## Cleanup (Optional)

If you want to remove all resources after the workshop:

```bash
az group delete --name $RESOURCE_GROUP --yes --no-wait
```

---

## Congratulations!

You've successfully:
- Built a full-stack AI application
- Used GitHub Copilot throughout development
- Integrated with Azure OpenAI
- Deployed to Azure cloud services

---

## Next Steps

To continue learning:

1. **Add Features**
   - User authentication
   - Save review history
   - Support more languages

2. **Improve AI**
   - Fine-tune prompts
   - Add code explanation feature
   - Implement chat-style interaction

3. **Production Readiness**
   - Add monitoring with Application Insights
   - Implement rate limiting
   - Set up CI/CD pipeline

---

<details>
<summary><strong>Deep Dive: Production Considerations</strong></summary>

### Security Checklist

- [ ] API keys stored in Key Vault, not App Settings
- [ ] HTTPS enforced
- [ ] CORS restricted to known origins
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] Logging configured (no sensitive data)

### Monitoring

Add Application Insights:
```bash
az monitor app-insights component create \
  --app "ai-workshop-insights" \
  --location $LOCATION \
  --resource-group $RESOURCE_GROUP

# Connect to App Service
az webapp config appsettings set \
  --name $BACKEND_APP \
  --resource-group $RESOURCE_GROUP \
  --settings APPLICATIONINSIGHTS_CONNECTION_STRING="..."
```

### CI/CD Pipeline

For production, use GitHub Actions:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: azure/webapps-deploy@v2
        with:
          app-name: ${{ secrets.BACKEND_APP_NAME }}
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
          package: src/backend
```

### Cost Optimization

- Use B1 tier for development/testing
- Scale to S1+ for production
- Consider Azure Container Apps for better scaling
- Use consumption-based Static Web Apps

</details>
