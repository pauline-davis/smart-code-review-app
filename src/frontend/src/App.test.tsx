import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import App from './App'
import * as api from './services/api'

// Mock the API module
vi.mock('./services/api', () => ({
  reviewCode: vi.fn(),
  getSuggestions: vi.fn(),
}))

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the application title', () => {
    render(<App />)
    
    const title = screen.getByText(/Code Review Assistant/i)
    expect(title).toBeInTheDocument()
  })

  it('shows empty state message when no review results', () => {
    render(<App />)
    
    const emptyMessage = screen.getByText(/Enter some code and click/i)
    expect(emptyMessage).toBeInTheDocument()
    
    // Check that the button is present (using role instead of text)
    const reviewButton = screen.getByRole('button', { name: /Review Code/i })
    expect(reviewButton).toBeInTheDocument()
  })

  it('displays error message when API call fails', async () => {
    const user = userEvent.setup()
    
    // Mock API to reject with error
    vi.mocked(api.reviewCode).mockRejectedValueOnce(
      new Error('Failed to review code')
    )
    
    render(<App />)
    
    // Enter valid code (at least 10 characters)
    const codeInput = screen.getByPlaceholderText(/Paste your code here/i)
    await user.clear(codeInput)
    await user.type(codeInput, 'def hello():\n    print("Hello")')
    
    // Click review button
    const reviewButton = screen.getByRole('button', { name: /Review Code/i })
    await user.click(reviewButton)
    
    // Wait for error message to appear
    await waitFor(() => {
      const errorMessage = screen.getByText(/Failed to review code/i)
      expect(errorMessage).toBeInTheDocument()
    })
  })

  it('shows loading state while fetching review', async () => {
    const user = userEvent.setup()
    
    // Mock API to return a promise that we can control
    let resolveReview: (value: any) => void
    const reviewPromise = new Promise((resolve) => {
      resolveReview = resolve
    })
    vi.mocked(api.reviewCode).mockReturnValue(reviewPromise as any)
    
    render(<App />)
    
    // Enter valid code
    const codeInput = screen.getByPlaceholderText(/Paste your code here/i)
    await user.clear(codeInput)
    await user.type(codeInput, 'def test():\n    pass')
    
    // Click review button
    const reviewButton = screen.getByRole('button', { name: /Review Code/i })
    await user.click(reviewButton)
    
    // Check for loading state
    await waitFor(() => {
      expect(screen.getByText(/Analyzing/i)).toBeInTheDocument()
    })
    
    // Resolve the promise to clean up
    resolveReview!({
      review: 'Test review',
      suggestions: [],
      score: 8
    })
    
    await waitFor(() => {
      expect(screen.queryByText(/Analyzing/i)).not.toBeInTheDocument()
    })
  })

  it('submits code review when form is filled correctly', async () => {
    const user = userEvent.setup()
    
    // Mock successful API response
    const mockResponse = {
      review: 'This is a well-structured function',
      suggestions: [
        {
          text: 'Consider adding type hints',
          severity: 'medium',
          category: 'readability'
        }
      ],
      score: 8
    }
    vi.mocked(api.reviewCode).mockResolvedValueOnce(mockResponse)
    
    render(<App />)
    
    // Enter code
    const codeInput = screen.getByPlaceholderText(/Paste your code here/i)
    await user.clear(codeInput)
    await user.type(codeInput, 'def calculate_sum(a, b):\n    return a + b')
    
    // Submit review
    const reviewButton = screen.getByRole('button', { name: /Review Code/i })
    await user.click(reviewButton)
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByText(/This is a well-structured function/i)).toBeInTheDocument()
      expect(screen.getByText(/Consider adding type hints/i)).toBeInTheDocument()
    })
  })

  it('validates code length before submission', async () => {
    const user = userEvent.setup()
    
    render(<App />)
    
    // Enter code that's too short (less than 10 characters)
    const codeInput = screen.getByPlaceholderText(/Paste your code here/i)
    await user.clear(codeInput)
    await user.type(codeInput, 'test')
    
    // Button should be disabled
    const reviewButton = screen.getByRole('button', { name: /Review Code/i })
    expect(reviewButton).toBeDisabled()
    
    // Validation message should appear
    expect(screen.getByText(/Code must be at least 10 characters/i)).toBeInTheDocument()
  })

  it('displays score badge with review results', async () => {
    const user = userEvent.setup()
    
    const mockResponse = {
      review: 'Good code quality',
      suggestions: [],
      score: 9
    }
    vi.mocked(api.reviewCode).mockResolvedValueOnce(mockResponse)
    
    render(<App />)
    
    const codeInput = screen.getByPlaceholderText(/Paste your code here/i)
    await user.clear(codeInput)
    await user.type(codeInput, 'def hello():\n    return "world"')
    
    const reviewButton = screen.getByRole('button', { name: /Review Code/i })
    await user.click(reviewButton)
    
    await waitFor(() => {
      expect(screen.getByText(/9\/10/i)).toBeInTheDocument()
    })
  })
})
