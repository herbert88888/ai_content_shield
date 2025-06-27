export interface AIDetectionResult {
  isAIGenerated: boolean
  probability: number // 0-100
  confidence: 'low' | 'medium' | 'high'
  highlightedPhrases: HighlightedPhrase[]
  reasoning: string
}

export interface HighlightedPhrase {
  text: string
  startIndex: number
  endIndex: number
  reason: string
}

export interface MultiAPIDetectionResult extends AIDetectionResult {
  apiResults: {
    zerogpt?: {
      isAIGenerated: boolean
      probability: number
      confidence: string
      error?: string
    }
    gptzero?: {
      isAIGenerated: boolean
      probability: number
      confidence: string
      error?: string
    }
    sapling?: {
      isAIGenerated: boolean
      probability: number
      confidence: string
      error?: string
    }
    huggingface?: {
      isAIGenerated: boolean
      probability: number
      confidence: string
      error?: string
    }
  }
  strategy: string
  consensusScore: number
  apiCount: number
}

export interface APIStatus {
  zerogpt: boolean
  gptzero: boolean
  sapling: boolean
  huggingface: boolean
  openai: boolean
}

export interface DetectionStrategy {
  name: string
  description: string
  availableAPIs: string[]
  isMultiAPI: boolean
}