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
   * Send a single message to VAPI assistant and get response
   * Uses VAPI's /chat endpoint to have a conversation with the assistant
   */
  async sendMessage(assistantId: string, message: string, previousChatId?: string): Promise<{
    response: string
    chatId: string
    messages: Array<{ role: string; content: string }>
  }> {
    if (!this.apiKey) {
      throw new Error('VAPI_API_KEY is not set in environment variables')
    }

    try {
      const payload: any = {
        assistantId: assistantId,
        input: message
      }

      // For subsequent messages, also include previousChatId to chain conversations
      if (previousChatId) {
        payload.previousChatId = previousChatId
      }

      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`VAPI API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()

      // Extract the assistant's response from the chat response
      // VAPI returns output as an array of messages
      const assistantMessage = data.output?.find((m: any) => m.role === 'assistant')?.content

      return {
        response: assistantMessage || 'No response from assistant',
        chatId: data.id || 'unknown',
        messages: data.messages || []
      }
    } catch (error) {
      console.error('VAPI send message error:', error)
      throw error
    }
  }

  /**
   * Run a text-based evaluation of a voice agent
   * This simulates a conversation without making actual voice calls
   */
  async runTextEvaluation(request: VapiTextEvalRequest): Promise<VapiTextEvalResponse> {
    if (!this.apiKey) {
      throw new Error('VAPI_API_KEY is not set in environment variables')
    }

    // Build a conversation by chaining messages using previousChatId
    try {
      let currentChatId: string | undefined = undefined
      let conversationMessages: Array<{ role: string; content: string }> = []

      for (const callerMessage of request.callerMessages) {
        // Send to VAPI and get assistant response
        // Use the most recent chat ID to chain the conversation
        const result = await this.sendMessage(
          request.assistantId || '',
          callerMessage,
          currentChatId
        )

        // Update the chat ID to the most recent one (for chaining)
        currentChatId = result.chatId

        // VAPI returns the full conversation history in messages
        conversationMessages = result.messages
      }

      return {
        conversationId: currentChatId || `chat-${Date.now()}`,
        turns: conversationMessages.map(msg => ({
          role: msg.role as 'assistant' | 'user',
          message: msg.content
        }))
      }
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
