import fetch from 'node-fetch';

export class BasicAgent {
  private apiKey: string;
  private model: string = 'moonshotai/Kimi-K2-Instruct';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateCompletion(prompt: string, options?: { temperature?: number; maxTokens?: number }): Promise<string> {
    try {
      const body: any = {
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      };
      if (options?.temperature !== undefined) {
        body.temperature = options.temperature;
      }
      if (options?.maxTokens !== undefined) {
        body.max_tokens = options.maxTokens;
      }
      const response = await fetch(
        'https://api.together.xyz/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      );
      const data = await response.json();
      if (data && data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      }
      throw new Error('No completion generated');
    } catch (err: any) {
      if (err?.message?.includes('fetch failed')) {
        throw new Error('Network error: Unable to connect to Together AI API. Please check your internet connection.');
      }
      if (err?.response?.status === 401) {
        throw new Error('Invalid Together AI API key. Please check your credentials.');
      }
      if (err?.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please wait and try again later.');
      }
      throw new Error('Failed to generate code: ' + (err?.message || err));
    }
  }
}
