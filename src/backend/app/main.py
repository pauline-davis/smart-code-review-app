"""
Code Review Assistant - Backend API

This FastAPI application provides endpoints for AI-powered code review.
"""

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from openai import APIError, APIConnectionError, RateLimitError, AuthenticationError
import json

from .llm import get_code_review, get_code_suggestions

app = FastAPI(
    title="Code Review Assistant API",
    description="AI-powered code review using Azure OpenAI",
    version="1.0.0"
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CodeReviewRequest(BaseModel):
    """Request model for code review."""
    code: str = Field(..., min_length=10, max_length=10000, description="Code to review")
    language: Optional[str] = "python"
    context: Optional[str] = None


class Suggestion(BaseModel):
    """Model for a code review suggestion."""
    text: str
    severity: str  # critical, high, medium, low
    category: str  # security, performance, readability, maintainability


class CodeReviewResponse(BaseModel):
    """Response model for code review."""
    review: str
    suggestions: List[Suggestion]
    score: int  # 1-10 quality score


class ComplexityResponse(BaseModel):
    """Response model for code complexity analysis."""
    lines: int
    functions: int
    max_nesting_depth: int
    complexity_score: int  # 1-10, lower is better
    analysis: str


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "code-review-assistant",
        "version": "1.0.0"
    }


@app.post("/review", response_model=CodeReviewResponse)
async def review_code(request: CodeReviewRequest):
    """
    Review code and provide feedback.
    
    Handles various error cases:
    - Authentication errors (invalid API key)
    - Rate limiting (too many requests)
    - Network/connection issues
    - Invalid API responses
    """
    try:
        review_result = await get_code_review(
            code=request.code,
            language=request.language,
            context=request.context
        )
        return review_result
    
    # Handle authentication errors (invalid API key or unauthorized access)
    except AuthenticationError as e:
        raise HTTPException(
            status_code=401,
            detail="Authentication failed. Please check your Azure OpenAI API credentials."
        )
    
    # Handle rate limiting errors (too many requests to the API)
    except RateLimitError as e:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please try again later."
        )
    
    # Handle network/connection errors (API unavailable, timeout, etc.)
    except APIConnectionError as e:
        raise HTTPException(
            status_code=503,
            detail="Unable to connect to Azure OpenAI service. Please try again later."
        )
    
    # Handle general API errors from Azure OpenAI
    except APIError as e:
        raise HTTPException(
            status_code=502,
            detail=f"Azure OpenAI API error: {str(e)}"
        )
    
    # Handle JSON parsing errors (invalid response format from LLM)
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to parse AI response. The model returned an invalid format."
        )
    
    # Handle validation errors (response doesn't match expected schema)
    except KeyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid response structure from AI: missing field {str(e)}"
        )
    
    # Catch-all for any other unexpected errors
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )


@app.post("/suggest")
async def suggest_improvements(request: CodeReviewRequest):
    """
    Get specific improvement suggestions for code.
    
    TODO: Workshop Exercise
    - Implement this endpoint to return actionable suggestions
    """
    try:
        suggestions = await get_code_suggestions(
            code=request.code,
            language=request.language
        )
        return {"suggestions": suggestions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/complexity", response_model=ComplexityResponse)
async def analyze_complexity(request: CodeReviewRequest):
    """
    Analyze code complexity and return metrics based on:
    - Total lines of code
    - Number of functions/methods
    - Maximum nesting depth (indentation levels)
    
    Returns a complexity score from 1-10 where higher means more complex.
    """
    try:
        code = request.code
        
        # Step 1: Split code into lines and count them
        lines = code.strip().split('\n')
        line_count = len(lines)
        
        # Step 2: Count functions/methods using keyword detection
        # Looks for common function definition keywords across languages
        function_keywords = ['def ', 'function ', 'async def ', 'func ', 'fn ']
        function_count = sum(
            1 for line in lines 
            if any(keyword in line.strip() for keyword in function_keywords)
        )
        
        # Step 3: Calculate maximum nesting depth by analyzing indentation
        max_depth = 0
        
        for line in lines:
            # Remove leading whitespace to check if line is empty or comment
            stripped = line.lstrip()
            
            # Skip empty lines and comments (Python # and JavaScript/Java //)
            if not stripped or stripped.startswith('#') or stripped.startswith('//'):
                continue
            
            # Calculate indentation level
            # Assumes: 4 spaces = 1 level OR 1 tab = 1 level
            indent = len(line) - len(stripped)
            if '\t' in line:
                # Tab-based indentation: count tabs
                depth = line.count('\t', 0, indent)
            else:
                # Space-based indentation: divide by 4 (common convention)
                depth = indent // 4
            
            # Track the maximum depth encountered
            max_depth = max(max_depth, depth)
        
        # Step 4: Calculate complexity score (1-10 scale)
        # Start at 1 (minimum complexity) and add points based on metrics
        score = 1
        
        # Add points based on line count (0-3 points)
        # More lines = harder to understand and maintain
        if line_count > 200:
            score += 3  # Very long file
        elif line_count > 100:
            score += 2  # Long file
        elif line_count > 50:
            score += 1  # Medium file
        
        # Add points based on function count (0-3 points)
        # More functions = more cognitive load
        if function_count > 10:
            score += 3  # Many functions
        elif function_count > 5:
            score += 2  # Several functions
        elif function_count > 2:
            score += 1  # A few functions
        
        # Add points based on nesting depth (0-4 points)
        # Deep nesting = harder to follow logic flow
        if max_depth > 5:
            score += 4  # Very deeply nested
        elif max_depth > 3:
            score += 3  # Deeply nested
        elif max_depth > 2:
            score += 2  # Moderately nested
        elif max_depth > 1:
            score += 1  # Slightly nested
        
        # Ensure score doesn't exceed maximum
        score = min(score, 10)
        
        # Step 5: Generate human-readable analysis based on score
        if score <= 3:
            analysis = "Low complexity - code is simple and easy to understand."
        elif score <= 6:
            analysis = "Moderate complexity - code is reasonably maintainable."
        elif score <= 8:
            analysis = "High complexity - consider refactoring for better maintainability."
        else:
            analysis = "Very high complexity - strongly recommend breaking into smaller functions."
        
        # Step 6: Return structured response with all metrics
        return ComplexityResponse(
            lines=line_count,
            functions=function_count,
            max_nesting_depth=max_depth,
            complexity_score=score,
            analysis=analysis
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
