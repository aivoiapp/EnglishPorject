/**
 * Tipos para la API de DeepSeek
 */

export interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface DeepSeekRequestBody {
  model: string;
  messages: DeepSeekMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface DeepSeekChoice {
  index: number;
  message: DeepSeekMessage;
  finish_reason: string;
}

export interface DeepSeekUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: DeepSeekChoice[];
  usage: DeepSeekUsage;
}