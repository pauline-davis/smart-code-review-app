# LLM Integration Fix Summary

**Date:** 25 February 2026  
**File Modified:** `src/backend/app/llm.py`

---

## Problem

The `/review` endpoint was failing with the error:

```json
{
  "detail": "Expecting value: line 1 column 1 (char 0)"
}
```

This error indicated that `json.loads()` was receiving an empty string or `None` from the Azure OpenAI response.

### Root Causes

| Issue | Description |
|-------|-------------|
| **Unsupported `response_format`** | The `gpt-5-nano` model does not support the `response_format: json_object` parameter, causing empty or malformed responses |
| **Unsupported `temperature`** | The model only supports the default temperature value (1), not custom values like 0.3 or 0.5 |
| **Deprecated `max_tokens`** | Newer models require `max_completion_tokens` instead of `max_tokens` |
| **No response validation** | The code called `json.loads()` directly without checking if the response content was empty or null |
| **No error handling** | API calls had no try/catch blocks, so failures propagated as cryptic errors |

### Error Progression

1. **First error:** `max_tokens is not supported` → Fixed by changing to `max_completion_tokens`
2. **Second error:** `temperature does not support 0.3` → Fixed by removing `temperature` parameter
3. **Third error:** `Expecting value: line 1 column 1` → Required deeper investigation (this fix)

---

## Solution

### Changes Implemented

#### 1. Removed `response_format` Parameter

```python
# Before (unsupported by gpt-5-nano)
response = await client.chat.completions.create(
    ...
    response_format={"type": "json_object"},
)

# After
response = await client.chat.completions.create(
    ...
    # No response_format - rely on prompt engineering instead
)
```

#### 2. Added JSON Extraction Helper

New function to parse JSON from model responses that may include markdown or prose:

```python
def _extract_json_from_text(text: str) -> dict:
    """Extract JSON object from text that may contain markdown or other content."""
    # Try direct parse first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    
    # Try to find JSON in markdown code block
    json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
    if json_match:
        return json.loads(json_match.group(1))
    
    # Try to find raw JSON object
    json_match = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', text, re.DOTALL)
    if json_match:
        return json.loads(json_match.group(0))
    
    raise ValueError(f"Could not extract JSON from response: {text[:200]}...")
```

#### 3. Added Response Validation

New function to validate and normalize the parsed response:

```python
def _validate_review_response(result: dict) -> dict:
    """Validate and normalize the code review response."""
    required_keys = {"review", "suggestions", "score"}
    if not all(k in result for k in required_keys):
        missing = required_keys - set(result.keys())
        raise ValueError(f"Response missing required keys: {missing}")
    
    # Normalize types
    result["review"] = str(result["review"])
    result["suggestions"] = list(result["suggestions"]) if result["suggestions"] else []
    result["score"] = max(1, min(10, int(result["score"]) if result["score"] else 5))
    
    return result
```

#### 4. Added Comprehensive Error Handling

Wrapped API calls in try/except with specific error types:

```python
try:
    response = await client.chat.completions.create(...)
    
    # Validate response structure
    if not response.choices:
        raise ValueError("No choices returned from API")
    
    content = response.choices[0].message.content
    finish_reason = response.choices[0].finish_reason
    
    if not content:
        raise ValueError(f"Empty response from model (finish_reason: {finish_reason})")
    
    result = _extract_json_from_text(content)
    return _validate_review_response(result)
    
except json.JSONDecodeError as e:
    raise ValueError(f"Invalid JSON in model response: {e}")
except (BadRequestError, RateLimitError, APIError) as e:
    raise ValueError(f"Azure OpenAI API error: {type(e).__name__}: {e}")
```

#### 5. Improved Prompts

Updated system prompts to explicitly request JSON-only output:

```python
system_prompt = """You are an expert code reviewer...

You MUST respond with ONLY a valid JSON object (no markdown, no extra text) with these exact keys:
- "review": string with your overall assessment
- "suggestions": array of strings with improvement suggestions  
- "score": integer from 1 to 10"""

user_prompt = f"""Review this {language} code:
...
Respond with JSON only."""
```

#### 6. Updated API Version

```python
# Before
api_version="2024-02-15-preview"

# After
api_version="2024-08-01-preview"
```

---

## Verification

### Test Command

```bash
curl -s -X POST http://localhost:8000/review \
  -H "Content-Type: application/json" \
  -d '{"code": "def add(a, b):\n    return a + b\n\nresult = add(5, 3)\nprint(result)", "language": "python"}' \
  | python3 -m json.tool
```

### Successful Response

```json
{
    "review": "The function correctly adds two numbers and the script prints the result. It's a minimal, working example but lacks common best practices for reusability and maintainability.",
    "suggestions": [
        "Add type hints and a docstring to the add function to clarify input/output expectations.",
        "Wrap execution in a main() function and use a if __name__ == '__main__' guard to avoid running on import.",
        "Consider supporting broader numeric types (e.g., float) or using TypeVar for generic numeric types.",
        "Add basic input validation or unit tests to ensure robustness if used in larger contexts."
    ],
    "score": 8
}
```

---

## Key Learnings

1. **Model compatibility varies** — Parameters like `response_format`, `temperature`, and `max_tokens` are not universally supported across all Azure OpenAI models
2. **Always validate LLM responses** — Never assume the response will be in the expected format
3. **Provide clear error messages** — Include `finish_reason` and other context when errors occur
4. **Prompt engineering matters** — When structured output modes aren't available, explicit instructions in the prompt can achieve similar results
5. **Graceful JSON extraction** — Models may wrap JSON in markdown code blocks; handle this case

---

## Files Changed

| File | Changes |
|------|---------|
| `src/backend/app/llm.py` | Complete rewrite of `get_code_review()` and `get_code_suggestions()` with validation and error handling |
