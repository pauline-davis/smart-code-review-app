import React, { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    // Reset the error boundary state
    this.setState({
      hasError: false,
      error: null
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <div className="bg-white border-2 border-black p-8">
              <h1 className="text-4xl font-black text-black mb-6 uppercase tracking-tight">
                Something Went Wrong
              </h1>
              
              <div className="mb-6 border-l-4 border-black pl-4">
                <p className="text-black mb-2">
                  We encountered an unexpected error. This has been logged for investigation.
                </p>
                {this.state.error && (
                  <details className="mt-4">
                    <summary className="text-sm font-black uppercase tracking-widest cursor-pointer hover:text-gray-600">
                      Technical Details
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-3 overflow-auto border border-black">
                      {this.state.error.toString()}
                    </pre>
                  </details>
                )}
              </div>

              <button
                onClick={this.handleReset}
                className="w-full bg-black text-white py-3 px-6 font-black uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
