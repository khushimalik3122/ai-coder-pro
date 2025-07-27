import * as vscode from 'vscode';

export interface Document {
  id: string;
  content: string;
  metadata: {
    path: string;
    type: string;
    lastModified: Date;
  };
}

export class RAGService {
  private documents: Map<string, Document> = new Map();
  private workspacePath: string;

  constructor(workspacePath: string) {
    this.workspacePath = workspacePath;
  }

  /**
   * Add a document to the RAG system
   */
  async addDocument(path: string, content: string): Promise<void> {
    const id = this.generateId(path);
    const document: Document = {
      id,
      content,
      metadata: {
        path,
        type: this.getFileType(path),
        lastModified: new Date()
      }
    };
    
    this.documents.set(id, document);
    console.log(`📄 Document indexed: ${path}`);
  }

  /**
   * Search for relevant documents based on query
   */
  async search(query: string, limit: number = 3): Promise<Document[]> {
    const results: Array<{ document: Document; score: number }> = [];

    for (const document of this.documents.values()) {
      const score = this.calculateRelevanceScore(query, document.content);
      if (score > 0.1) { // Minimum relevance threshold
        results.push({ document, score });
      }
    }

    // Sort by relevance and return top results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.document);
  }

  /**
   * Get context for a specific query
   */
  async getContextForQuery(query: string): Promise<string> {
    const relevantDocs = await this.search(query, 3);
    
    if (relevantDocs.length === 0) {
      return '';
    }

    const context = relevantDocs.map(doc => 
      `File: ${doc.metadata.path}\n${doc.content.substring(0, 500)}...`
    ).join('\n\n');

    return `Relevant Context:\n${context}`;
  }

  /**
   * Index all files in workspace
   */
  async indexWorkspace(): Promise<void> {
    try {
      const files = await vscode.workspace.findFiles(
        '**/*.{js,ts,py,java,cpp,c,cs,go,rb,php,rs,swift,kt,scala,sh,pl,lua,json,yaml,yml,md,txt}',
        '**/node_modules/**'
      );

      for (const file of files.slice(0, 50)) { // Limit to first 50 files
        try {
          const content = await vscode.workspace.fs.readFile(file);
          const text = Buffer.from(content).toString();
          
          if (text.length > 100) { // Only index files with substantial content
            await this.addDocument(file.fsPath, text);
          }
        } catch (error) {
          console.log(`Failed to index ${file.fsPath}: ${error}`);
        }
      }

      console.log(`✅ Workspace indexed: ${this.documents.size} documents`);
    } catch (error) {
      console.error('Failed to index workspace:', error);
    }
  }

  /**
   * Calculate relevance score using simple TF-IDF approach
   */
  private calculateRelevanceScore(query: string, content: string): number {
    const queryWords = this.tokenize(query.toLowerCase());
    const contentWords = this.tokenize(content.toLowerCase());
    
    let score = 0;
    let totalMatches = 0;

    for (const queryWord of queryWords) {
      const matches = contentWords.filter(word => word.includes(queryWord)).length;
      if (matches > 0) {
        score += matches;
        totalMatches++;
      }
    }

    // Normalize score
    return totalMatches > 0 ? score / (queryWords.length * contentWords.length) : 0;
  }

  /**
   * Simple tokenization
   */
  private tokenize(text: string): string[] {
    return text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .slice(0, 100); // Limit tokens for performance
  }

  /**
   * Generate unique ID for document
   */
  private generateId(path: string): string {
    return Buffer.from(path).toString('base64').substring(0, 16);
  }

  /**
   * Get file type from extension
   */
  private getFileType(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase() || 'unknown';
    return ext;
  }

  /**
   * Get document statistics
   */
  getStats(): { totalDocuments: number; indexedTypes: string[] } {
    const types = new Set<string>();
    for (const doc of this.documents.values()) {
      types.add(doc.metadata.type);
    }

    return {
      totalDocuments: this.documents.size,
      indexedTypes: Array.from(types)
    };
  }
} 