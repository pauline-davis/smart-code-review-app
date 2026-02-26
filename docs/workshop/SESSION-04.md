# Session 04: Integration and Testing

**Duration:** 60 minutes

## Learning Objectives

By the end of this session, you will:
- Test the full application end-to-end
- Add error handling and edge cases
- Write tests with Copilot assistance
- Prepare the application for deployment

---

## Part 1: End-to-End Testing (20 minutes)

### Verify Full Stack

Make sure both services are running:

```bash
# Terminal 1: Backend
cd src/backend && uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend  
cd src/frontend && npm run dev
```

### Test Scenarios

Work through these test cases:

1. **Happy Path**
   - Enter valid Python code
   - Click "Review Code"
   - Verify review appears with score and suggestions

2. **Edge Cases**
   - Empty code (should show validation error)
   - Very long code (test the 10,000 char limit)
   - Non-code text (how does the LLM handle it?)

3. **Error Handling**
   - Stop the backend - does frontend show error message?
   - Invalid JSON from API - graceful degradation?

### Exercise 1: Add Client-Side Validation

Open `src/frontend/src/components/CodeInput.tsx`:

Use Copilot to add validation:
```typescript
// Add validation before submit:
// - Code must be at least 10 characters
// - Show error message if validation fails
// - Disable submit button while invalid
```

---

## Part 2: Writing Tests with Copilot (25 minutes)

### Backend Tests

Create `src/backend/tests/test_main.py`:

```python
# Let Copilot generate tests from these comments:

# Test health endpoint returns 200 and healthy status

# Test review endpoint with valid Python code returns review, suggestions, and score

# Test review endpoint with empty code returns 422 validation error

# Test review endpoint with code exceeding max length returns 422
```

Run the tests (ensure the virtual environment is active):
```bash
cd src/backend
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install pytest pytest-asyncio httpx
pytest tests/ -v
```

### Frontend Tests

Create `src/frontend/src/App.test.tsx`:

```typescript
// Generate tests for:

// Renders the application title

// Shows empty state message when no review results

// Displays error message when API call fails

// Shows loading state while fetching review
```

Install testing dependencies:
```bash
cd src/frontend
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Add to `package.json`:
```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

Run tests:
```bash
npm test
```

### Exercise 2: Add Test Coverage

Use Copilot Chat to generate more tests:

1. Select `ReviewResults.tsx`
2. Ask: "Generate comprehensive tests for this component including edge cases"

---

## Part 3: Error Boundaries and Edge Cases (15 minutes)

### Add Error Boundary

Create `src/frontend/src/components/ErrorBoundary.tsx`:

```typescript
// React Error Boundary component that:
// - Catches JavaScript errors in child components
// - Displays a friendly error message
// - Provides a "Try Again" button to reset
```

### Implement in App

Wrap the main content with the error boundary:

```tsx
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      {/* existing content */}
    </ErrorBoundary>
  )
}
```

### Exercise 3: Handle Network Errors

In `src/frontend/src/services/api.ts`:

Add retry logic:
```typescript
// Add retry logic with exponential backoff
// Retry up to 3 times on network errors
// Show specific error messages for different failure types
```

---

## Pre-Deployment Checklist

Before moving to deployment, verify:

- [ ] Backend starts without errors
- [ ] Frontend builds without errors (`npm run build`)
- [ ] API calls work correctly
- [ ] Error states are handled
- [ ] Environment variables are documented
- [ ] No secrets in code

### Build for Production

```bash
# Backend - no build needed, just verify it runs
cd src/backend
python -m py_compile app/main.py app/llm.py

# Frontend
cd src/frontend
npm run build
ls -la dist/  # Verify build output
```

---

## Key Takeaways

1. **Test early and often** - Copilot can generate test boilerplate quickly
2. **Edge cases matter** - Think about what could go wrong
3. **Error boundaries prevent crashes** - Graceful degradation is key
4. **Production builds differ from dev** - Always test the build output

---

## Next Session Preview

In Session 05, we'll deploy to Azure:
- Backend to Azure App Service
- Frontend to Azure Static Web Apps
- Configure environment variables
- Set up CI/CD pipeline

---

<details>
<summary><strong>Deep Dive: Testing Strategies</strong></summary>

### The Testing Pyramid

```
        /\
       /  \       E2E Tests (few, slow, expensive)
      /----\
     /      \     Integration Tests (some)
    /--------\
   /          \   Unit Tests (many, fast, cheap)
  --------------
```

### What to Test in LLM Applications

1. **API Layer**
   - Input validation
   - Response format
   - Error handling
   - Rate limiting

2. **LLM Integration**
   - Mock responses for unit tests
   - Real API calls for integration tests
   - Timeout handling
   - Malformed response handling

3. **Frontend**
   - Component rendering
   - User interactions
   - Loading/error states
   - API integration

### Testing LLM Outputs

Since LLM outputs are non-deterministic:
- Test structure, not exact content
- Use schema validation
- Set temperature to 0 for more consistent outputs
- Mock in unit tests, use real API sparingly

</details>
