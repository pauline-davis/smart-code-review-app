# Codespace Secrets Setup

## For Workshop Facilitators

Before the workshop, you need to configure organisation-level Codespace secrets so participants can access the shared Azure OpenAI endpoint.

### Required Secrets

| Secret Name | Maps To (in `.env`) | Description |
|-------------|---------------------|-------------|
| `AZURE_OPENAI_KEY` | `AZURE_OPENAI_API_KEY` | API key for Azure OpenAI |
| `AZURE_OPENAI_ENDPOINT` | `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint URL |

> **Note:** The Codespace secret `AZURE_OPENAI_KEY` is automatically mapped to `AZURE_OPENAI_API_KEY` in the backend `.env` file by the setup script. This bridging handles the naming difference between GitHub secrets conventions and the Azure OpenAI SDK.

### Setting Organisation Secrets

1. Go to your GitHub organisation settings
2. Navigate to **Secrets and variables** → **Codespaces**
3. Click **New organisation secret**
4. Add each secret with repository access to `aire-ai-engineering-training-workshop`

### Setting Repository Secrets (Alternative)

If you don't have org-level access:

1. Go to the repository settings
2. Navigate to **Secrets and variables** → **Codespaces**
3. Click **New repository secret**
4. Add the secrets listed above

## For Participants

If secrets are already configured by your facilitator, they will be automatically available when you launch a Codespace. The setup script creates a `src/backend/.env` file with your credentials pre-populated.

### Verifying Setup

After launching your Codespace, run:

```bash
echo $AZURE_OPENAI_KEY | head -c 5
```

You should see the first 5 characters of the API key. If empty, contact your facilitator.

You can also verify the `.env` file was created:

```bash
cat src/backend/.env
```

### Mock Mode Fallback

If API access isn't working, the application automatically falls back to mock mode and returns simulated responses so you can still complete the coding exercises.
