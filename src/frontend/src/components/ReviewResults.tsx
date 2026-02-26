import { useState } from 'react'
import { ReviewResult, Suggestion, getSuggestions } from '../services/api'

interface ReviewResultsProps {
  result: ReviewResult | null
  code: string
  language: string
}

function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span className="bg-black text-white text-xs px-3 py-1 font-black uppercase tracking-wider">
      {severity}
    </span>
  )
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="bg-white text-black border-2 border-black text-xs px-3 py-1 font-black uppercase tracking-wider">
      {category}
    </span>
  )
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="bg-black text-white text-3xl font-black w-24 h-24 flex items-center justify-center">
      {score}/10
    </div>
  )
}

function ReviewResults({ result, code, language }: ReviewResultsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [additionalSuggestions, setAdditionalSuggestions] = useState<Suggestion[]>([])
  const [loadingMore, setLoadingMore] = useState(false)

  // Add a copy button that copies the suggestion text to clipboard
  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      // Hide the "Copied!" message after 2 seconds
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  // Add a button to fetch additional suggestions
  // Append new suggestions to the existing results
  const handleGetMoreSuggestions = async () => {
    if (!code) return
    
    setLoadingMore(true)
    try {
      const newSuggestions = await getSuggestions(code, language)
      setAdditionalSuggestions(prev => [...prev, ...newSuggestions])
    } catch (err) {
      console.error('Failed to get more suggestions:', err)
    } finally {
      setLoadingMore(false)
    }
  }

  if (!result) {
    return (
      <div className="bg-white border border-gray-200 p-8">
        <h2 className="text-3xl font-black mb-4 text-black tracking-tight uppercase">Review Results</h2>
        <p className="text-gray-600 text-sm">
          Enter some code and click <span className="font-black">"REVIEW CODE"</span> to get AI-powered feedback.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
        <h2 className="text-3xl font-black text-black tracking-tight uppercase">Review Results</h2>
        <ScoreBadge score={result.score} />
      </div>

      <div className="mb-8 pb-6 border-b border-gray-200">
        <h3 className="font-black text-black mb-4 uppercase tracking-widest text-xs">Overall Review</h3>
        <p className="text-black leading-relaxed">
          {result.review}
        </p>
      </div>

      <div>
        <h3 className="font-black text-black mb-4 uppercase tracking-widest text-xs">Suggestions</h3>
        <ul className="space-y-6">
          {[...result.suggestions, ...additionalSuggestions].map((suggestion, index) => (
            <li
              key={index}
              className="border-l-4 border-black pl-4 py-2 hover:bg-gray-50 transition-colors duration-200 group"
            >
              <div className="flex gap-3 mb-3">
                <SeverityBadge severity={suggestion.severity} />
                <CategoryBadge category={suggestion.category} />
              </div>
              <div className="flex items-start justify-between gap-4">
                <p className="text-black flex-1 leading-relaxed">
                  {suggestion.text}
                </p>
                <button
                  onClick={() => handleCopy(suggestion.text, index)}
                  className="flex-shrink-0 p-2 hover:bg-black hover:text-white transition-colors duration-200"
                  title="Copy to clipboard"
                >
                  {copiedIndex === index ? (
                    <span className="text-black text-xs font-black whitespace-nowrap uppercase">Copied!</span>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600 group-hover:text-black transition-colors duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
        
        <button
          onClick={handleGetMoreSuggestions}
          disabled={loadingMore}
          className="mt-8 w-full bg-black text-white py-3 px-6 font-black uppercase tracking-widest text-sm hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loadingMore ? 'Loading...' : 'Get More Suggestions'}
        </button>
      </div>
    </div>
  )
}

export default ReviewResults
