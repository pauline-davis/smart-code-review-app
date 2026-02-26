const API_BASE = '/api'
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000 // 1 second

export interface Suggestion {
  text: string
  severity: string
  category: string
}

export interface ReviewResult {
  review: string
  suggestions: Suggestion[]
  score: number
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry a fetch request with exponential backoff
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param retries - Number of retries remaining
 * @returns Response from the fetch request
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = MAX_RETRIES
): Promise<Response> {
  try {
    const response = await fetch(url, options)
    
    // If successful or client error (4xx), don't retry
    if (response.ok || (response.status >= 400 && response.status < 500)) {
      return response
    }
    
    // Server error (5xx) - retry if we have retries left
    if (retries > 0) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, MAX_RETRIES - retries)
      console.warn(`Request failed with status ${response.status}. Retrying in ${delay}ms... (${retries} retries left)`)
      await sleep(delay)
      return fetchWithRetry(url, options, retries - 1)
    }
    
    return response
  } catch (error) {
    // Network error - retry if we have retries left
    if (retries > 0) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, MAX_RETRIES - retries)
      console.warn(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}. Retrying in ${delay}ms... (${retries} retries left)`)
      await sleep(delay)
      return fetchWithRetry(url, options, retries - 1)
    }
    
    // Out of retries - throw specific network error
    throw new Error('Network error: Unable to connect to the server. Please check your connection and try again.')
  }
}

export async function reviewCode(
  code: string,
  language: string
): Promise<ReviewResult> {
  const response = await fetchWithRetry(`${API_BASE}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, language }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    
    // Provide specific error messages based on status code
    if (response.status === 400) {
      throw new Error(error.detail || 'Invalid code provided. Please check your input.')
    } else if (response.status === 401) {
      throw new Error('Authentication failed. Please check your API credentials.')
    } else if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.')
    } else if (response.status === 503) {
      throw new Error('Service temporarily unavailable. Please try again later.')
    } else {
      throw new Error(error.detail || 'Failed to review code. Please try again.')
    }
  }

  return response.json()
}

export async function getSuggestions(
  code: string,
  language: string
): Promise<Suggestion[]> {
  const response = await fetchWithRetry(`${API_BASE}/suggest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, language }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    
    // Provide specific error messages based on status code
    if (response.status === 400) {
      throw new Error('Invalid request. Please check your input.')
    } else if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait before requesting more suggestions.')
    } else {
      throw new Error(error.detail || 'Failed to get suggestions. Please try again.')
    }
  }

  const data = await response.json()
  return data.suggestions
}
