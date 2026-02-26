"""
Tests for the Code Review Assistant API endpoints.
"""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_health_endpoint_returns_status_healthy():
    """Test the health endpoint returns status healthy."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "code-review-assistant"
    assert "version" in data


@pytest.mark.asyncio
async def test_review_endpoint_with_valid_python_code():
    """Test the review endpoint with valid Python code."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/review",
            json={
                "code": "def calculate_sum(a, b):\n    return a + b",
                "language": "python"
            }
        )
    
    assert response.status_code == 200
    data = response.json()
    
    # Check response structure
    assert "review" in data
    assert "suggestions" in data
    assert "score" in data
    
    # Validate suggestions structure
    assert isinstance(data["suggestions"], list)
    if len(data["suggestions"]) > 0:
        suggestion = data["suggestions"][0]
        assert "text" in suggestion
        assert "severity" in suggestion
        assert "category" in suggestion
        assert suggestion["severity"] in ["critical", "high", "medium", "low"]
        assert suggestion["category"] in ["security", "performance", "readability", "maintainability"]
    
    # Validate score range
    assert isinstance(data["score"], int)
    assert 1 <= data["score"] <= 10


@pytest.mark.asyncio
async def test_review_endpoint_rejects_empty_code():
    """Test the review endpoint rejects empty code."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/review",
            json={
                "code": "",
                "language": "python"
            }
        )
    
    # Should return 422 validation error (code too short - min 10 chars)
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data


@pytest.mark.asyncio
async def test_review_endpoint_rejects_code_too_short():
    """Test the review endpoint rejects code shorter than minimum length."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/review",
            json={
                "code": "x = 1",  # Less than 10 characters
                "language": "python"
            }
        )
    
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data


@pytest.mark.asyncio
async def test_review_endpoint_with_context():
    """Test the review endpoint with optional context parameter."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/review",
            json={
                "code": "def process_data(data):\n    return [x * 2 for x in data]",
                "language": "python",
                "context": "Helper function for data processing pipeline"
            }
        )
    
    assert response.status_code == 200
    data = response.json()
    assert "review" in data
    assert "suggestions" in data
    assert "score" in data


@pytest.mark.asyncio
async def test_complexity_endpoint_with_valid_code():
    """Test the complexity endpoint analyzes code metrics."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/complexity",
            json={
                "code": """def example():\n    if True:\n        for i in range(10):\n            pass\n\ndef another():\n    pass""",
                "language": "python"
            }
        )
    
    assert response.status_code == 200
    data = response.json()
    
    # Check response structure
    assert "lines" in data
    assert "functions" in data
    assert "max_nesting_depth" in data
    assert "complexity_score" in data
    assert "analysis" in data
    
    # Validate data types and ranges
    assert isinstance(data["lines"], int)
    assert isinstance(data["functions"], int)
    assert isinstance(data["max_nesting_depth"], int)
    assert isinstance(data["complexity_score"], int)
    assert 1 <= data["complexity_score"] <= 10


@pytest.mark.asyncio
async def test_suggest_endpoint_with_valid_code():
    """Test the suggest endpoint returns improvement suggestions."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/suggest",
            json={
                "code": "def add(x, y):\n    return x + y",
                "language": "python"
            }
        )
    
    assert response.status_code == 200
    data = response.json()
    assert "suggestions" in data
    assert isinstance(data["suggestions"], list)