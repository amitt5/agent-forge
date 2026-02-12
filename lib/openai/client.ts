import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Helper for structured output with retries
export async function generateWithStructure<T>(
  systemPrompt: string,
  userPrompt: string,
  schema: any,
  options?: {
    model?: string
    temperature?: number
    maxRetries?: number
  }
): Promise<T> {
  const {
    model = 'gpt-4o',
    temperature = 0.7,
    maxRetries = 3
  } = options || {}

  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model,
        temperature,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'response',
            strict: true,
            schema: schema
          }
        }
      })

      const content = completion.choices[0].message.content
      if (!content) {
        throw new Error('Failed to get OpenAI response')
      }

      const parsed = JSON.parse(content)
      return parsed as T
    } catch (error) {
      lastError = error as Error
      console.error(`OpenAI attempt ${attempt + 1} failed:`, error)

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }

  throw lastError || new Error('OpenAI generation failed after all retries')
}
