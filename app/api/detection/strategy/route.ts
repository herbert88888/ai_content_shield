import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const strategies = [
    {
      name: 'conservative',
      description: 'Uses multiple APIs and requires consensus for high confidence',
      apis: ['openai', 'gptzero', 'sapling'],
      weights: { openai: 0.4, gptzero: 0.35, sapling: 0.25 },
      threshold: 0.7
    },
    {
      name: 'aggressive',
      description: 'Uses all available APIs and weights results by accuracy',
      apis: ['openai', 'gptzero', 'sapling', 'copyleaks', 'huggingface'],
      weights: { openai: 0.3, gptzero: 0.25, sapling: 0.2, copyleaks: 0.15, huggingface: 0.1 },
      threshold: 0.5
    },
    {
      name: 'fast',
      description: 'Uses fastest APIs for quick results',
      apis: ['openai', 'huggingface'],
      weights: { openai: 0.7, huggingface: 0.3 },
      threshold: 0.6
    }
  ]

  return NextResponse.json({
    success: true,
    data: strategies,
    message: 'Detection strategies retrieved successfully'
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { strategy, content } = body

    if (!strategy || !content) {
      return NextResponse.json({
        success: false,
        error: 'Strategy and content are required'
      }, { status: 400 })
    }

    // This would implement the actual multi-API detection logic
    // For now, return a mock response
    const mockResult = {
      strategy,
      overallProbability: Math.random() * 100,
      confidence: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      results: [
        {
          api: 'OpenAI',
          probability: Math.random() * 100,
          confidence: 'high',
          responseTime: 200 + Math.random() * 300
        },
        {
          api: 'GPTZero',
          probability: Math.random() * 100,
          confidence: 'medium',
          responseTime: 300 + Math.random() * 400
        }
      ],
      processingTime: 500 + Math.random() * 1000
    }

    return NextResponse.json({
      success: true,
      data: mockResult,
      message: 'Multi-API detection completed'
    })

  } catch (error) {
    console.error('Strategy API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}