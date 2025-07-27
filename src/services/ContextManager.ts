import { RAGService } from './RAGService';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export class ContextManager {
  private messages: Message[] = [];
  private maxTokens = 4000; // Free tier limit
  private ragService: RAGService;
  private conversationSummary: string = '';

  constructor(ragService: RAGService) {
    this.ragService = ragService;
  }

  /**
   * Add a message to conversation history
   */
  addMessage(role: 'user' | 'assistant' | 'system', content: string): void {
    this.messages.push({
      role,
      content,
      timestamp: new Date()
    });
  }

  /**
   * Get optimized context for AI request
   */
  async getOptimizedContext(userQuery: string): Promise<string> {
    const contextParts: string[] = [];

    // 1. Get relevant documents from RAG
    const ragContext = await this.ragService.getContextForQuery(userQuery);
    if (ragContext) {
      contextParts.push(ragContext);
    }

    // 2. Get conversation summary if available
    if (this.conversationSummary) {
      contextParts.push(`Conversation Summary: ${this.conversationSummary}`);
    }

    // 3. Get recent conversation history (limited)
    const recentHistory = this.getRecentHistory(3);
    if (recentHistory.length > 0) {
      const historyText = recentHistory
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');
      contextParts.push(`Recent Conversation:\n${historyText}`);
    }

    return contextParts.join('\n\n');
  }

  /**
   * Summarize conversation when it gets too long
   */
  async summarizeConversation(): Promise<void> {
    if (this.messages.length > 10) {
      const userMessages = this.messages
        .filter(msg => msg.role === 'user')
        .slice(-5)
        .map(msg => msg.content);

      this.conversationSummary = this.createSimpleSummary(userMessages);
      
      // Keep only recent messages
      this.messages = this.messages.slice(-5);
      
      console.log('📝 Conversation summarized');
    }
  }

  /**
   * Get recent conversation history
   */
  private getRecentHistory(count: number): Message[] {
    return this.messages.slice(-count);
  }

  /**
   * Create simple summary of conversation
   */
  private createSimpleSummary(messages: string[]): string {
    const keyTopics = new Set<string>();
    
    for (const message of messages) {
      const words = message.toLowerCase().split(' ');
      for (const word of words) {
        if (word.length > 4 && !['this', 'that', 'with', 'from', 'have', 'will'].includes(word)) {
          keyTopics.add(word);
        }
      }
    }

    return `Key topics: ${Array.from(keyTopics).slice(0, 5).join(', ')}`;
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.messages = [];
    this.conversationSummary = '';
  }

  /**
   * Get conversation statistics
   */
  getStats(): { totalMessages: number; userMessages: number; assistantMessages: number } {
    const userMessages = this.messages.filter(msg => msg.role === 'user').length;
    const assistantMessages = this.messages.filter(msg => msg.role === 'assistant').length;

    return {
      totalMessages: this.messages.length,
      userMessages,
      assistantMessages
    };
  }

  /**
   * Check if context is getting too large
   */
  shouldSummarize(): boolean {
    const totalLength = this.messages.reduce((sum, msg) => sum + msg.content.length, 0);
    return totalLength > 2000 || this.messages.length > 15;
  }
} 