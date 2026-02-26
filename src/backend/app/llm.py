"""
Azure OpenAI Client for Code Review

This module handles all interactions with Azure OpenAI.
"""

import os
import json
import re
from openai import AsyncAzureOpenAI, APIError, BadRequestError, RateLimitError
from typing import Optional

# Configuration from environment
AZURE_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT", "")
AZURE_API_KEY = os.getenv("AZURE_OPENAI_API_KEY", "")
DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-5-nano")

# Initialize client (will be None if credentials not set)
client = None
if AZURE_ENDPOINT and AZURE_API_KEY:
    client = AsyncAzureOpenAI(
        azure_endpoint=AZURE_ENDPOINT,
        api_key=AZURE_API_KEY,
        api_version="2024-08-01-preview"
    )


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


def _validate_review_response(result: dict) -> dict:
    """Validate and normalize the code review response."""
    required_keys = {"review", "suggestions", "score"}
    if not all(k in result for k in required_keys):
        missing = required_keys - set(result.keys())
        raise ValueError(f"Response missing required keys: {missing}")
    
    # Normalize types
    result["review"] = str(result["review"])
    result["suggestions"] = list(result["suggestions"]) if result["suggestions"] else []
    result["score"] = int(result["score"]) if result["score"] else 5
    
    # Clamp score to valid range
    result["score"] = max(1, min(10, result["score"]))
    
    return result


async def get_code_review(
    code: str,
    language: str = "python",
    context: Optional[str] = None
) -> dict:
    """
    Get an AI-powered code review.
    
    Args:
        code: The code to review
        language: Programming language
        context: Optional context about the code
    
    Returns:
        Dictionary with review, suggestions, and score
    """
    if not client:
        # Return mock response when no API configured
        return {
            "review": "Mock review: Code looks good! (API not configured)",
            "suggestions": [
                {
                    "text": "Add more comments to explain complex logic",
                    "severity": "low",
                    "category": "readability"
                },
                {
                    "text": "Consider adding error handling for edge cases",
                    "severity": "medium",
                    "category": "maintainability"
                }
            ],
            "score": 7
        }
    
    system_prompt = """You are an expert code reviewer with deep expertise in software engineering best practices.

Analyze the provided code focusing on these areas:
- **Security**: Identify vulnerabilities, injection risks, authentication/authorization issues
- **Performance**: Spot inefficiencies, unnecessary operations, optimization opportunities
- **Readability**: Assess code clarity, naming conventions, documentation quality
- **Maintainability**: Evaluate structure, modularity, and ease of future changes
- **Best Practices**: Check adherence to language-specific conventions and patterns

Provide your analysis in the following format:

1. **Overall Review** (2-3 sentences): Brief summary of code quality and main observations

2. **Suggestions** (3-5 items): Specific, actionable improvements with:
   - Clear description of what to improve
   - Severity level: "critical", "high", "medium", or "low"
   - Focus area: "security", "performance", "readability", or "maintainability"

3. **Quality Score** (1-10): Overall code quality rating where:
   - 1-3: Poor quality, requires significant refactoring
   - 4-6: Acceptable but needs improvement
   - 7-8: Good quality with minor issues
   - 9-10: Excellent, production-ready code

IMPORTANT: You MUST respond with ONLY a valid JSON object (no markdown, no extra text).
Format your response as JSON:
{
  "review": "overall review text",
  "suggestions": [
    {
      "text": "suggestion description",
      "severity": "critical|high|medium|low",
      "category": "security|performance|readability|maintainability"
    }
  ],
  "score": integer
}"""
    
    user_prompt = f"""Review this {language} code:

```{language}
{code}
```

{f"Context: {context}" if context else ""}

Respond with JSON only."""
    
    try:
        response = await client.chat.completions.create(
            model=DEPLOYMENT_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_completion_tokens=2000
        )
        
        # Validate response structure
        if not response.choices:
            raise ValueError("No choices returned from API")
        
        content = response.choices[0].message.content
        finish_reason = response.choices[0].finish_reason
        
        if not content:
            raise ValueError(f"Empty response from model (finish_reason: {finish_reason})")
        
        # Parse and validate JSON
        result = _extract_json_from_text(content)
        return _validate_review_response(result)
        
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in model response: {e}")
    except (BadRequestError, RateLimitError, APIError) as e:
        raise ValueError(f"Azure OpenAI API error: {type(e).__name__}: {e}")
    except Exception as e:
        if isinstance(e, ValueError):
            raise
        raise ValueError(f"Unexpected error during code review: {type(e).__name__}: {e}")


async def get_code_suggestions(
    code: str,
    language: str = "python"
) -> list[dict]:
    """
    Get specific improvement suggestions for code.
    
    Args:
        code: The code to review
        language: Programming language
    
    Returns:
        List of actionable improvement suggestions with severity and category
    """
    if not client:
        return [
            {"text": "Consider adding type hints", "severity": "medium", "category": "readability"},
            {"text": "Add docstrings to functions", "severity": "medium", "category": "maintainability"},
            {"text": "Use more descriptive variable names", "severity": "low", "category": "readability"}
        ]
    
    try:
        response = await client.chat.completions.create(
            model=DEPLOYMENT_NAME,
            messages=[
                {
                    "role": "system",
                    "content": """You are a code improvement expert. Provide 5 specific, actionable suggestions to improve the code.
You MUST respond with ONLY a valid JSON object (no markdown, no extra text) with this exact structure:
{
  "suggestions": [
    {
      "text": "Detailed suggestion text",
      "severity": "critical|high|medium|low",
      "category": "security|performance|readability|maintainability"
    }
  ]
}"""
                },
                {
                    "role": "user",
                    "content": f"Suggest improvements for this {language} code:\n\n{code}\n\nRespond with JSON only."
                }
            ],
            max_completion_tokens=1000
        )
        
        # Validate response structure
        if not response.choices:
            raise ValueError("No choices returned from API")
        
        content = response.choices[0].message.content
        finish_reason = response.choices[0].finish_reason
        
        if not content:
            raise ValueError(f"Empty response from model (finish_reason: {finish_reason})")
        
        # Parse JSON
        result = _extract_json_from_text(content)
        suggestions = result.get("suggestions", [])
        
        if not isinstance(suggestions, list):
            raise ValueError(f"Expected suggestions to be a list, got {type(suggestions)}")
        
        # Validate and structure suggestions
        structured_suggestions = []
        for s in suggestions:
            if isinstance(s, dict):
                structured_suggestions.append({
                    "text": str(s.get("text", s)),
                    "severity": str(s.get("severity", "medium")),
                    "category": str(s.get("category", "maintainability"))
                })
            else:
                # Legacy string format
                structured_suggestions.append({
                    "text": str(s),
                    "severity": "medium",
                    "category": "maintainability"
                })
        
        return structured_suggestions
        
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in model response: {e}")
    except (BadRequestError, RateLimitError, APIError) as e:
        raise ValueError(f"Azure OpenAI API error: {type(e).__name__}: {e}")
    except Exception as e:
        if isinstance(e, ValueError):
            raise
        raise ValueError(f"Unexpected error getting suggestions: {type(e).__name__}: {e}")
