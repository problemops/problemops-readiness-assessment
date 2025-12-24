/**
 * LLM Client Wrapper
 * Abstracts LLM API calls for testability and maintainability
 */

import { invokeLLM } from '../../../_core/llm';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];
  response_format?: { type: 'json_object' | 'text' };
  temperature?: number;
  max_tokens?: number;
}

export interface LLMResponse {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type: string; text?: string }>;
    };
  }>;
}

export class LLMClient {
  /**
   * Invoke LLM with messages
   */
  async invoke(request: LLMRequest): Promise<LLMResponse> {
    return invokeLLM(request);
  }

  /**
   * Extract text content from LLM response
   */
  extractTextContent(response: LLMResponse): string | null {
    const rawContent = response.choices?.[0]?.message?.content;

    if (!rawContent) {
      return null;
    }

    // Handle content as string
    if (typeof rawContent === 'string') {
      return rawContent;
    }

    // Handle content as array
    if (Array.isArray(rawContent)) {
      const textPart = rawContent.find(part => part.type === 'text');
      return textPart && 'text' in textPart ? textPart.text || null : null;
    }

    return null;
  }
}
