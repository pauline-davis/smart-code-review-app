interface CodeInputProps {
  code: string
  language: string
  onCodeChange: (code: string) => void
  onLanguageChange: (language: string) => void
  onSubmit: () => void
  loading: boolean
}

const LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
]

// Function to detect programming language from code content
// Checks for common patterns: def/class for Python, function/const for JavaScript, etc.
function detectLanguage(code: string): string {
  if (!code || code.trim().length === 0) {
    return 'python' // Default to Python
  }

  // Python patterns
  if (
    /\bdef\s+\w+\s*\(/.test(code) ||
    /\bclass\s+\w+/.test(code) ||
    /import\s+\w+/.test(code) ||
    /from\s+\w+\s+import/.test(code) ||
    /__init__/.test(code)
  ) {
    return 'python'
  }

  // TypeScript patterns (check before JavaScript)
  if (
    /:\s*(string|number|boolean|void|any)\b/.test(code) ||
    /interface\s+\w+/.test(code) ||
    /type\s+\w+\s*=/.test(code) ||
    /<\w+>/.test(code) && /function/.test(code)
  ) {
    return 'typescript'
  }

  // JavaScript patterns
  if (
    /\bfunction\s+\w+\s*\(/.test(code) ||
    /\bconst\s+\w+/.test(code) ||
    /\blet\s+\w+/.test(code) ||
    /\bvar\s+\w+/.test(code) ||
    /=>\s*{/.test(code) ||
    /console\.log/.test(code)
  ) {
    return 'javascript'
  }

  // Java patterns
  if (
    /\bpublic\s+class/.test(code) ||
    /\bpublic\s+static\s+void\s+main/.test(code) ||
    /\bprivate\s+\w+\s+\w+/.test(code) ||
    /System\.out\.println/.test(code)
  ) {
    return 'java'
  }

  // C# patterns
  if (
    /\bnamespace\s+\w+/.test(code) ||
    /\busing\s+System/.test(code) ||
    /Console\.WriteLine/.test(code) ||
    /\bpublic\s+class/.test(code) && /namespace/.test(code)
  ) {
    return 'csharp'
  }

  // Default to Python if no patterns match
  return 'python'
}

function CodeInput({
  code,
  language,
  onCodeChange,
  onLanguageChange,
  onSubmit,
  loading
}: CodeInputProps) {
  // Add validation before submit:
  // - Code must be at least 10 characters
  // - Show error message if validation fails
  // - Disable submit button while invalid
  const isCodeValid = code.trim().length >= 10
  const showValidationError = code.length > 0 && !isCodeValid

  // Auto-detect language when code is pasted
  const handleCodeChange = (newCode: string) => {
    onCodeChange(newCode)
    
    // Auto-detect language if substantial code is pasted (>20 chars)
    if (newCode.length > 20 && newCode.length > code.length + 10) {
      const detectedLang = detectLanguage(newCode)
      if (detectedLang !== language) {
        onLanguageChange(detectedLang)
      }
    }
  }

  return (
    <div className="bg-white border border-gray-200 p-8">
      <h2 className="text-3xl font-black mb-8 text-black tracking-tight uppercase">Enter Your Code</h2>
      
      <div className="mb-6">
        <label className="block text-xs font-black text-black mb-3 uppercase tracking-widest">
          Language
        </label>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="w-full px-4 py-3 bg-white border-2 border-black text-black focus:outline-none hover:bg-gray-50 transition-colors duration-200 cursor-pointer font-semibold"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-8">
        <label className="block text-xs font-black text-black mb-3 uppercase tracking-widest">
          Code
        </label>
        <textarea
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          rows={15}
          className="w-full px-4 py-3 bg-white border-2 border-black font-mono text-sm text-black focus:outline-none hover:bg-gray-50 transition-colors duration-200 placeholder-gray-400 resize-none"
          placeholder="Paste your code here..."
        />
        {showValidationError && (
          <p className="mt-2 text-xs font-semibold text-black uppercase tracking-widest">
            Code must be at least 10 characters (currently {code.trim().length})
          </p>
        )}
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || !isCodeValid}
        className="w-full bg-black text-white py-4 px-6 font-black uppercase tracking-widest text-sm hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {loading ? 'Analyzing...' : 'Review Code'}
      </button>
    </div>
  )
}

export default CodeInput
