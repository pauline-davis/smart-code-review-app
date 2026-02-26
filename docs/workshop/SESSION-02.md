# Session 02: Backend Development with Copilot

**Duration:** 75 minutes

## Learning Objectives

By the end of this session, you will:
- Build a FastAPI backend with AI assistance
- Understand how to prompt Copilot effectively for backend code
- Connect to Azure OpenAI for LLM-powered features
- Test your API endpoints

---

## Part 1: Understanding the Backend Structure (15 minutes)

### Project Overview

Open `src/backend/` and explore:

```
src/backend/
├── app/
│   ├── __init__.py
│   ├── main.py      # FastAPI application and endpoints
│   └── llm.py       # Azure OpenAI client
└── requirements.txt  # Python dependencies
```

### Review main.py

Open `src/backend/app/main.py` and review:
- The FastAPI app setup
- CORS middleware configuration
- Request/Response models
- The `/health`, `/review`, and `/suggest` endpoints

### Start the Backend

> **Codespaces users:** Dependencies are already installed in a virtual environment by the devcontainer setup. You can skip the `python -m venv` and `pip install` steps and just activate the existing venv.

Create and activate a virtual environment, then install dependencies:

```bash
cd src/backend
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

!!! tip "Use a separate terminal"
    The `uvicorn` command keeps running in your current terminal. Open a **new terminal** (`` Ctrl+` `` or Terminal > New Terminal in VS Code) to run the health check and subsequent commands.

Test the health endpoint:
```bash
curl http://localhost:8000/health
```

---

## Part 2: Using Copilot for Backend Development (30 minutes)

!!! tip "Copilot for Backend Code"
    For the exercises below, **Copilot Chat** (`Ctrl+I` / `Cmd+I`) often works better than inline completions for backend code with decorators, Pydantic models, and async patterns. If inline suggestions look garbled, dismiss with `Esc` and use Chat instead.

### Exercise 1: Enhance the Review Endpoint

The `/review` endpoint works, but let's add input validation.

Open `main.py` and find the `CodeReviewRequest` model. Use Copilot to add validation:

1. Position cursor after the `code: str` field
2. Type a comment: `# Add validation: code must be between 10 and 10000 characters`
3. Let Copilot suggest the validation

**Expected result:**
```python
class CodeReviewRequest(BaseModel):
    code: str = Field(..., min_length=10, max_length=10000)
    language: Optional[str] = "python"
    context: Optional[str] = None
```

### Exercise 2: Add a New Endpoint

Let's add an endpoint to check code complexity.

1. At the bottom of `main.py`, type:
```python
@app.post("/complexity")
async def analyze_complexity(request: CodeReviewRequest):
    """
    Analyze code complexity and return metrics.
    """
    # Ask Copilot: Return complexity score based on lines, functions, and nesting
```

2. Let Copilot complete the implementation
3. Refine with comments if needed

### Exercise 3: Error Handling

Use Copilot Chat to improve error handling:

1. Open Copilot Chat (Cmd+Shift+I)
2. Select the `review_code` function
3. Ask: "Add more specific error handling for different failure cases"

---

## Part 3: Azure OpenAI Integration (20 minutes)

### Understanding the LLM Client

Open `src/backend/app/llm.py` and review:
- Environment variable configuration
- AsyncAzureOpenAI client setup
- The `get_code_review` function

### Configure Azure OpenAI

Create a `.env` file in `src/backend/`:

```bash
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
```

**Note:** Your facilitator will provide the actual credentials.

### Test with Real API

Update `main.py` to load environment variables:

```python
# Add at the top of main.py
from dotenv import load_dotenv
load_dotenv()
```

Test the review endpoint:
```bash
curl -X POST http://localhost:8000/review \
  -H "Content-Type: application/json" \
  -d '{"code": "def hello():\n    print(\"Hello, World!\")", "language": "python"}'
```

### Exercise 4: Customize the System Prompt

Open `llm.py` and find the `system_prompt` in `get_code_review`.

Use Copilot to enhance it:
1. Add focus areas (security, performance, readability)
2. Request specific formatting
3. Ask for severity levels on suggestions

---

## Part 4: Testing Your API (10 minutes)

### Using the Interactive Docs

1. Open http://localhost:8000/docs in your browser
2. This is Swagger UI - auto-generated from your FastAPI code
3. Try each endpoint:
   - GET `/health`
   - POST `/review`
   - POST `/suggest`

### Write a Quick Test

Create `src/backend/test_api.py`:

```python
# Type this comment and let Copilot generate the tests:
# Test the health endpoint returns status healthy
# Test the review endpoint with valid Python code
# Test the review endpoint rejects empty code
```

Run with (ensure the virtual environment is active):
```bash
pip install pytest httpx
pytest test_api.py -v
```

---

## Key Takeaways

1. **Copilot understands FastAPI** - It knows decorators, Pydantic models, async patterns
2. **Comments drive generation** - Descriptive comments produce better code
3. **Iterate and refine** - Accept suggestions, then improve them
4. **Test as you go** - FastAPI's Swagger UI makes testing easy

---

## Next Session Preview

In Session 03, we'll build the React frontend:
- Create the code input component
- Display review results
- Connect frontend to backend

---

<details>
<summary><strong>Deep Dive: Prompting Best Practices</strong></summary>

### The Anatomy of a Good Prompt

When working with LLMs (whether Copilot or Azure OpenAI), structure matters:

```
[Context] You are reviewing Python code for a financial application.
[Task] Analyze this code for security vulnerabilities.
[Format] Return a JSON object with: vulnerabilities (array), severity (high/medium/low), fix suggestions.
[Constraints] Focus on SQL injection, XSS, and authentication issues.
```

### Effective Prompting Strategies

1. **Be Specific**: "Add error handling" → "Add try/except for network timeouts with exponential backoff"

2. **Provide Examples**: Show the format you want in your prompt

3. **Set Constraints**: Limit output length, specify format, define scope

4. **Use Role Assignment**: "You are a senior security engineer..."

### Common Pitfalls

- Vague instructions ("make it better")
- Missing context (what is this code for?)
- No format specification (how should output look?)
- Asking for too much at once (break into steps)

</details>
