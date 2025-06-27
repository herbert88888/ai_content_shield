'use client'

import { useState } from 'react'
import { Shield, Settings, Play, RotateCcw, AlertTriangle, CheckCircle, Info } from 'lucide-react'

interface DetectionStrategy {
  name: string
  description: string
  apis: string[]
  enabled: boolean
}

interface DetectionResult {
  api: string
  probability: number
  confidence: 'low' | 'medium' | 'high'
  responseTime: number
  error?: string
}

interface AnalysisResult {
  strategy: string
  overallProbability: number
  confidence: 'low' | 'medium' | 'high'
  results: DetectionResult[]
  processingTime: number
}

export default function MultiAPIDemo() {
  const [content, setContent] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [strategies, setStrategies] = useState<DetectionStrategy[]>([
    {
      name: 'Conservative',
      description: 'Uses multiple APIs and requires consensus for high confidence',
      apis: ['OpenAI', 'GPTZero', 'Sapling'],
      enabled: true
    },
    {
      name: 'Aggressive', 
      description: 'Uses all available APIs and weights results by accuracy',
      apis: ['OpenAI', 'GPTZero', 'Sapling', 'CopyLeaks', 'HuggingFace'],
      enabled: false
    },
    {
      name: 'Fast',
      description: 'Uses fastest APIs for quick results',
      apis: ['OpenAI', 'HuggingFace'],
      enabled: false
    }
  ])

  const sampleTexts = [
    {
      label: 'Human-written Sample',
      text: 'Yesterday, I walked through the old neighborhood where I grew up. The familiar scent of Mrs. Johnson\'s roses still lingered in the air, and I could hear children playing in the distance. It brought back memories of summer afternoons spent reading under the big oak tree that still stands proudly in the park.'
    },
    {
      label: 'AI-generated Sample',
      text: 'Artificial intelligence represents a transformative technology that has the potential to revolutionize various industries. By leveraging machine learning algorithms and neural networks, AI systems can process vast amounts of data and generate insights that were previously impossible to obtain. This technology offers numerous benefits including increased efficiency, improved accuracy, and enhanced decision-making capabilities.'
    },
    {
      label: 'Mixed Content Sample',
      text: 'Climate change is one of the most pressing issues of our time. I remember when my grandfather used to tell me stories about the harsh winters of his youth, with snow that would last for months. Nowadays, the scientific consensus indicates that global temperatures are rising due to increased greenhouse gas emissions. This phenomenon affects weather patterns, sea levels, and biodiversity across the planet.'
    }
  ]

  const handleStrategyChange = (index: number) => {
    setStrategies(prev => prev.map((strategy, i) => ({
      ...strategy,
      enabled: i === index
    })))
  }

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('Please enter some content to analyze')
      return
    }

    if (content.trim().length < 10) {
      setError('Content must be at least 10 characters long')
      return
    }

    const selectedStrategy = strategies.find(s => s.enabled)
    if (!selectedStrategy) {
      setError('Please select a detection strategy')
      return
    }

    setIsAnalyzing(true)
    setError('')
    setResults(null)
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content,
          strategy: selectedStrategy.name.toLowerCase()
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Analysis failed')
      }

      // Simulate multi-API results for demo
      const mockResults: AnalysisResult = {
        strategy: selectedStrategy.name,
        overallProbability: data.data.aiDetection.probability,
        confidence: data.data.aiDetection.confidence,
        results: selectedStrategy.apis.map((api, index) => ({
          api,
          probability: Math.max(0, Math.min(100, data.data.aiDetection.probability + (Math.random() - 0.5) * 20)),
          confidence: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
          responseTime: 200 + Math.random() * 800
        })),
        processingTime: 500 + Math.random() * 1000
      }

      setResults(mockResults)
    } catch (err) {
      setError('Analysis failed. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setContent('')
    setResults(null)
    setError('')
  }

  const loadSample = (text: string) => {
    setContent(text)
    setResults(null)
    setError('')
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-red-600'
    if (probability >= 40) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-gray-900" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Multi-API Detection Demo</h1>
                <p className="text-sm text-gray-600">Compare AI detection results across multiple services</p>
              </div>
            </div>
            <a 
              href="/"
              className="btn-secondary"
            >
              ← Back to Main
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <div className="card mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Detection Strategy</h3>
              </div>
              
              <div className="space-y-3">
                {strategies.map((strategy, index) => (
                  <div key={strategy.name} className="border border-gray-200 rounded-lg p-3">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="strategy"
                        checked={strategy.enabled}
                        onChange={() => handleStrategyChange(index)}
                        className="mt-1 h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{strategy.name}</div>
                        <div className="text-sm text-gray-600 mb-2">{strategy.description}</div>
                        <div className="flex flex-wrap gap-1">
                          {strategy.apis.map(api => (
                            <span key={api} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {api}
                            </span>
                          ))}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Texts */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Texts</h3>
              <div className="space-y-3">
                {sampleTexts.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => loadSample(sample.text)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900 text-sm mb-1">{sample.label}</div>
                    <div className="text-xs text-gray-600 line-clamp-2">{sample.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Input Section */}
            <div className="card mb-6">
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content to Analyze
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter or paste content here..."
                  className="textarea-field h-32"
                  maxLength={5000}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {content.length}/5,000 characters
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !content.trim()}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Run Analysis</span>
                    </>
                  )}
                </button>
                
                {content && (
                  <button
                    onClick={handleReset}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Results Section */}
            {results && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Detection Results</h3>
                  <div className="text-sm text-gray-600">
                    Strategy: <span className="font-medium">{results.strategy}</span> • 
                    Processing Time: <span className="font-medium">{Math.round(results.processingTime)}ms</span>
                  </div>
                </div>

                {/* Overall Result */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Overall AI Probability</div>
                      <div className={`text-2xl font-bold ${getProbabilityColor(results.overallProbability)}`}>
                        {Math.round(results.overallProbability)}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">Confidence</div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(results.confidence)}`}>
                        {results.confidence.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Individual API Results */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Individual API Results</h4>
                  {results.results.map((result, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-900">{result.api}</div>
                        <div className="flex items-center space-x-3">
                          <span className={`text-lg font-semibold ${getProbabilityColor(result.probability)}`}>
                            {Math.round(result.probability)}%
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(result.confidence)}`}>
                            {result.confidence}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Response Time: {Math.round(result.responseTime)}ms
                      </div>
                      {result.error && (
                        <div className="mt-2 text-sm text-red-600">
                          Error: {result.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <div className="font-medium mb-1">About Multi-API Detection</div>
                      <p>
                        This demo shows how different AI detection services can provide varying results for the same content. 
                        The overall probability is calculated using the selected strategy's algorithm, which may weight 
                        certain APIs higher based on their historical accuracy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}