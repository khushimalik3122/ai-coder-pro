import { RAGService } from './RAGService';
import { ContextManager } from './ContextManager';

export interface Agent {
  name: string;
  description: string;
  execute(query: string, context: string): Promise<string>;
}

export class AgenticWorkflow {
  private agents: Map<string, Agent> = new Map();
  private ragService: RAGService;
  private contextManager: ContextManager;

  constructor(ragService: RAGService, contextManager: ContextManager) {
    this.ragService = ragService;
    this.contextManager = contextManager;
    this.initializeAgents();
  }

  /**
   * Initialize specialized agents
   */
  private initializeAgents(): void {
    this.agents.set('codeReview', new CodeReviewAgent());
    this.agents.set('bugFinder', new BugFinderAgent());
    this.agents.set('testGen', new TestGenAgent());
    this.agents.set('refactor', new RefactorAgent());
    this.agents.set('documentation', new DocumentationAgent());
    this.agents.set('optimization', new OptimizationAgent());
  }

  /**
   * Analyze user intent and route to appropriate agent
   */
  async analyzeIntent(query: string): Promise<string> {
    const queryLower = query.toLowerCase();
    
    // Intent keywords mapping
    const intentKeywords = {
      'codeReview': ['review', 'check', 'audit', 'examine', 'inspect'],
      'bugFinder': ['bug', 'error', 'issue', 'problem', 'fix', 'debug'],
      'testGen': ['test', 'unit', 'spec', 'coverage', 'testing'],
      'refactor': ['refactor', 'improve', 'optimize', 'clean', 'restructure'],
      'documentation': ['document', 'comment', 'explain', 'describe', 'doc'],
      'optimization': ['optimize', 'performance', 'speed', 'efficient', 'fast']
    };

    for (const [intent, keywords] of Object.entries(intentKeywords)) {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        return intent;
      }
    }

    return 'general'; // Default to general agent
  }

  /**
   * Execute workflow with context-aware processing
   */
  async executeWorkflow(userQuery: string): Promise<string> {
    try {
      // 1. Analyze intent
      const intent = await this.analyzeIntent(userQuery);
      console.log(`🎯 Detected intent: ${intent}`);

      // 2. Get optimized context
      const context = await this.contextManager.getOptimizedContext(userQuery);
      
      // 3. Add user message to history
      this.contextManager.addMessage('user', userQuery);

      // 4. Execute with appropriate agent
      let result: string;
      if (intent === 'general') {
        result = await this.executeGeneralQuery(userQuery, context);
      } else {
        const agent = this.agents.get(intent);
        if (agent) {
          result = await agent.execute(userQuery, context);
        } else {
          result = await this.executeGeneralQuery(userQuery, context);
        }
      }

      // 5. Add assistant response to history
      this.contextManager.addMessage('assistant', result);

      // 6. Check if conversation needs summarization
      if (this.contextManager.shouldSummarize()) {
        await this.contextManager.summarizeConversation();
      }

      return result;
    } catch (error: any) {
      console.error('Workflow execution error:', error);
      return `Sorry, I encountered an error: ${error?.message || 'Unknown error'}`;
    }
  }

  /**
   * Execute general query (fallback)
   */
  private async executeGeneralQuery(query: string, context: string): Promise<string> {
    const enhancedPrompt = `
Context: ${context}

User Query: ${query}

Please provide a helpful response based on the context and query above.
`;
    return enhancedPrompt; // This will be processed by the AI model
  }

  /**
   * Get available agents
   */
  getAvailableAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agent by name
   */
  getAgent(name: string): Agent | undefined {
    return this.agents.get(name);
  }
}

// Specialized Agent Implementations

class CodeReviewAgent implements Agent {
  name = 'Code Review Agent';
  description = 'Analyzes code for best practices, potential issues, and improvements';

  async execute(query: string, context: string): Promise<string> {
    const reviewPrompt = `
You are a senior code reviewer. Analyze the following code and provide a comprehensive review:

${context}

Review Request: ${query}

Please provide:
1. Code quality assessment
2. Potential issues or bugs
3. Best practices recommendations
4. Security considerations
5. Performance improvements
6. Specific suggestions for improvement

Format your response with clear sections and actionable recommendations.
`;
    return reviewPrompt;
  }
}

class BugFinderAgent implements Agent {
  name = 'Bug Finder Agent';
  description = 'Identifies potential bugs, errors, and issues in code';

  async execute(query: string, context: string): Promise<string> {
    const bugPrompt = `
You are a bug detection specialist. Analyze the following code for potential issues:

${context}

Bug Detection Request: ${query}

Please identify:
1. Syntax errors or typos
2. Logic errors and edge cases
3. Potential runtime errors
4. Memory leaks or performance issues
5. Security vulnerabilities
6. Race conditions or concurrency issues

For each issue found, provide:
- Issue description
- Severity level (Low/Medium/High/Critical)
- Suggested fix
- Code example if applicable
`;
    return bugPrompt;
  }
}

class TestGenAgent implements Agent {
  name = 'Test Generation Agent';
  description = 'Generates unit tests, integration tests, and test cases';

  async execute(query: string, context: string): Promise<string> {
    const testPrompt = `
You are a test generation specialist. Create comprehensive tests for the following code:

${context}

Test Generation Request: ${query}

Please generate:
1. Unit tests for individual functions/methods
2. Integration tests for component interactions
3. Edge case test scenarios
4. Mock data and fixtures
5. Test coverage recommendations
6. Testing best practices

Include:
- Test framework examples (Jest, Mocha, etc.)
- Assertion examples
- Setup and teardown code
- Test naming conventions
`;
    return testPrompt;
  }
}

class RefactorAgent implements Agent {
  name = 'Refactor Agent';
  description = 'Suggests code refactoring and improvements';

  async execute(query: string, context: string): Promise<string> {
    const refactorPrompt = `
You are a code refactoring specialist. Analyze and suggest improvements for:

${context}

Refactoring Request: ${query}

Please provide:
1. Code structure improvements
2. Function/method extraction opportunities
3. Variable naming improvements
4. Code duplication elimination
5. Design pattern applications
6. Performance optimizations
7. Readability enhancements

For each suggestion:
- Explain the benefit
- Provide before/after code examples
- Consider maintainability and readability
`;
    return refactorPrompt;
  }
}

class DocumentationAgent implements Agent {
  name = 'Documentation Agent';
  description = 'Generates documentation, comments, and explanations';

  async execute(query: string, context: string): Promise<string> {
    const docPrompt = `
You are a documentation specialist. Create comprehensive documentation for:

${context}

Documentation Request: ${query}

Please provide:
1. Function/method documentation
2. Code comments and explanations
3. API documentation
4. README sections
5. Usage examples
6. Architecture explanations
7. Setup and installation guides

Format with:
- Clear headings and structure
- Code examples
- Step-by-step instructions
- Best practices notes
`;
    return docPrompt;
  }
}

class OptimizationAgent implements Agent {
  name = 'Optimization Agent';
  description = 'Suggests performance optimizations and improvements';

  async execute(query: string, context: string): Promise<string> {
    const optimizePrompt = `
You are a performance optimization specialist. Analyze and optimize:

${context}

Optimization Request: ${query}

Please provide:
1. Performance bottlenecks identification
2. Algorithm improvements
3. Memory usage optimizations
4. Time complexity analysis
5. Space complexity improvements
6. Caching strategies
7. Database query optimizations
8. Network request optimizations

For each optimization:
- Explain the current performance issue
- Provide optimized solution
- Include performance metrics if possible
- Consider trade-offs and side effects
`;
    return optimizePrompt;
  }
} 