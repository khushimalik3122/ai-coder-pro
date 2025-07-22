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
        ],
        max_tokens: options?.maxTokens || 8192, // Increased default
        temperature: options?.temperature || 0.7
      };
      
      console.log('Debug: Making request to Together AI API');
      const response = await fetch(
        'https://api.together.xyz/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'AI-Coder-Pro/1.0'
          },
          body: JSON.stringify(body)
        }
      );
      
      console.log('Debug: Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Debug: API Error:', errorText);
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Debug: API Response received');
      
      if (data && data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      }
      throw new Error('No completion generated');
    } catch (err: any) {
      console.error('Debug: Fetch error:', err);
      if (err?.message?.includes('fetch failed') || err?.message?.includes('ENOTFOUND')) {
        throw new Error('Network error: Unable to connect to Together AI API. Please check your internet connection and try again.');
      }
      if (err?.message?.includes('401')) {
        throw new Error('Invalid Together AI API key. Please check your credentials.');
      }
      if (err?.message?.includes('429')) {
        throw new Error('Rate limit exceeded. Please wait and try again later.');
      }
      throw new Error('Failed to generate code: ' + (err?.message || err));
    }
  }
}
