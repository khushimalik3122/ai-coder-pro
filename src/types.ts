// Model types
export type SupportedModel = 'together' | 'grok' | 'claude' | 'openai';

export interface ModelConfig {
  name: SupportedModel;
  apiKey: string;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: SupportedModel;
  timestamp?: number;
}

export interface APIResponse {
  content: string;
  model: SupportedModel;
  raw?: any;
}

export type WorkflowStep = {
  name: string;
  model: SupportedModel;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  result?: string;
  error?: string;
};

export interface AgenticWorkflow {
  id: string;
  steps: WorkflowStep[];
  currentStep: number;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  context?: any;
} 