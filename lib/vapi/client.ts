// VAPI Client for text-based voice agent testing

export interface VapiTextEvalRequest {
  assistantId?: string
  systemPrompt?: string
  callerMessages: string[]
  model?: string
}

export interface VapiTextEvalResponse {
  conversationId: string
  turns: Array<{
    role: 'assistant' | 'user'
    message: string
  }>
  metadata?: any
}

class VapiClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.VAPI_API_KEY || ''
    this.baseUrl = 'https://api.vapi.ai'
  }

  /**
   * Run a text-based evaluation of a voice agent
   * This simulates a conversation without making actual voice calls
   */
  async runTextEvaluation(request: VapiTextEvalRequest): Promise<VapiTextEvalResponse> {
    if (!this.apiKey) {
      throw new Error('VAPI_API_KEY is not set in environment variables')
    }

    // Note: This is a placeholder for the actual VAPI API
    // The actual endpoint and request format should be updated based on VAPI's documentation
    try {
      const response = await fetch(`${this.baseUrl}/v1/test/text-eval`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistant_id: request.assistantId,
          system_prompt: request.systemPrompt,
          caller_messages: request.callerMessages,
          model: request.model || 'gpt-4o',
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`VAPI API error: ${response.status} - ${error}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('VAPI text evaluation error:', error)
      throw error
    }
  }

  /**
   * Sync assistant configuration from VAPI
   */
  async getAssistant(assistantId: string) {
    if (!this.apiKey) {
      throw new Error('VAPI_API_KEY is not set in environment variables')
    }

    const response = await fetch(`${this.baseUrl}/assistant/${assistantId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch assistant: ${response.status}`)
    }

    return response.json()
  }

  /**
   * Push assistant configuration to VAPI
   */
  async updateAssistant(assistantId: string, config: any) {
    if (!this.apiKey) {
      throw new Error('VAPI_API_KEY is not set in environment variables')
    }

    const response = await fetch(`${this.baseUrl}/assistant/${assistantId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    })

    if (!response.ok) {
      throw new Error(`Failed to update assistant: ${response.status}`)
    }

    return response.json()
  }
}

export const vapiClient = new VapiClient()

/**
 * Mock VAPI text evaluation for development/testing
 * This simulates VAPI's response when the API key is not available
 */
export async function mockVapiTextEval(
  systemPrompt: string,
  callerMessages: string[]
): Promise<VapiTextEvalResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Generate mock agent responses based on the system prompt
  const turns: Array<{ role: 'assistant' | 'user'; message: string }> = []

  for (let i = 0; i < callerMessages.length; i++) {
    // Add caller message
    turns.push({
      role: 'user',
      message: callerMessages[i]
    })

    // Generate simple mock agent response
    const agentResponse = `Thank you for that. I understand your question about ${callerMessages[i].slice(0, 30)}... Let me help you with that.`

    turns.push({
      role: 'assistant',
      message: agentResponse
    })
  }

  return {
    conversationId: `mock-${Date.now()}`,
    turns,
    metadata: {
      mock: true,
      note: 'This is a mock response. Set VAPI_API_KEY to use real VAPI integration.'
    }
  }
}
