import { useState } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import CodeInput from './components/CodeInput'
import ReviewResults from './components/ReviewResults'
import { reviewCode, ReviewResult } from './services/api'

// Component to show a skeleton loader while waiting for review results
function SkeletonLoader() {
  return (
    <div className="bg-white border border-gray-200 p-8 animate-pulse">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="w-20 h-20 bg-black"></div>
      </div>

      <div className="mb-8 pb-6 border-b border-gray-200">
        <div className="h-4 bg-gray-900 rounded-none w-32 mb-3 uppercase"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded-none w-full"></div>
          <div className="h-3 bg-gray-200 rounded-none w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded-none w-4/6"></div>
        </div>
      </div>

      <div>
        <div className="h-4 bg-gray-900 rounded-none w-32 mb-3 uppercase"></div>
        <div className="space-y-4">
          <div className="h-3 bg-gray-200 rounded-none w-full"></div>
          <div className="h-3 bg-gray-200 rounded-none w-4/5"></div>
          <div className="h-3 bg-gray-200 rounded-none w-5/6"></div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please enter some code to review')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const reviewResult = await reviewCode(code, language)
      setResult(reviewResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        <header className="bg-black border-b border-gray-200 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-vice text-white tracking-wide uppercase italic" style={{ letterSpacing: '0.05em' }}>Code Review Assistant</h1>
            <p className="text-gray-300 mt-2 text-sm uppercase tracking-widest font-semibold">AI-powered code review using Azure OpenAI</p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <CodeInput
              code={code}
              language={language}
              onCodeChange={setCode}
              onLanguageChange={setLanguage}
              onSubmit={handleSubmit}
              loading={loading}
            />
            {error && (
              <div className="mt-4 p-4 bg-black text-white rounded-none border-l-4 border-black">
                {error}
              </div>
            )}
          </div>

          <div>
            {loading ? (
              <SkeletonLoader />
            ) : (
              <ReviewResults result={result} code={code} language={language} />
            )}
          </div>
        </div>
      </main>

        <footer className="bg-black border-t border-gray-200 py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400 text-xs uppercase tracking-widest">Built during AI Engineering Workshop</p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}

export default App
