import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ReviewResults from './ReviewResults'
import type { ReviewResult } from '../services/api'

// Mock the API module
vi.mock('../services/api', () => ({
  getSuggestions: vi.fn(),
}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
})

describe('ReviewResults Component', () => {
  const mockCode = 'def hello():\n    print("Hello")'
  const mockLanguage = 'python'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Empty State', () => {
    it('displays empty state message when result is null', () => {
      render(<ReviewResults result={null} code={mockCode} language={mockLanguage} />)
      
      expect(screen.getByText(/Review Results/i)).toBeInTheDocument()
      expect(screen.getByText(/Enter some code and click/i)).toBeInTheDocument()
      expect(screen.getByText(/"REVIEW CODE"/i)).toBeInTheDocument()
    })

    it('does not show suggestions section when result is null', () => {
      render(<ReviewResults result={null} code={mockCode} language={mockLanguage} />)
      
      expect(screen.queryByText(/Suggestions/i)).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Get More Suggestions/i })).not.toBeInTheDocument()
    })
  })

  describe('Display Review Results', () => {
    const mockResult: ReviewResult = {
      review: 'This code is well-structured and follows best practices.',
      score: 8,
      suggestions: [
        {
          text: 'Consider adding type hints for better code clarity',
          severity: 'medium',
          category: 'readability'
        },
        {
          text: 'Add error handling for edge cases',
          severity: 'high',
          category: 'maintainability'
        }
      ]
    }

    it('displays overall review text', () => {
      render(<ReviewResults result={mockResult} code={mockCode} language={mockLanguage} />)
      
      expect(screen.getByText(/This code is well-structured/i)).toBeInTheDocument()
    })

    it('displays score badge with correct value', () => {
      render(<ReviewResults result={mockResult} code={mockCode} language={mockLanguage} />)
      
      expect(screen.getByText('8/10')).toBeInTheDocument()
    })

    it('displays all suggestions with text', () => {
      render(<ReviewResults result={mockResult} code={mockCode} language={mockLanguage} />)
      
      expect(screen.getByText(/Consider adding type hints/i)).toBeInTheDocument()
      expect(screen.getByText(/Add error handling for edge cases/i)).toBeInTheDocument()
    })

    it('displays severity badges for each suggestion', () => {
      render(<ReviewResults result={mockResult} code={mockCode} language={mockLanguage} />)
      
      expect(screen.getByText('medium')).toBeInTheDocument()
      expect(screen.getByText('high')).toBeInTheDocument()
    })

    it('displays category badges for each suggestion', () => {
      render(<ReviewResults result={mockResult} code={mockCode} language={mockLanguage} />)
      
      expect(screen.getByText('readability')).toBeInTheDocument()
      expect(screen.getByText('maintainability')).toBeInTheDocument()
    })
  })

  describe('Score Badge Edge Cases', () => {
    it('displays score badge with low score', () => {
      const lowScoreResult: ReviewResult = {
        review: 'Needs improvement',
        score: 3,
        suggestions: []
      }
      
      render(<ReviewResults result={lowScoreResult} code={mockCode} language={mockLanguage} />)
      
      expect(screen.getByText('3/10')).toBeInTheDocument()
    })

    it('displays score badge with perfect score', () => {
      const perfectResult: ReviewResult = {
        review: 'Excellent code!',
        score: 10,
        suggestions: []
      }
      
      render(<ReviewResults result={perfectResult} code={mockCode} language={mockLanguage} />)
      
      expect(screen.getByText('10/10')).toBeInTheDocument()
    })
  })

  describe('Empty Suggestions', () => {
    it('handles result with no suggestions', () => {
      const noSuggestionsResult: ReviewResult = {
        review: 'Perfect code!',
        score: 10,
        suggestions: []
      }
      
      render(<ReviewResults result={noSuggestionsResult} code={mockCode} language={mockLanguage} />)
      
      expect(screen.getByText(/Perfect code!/i)).toBeInTheDocument()
      const suggestionsHeading = screen.getByRole('heading', { name: /Suggestions/i })
      expect(suggestionsHeading).toBeInTheDocument()
      // No suggestion items should be present
      const suggestionsList = screen.getByRole('list')
      expect(suggestionsList.children).toHaveLength(0)
    })
  })

  describe('Copy Functionality', () => {
    const mockResult: ReviewResult = {
      review: 'Good code',
      score: 8,
      suggestions: [
        {
          text: 'Add type hints',
          severity: 'medium',
          category: 'readability'
        }
      ]
    }

    it('displays copy button for each suggestion', () => {
      render(<ReviewResults result={mockResult} code={mockCode} language={mockLanguage} />)
      
      const copyButtons = screen.getAllByTitle('Copy to clipboard')
      expect(copyButtons).toHaveLength(1)
    })

    it('displays multiple copy buttons when multiple suggestions exist', () => {
      const multiSuggestionResult: ReviewResult = {
        review: 'Good code',
        score: 8,
        suggestions: [
          { text: 'First suggestion', severity: 'low', category: 'readability' },
          { text: 'Second suggestion', severity: 'medium', category: 'security' },
          { text: 'Third suggestion', severity: 'high', category: 'performance' }
        ]
      }
      
      render(<ReviewResults result={multiSuggestionResult} code={mockCode} language={mockLanguage} />)
      
      const copyButtons = screen.getAllByTitle('Copy to clipboard')
      expect(copyButtons).toHaveLength(3)
    })
  })

  describe('Get More Suggestions', () => {
    const mockResult: ReviewResult = {
      review: 'Good code',
      score: 7,
      suggestions: [
        { text: 'Initial suggestion', severity: 'medium', category: 'readability' }
      ]
    }

    it('displays "Get More Suggestions" button when result is present', () => {
      render(<ReviewResults result={mockResult} code={mockCode} language={mockLanguage} />)
      
      expect(screen.getByRole('button', { name: /Get More Suggestions/i })).toBeInTheDocument()
    })

    it('does not display "Get More Suggestions" button when result is null', () => {
      render(<ReviewResults result={null} code={mockCode} language={mockLanguage} />)
      
      expect(screen.queryByRole('button', { name: /Get More Suggestions/i })).not.toBeInTheDocument()
    })

    it('button is enabled by default', () => {
      render(<ReviewResults result={mockResult} code={mockCode} language={mockLanguage} />)
      
      const button = screen.getByRole('button', { name: /Get More Suggestions/i })
      expect(button).not.toBeDisabled()
    })
  })

  describe('Long Text Handling', () => {
    it('handles very long suggestion text', () => {
      const longText = 'This is a very long suggestion text that should still be displayed properly. '.repeat(10)
      
      const longTextResult: ReviewResult = {
        review: 'Review with long suggestion',
        score: 7,
        suggestions: [
          { text: longText, severity: 'medium', category: 'readability' }
        ]
      }
      
      render(<ReviewResults result={longTextResult} code={mockCode} language={mockLanguage} />)
      
      // Use a more flexible matcher for long text - get the p element
      const elements = screen.getAllByText((_content, element) => {
        return element?.tagName.toLowerCase() === 'p' && element?.textContent === longText
      })
      expect(elements.length).toBeGreaterThan(0)
    })

    it('handles very long review text', () => {
      const longReview = 'This is a very long review text. '.repeat(20)
      
      const longReviewResult: ReviewResult = {
        review: longReview,
        score: 6,
        suggestions: []
      }
      
      render(<ReviewResults result={longReviewResult} code={mockCode} language={mockLanguage} />)
      
      // Use a more flexible matcher for long text - get the p element  
      const elements = screen.getAllByText((_content, element) => {
        return element?.tagName.toLowerCase() === 'p' && element?.textContent === longReview
      })
      expect(elements.length).toBeGreaterThan(0)
    })
  })

  describe('Multiple Severity and Category Types', () => {
    it('displays all severity types correctly', () => {
      const allSeveritiesResult: ReviewResult = {
        review: 'Testing all severities',
        score: 5,
        suggestions: [
          { text: 'Critical issue', severity: 'critical', category: 'security' },
          { text: 'High priority', severity: 'high', category: 'performance' },
          { text: 'Medium priority', severity: 'medium', category: 'readability' },
          { text: 'Low priority', severity: 'low', category: 'maintainability' }
        ]
      }
      
      render(<ReviewResults result={allSeveritiesResult} code={mockCode} language={mockLanguage} />)
      
      expect(screen.getByText('critical')).toBeInTheDocument()
      expect(screen.getByText('high')).toBeInTheDocument()
      expect(screen.getByText('medium')).toBeInTheDocument()
      expect(screen.getByText('low')).toBeInTheDocument()
    })

    it('displays all category types correctly', () => {
      const allCategoriesResult: ReviewResult = {
        review: 'Testing all categories',
        score: 6,
        suggestions: [
          { text: 'Security issue', severity: 'high', category: 'security' },
          { text: 'Performance issue', severity: 'medium', category: 'performance' },
          { text: 'Readability issue', severity: 'low', category: 'readability' },
          { text: 'Maintainability issue', severity: 'medium', category: 'maintainability' }
        ]
      }
      
      render(<ReviewResults result={allCategoriesResult} code={mockCode} language={mockLanguage} />)
      
      expect(screen.getByText('security')).toBeInTheDocument()
      expect(screen.getByText('performance')).toBeInTheDocument()
      expect(screen.getByText('readability')).toBeInTheDocument()
      expect(screen.getByText('maintainability')).toBeInTheDocument()
    })
  })
})
