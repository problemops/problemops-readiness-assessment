/**
 * Industry Classification Service
 * Uses LLM to analyze company websites and classify industries
 */

import { IIndustryClassificationService, IndustryClassificationResult } from '../../../domain/interfaces/IIndustryClassificationService';
import { LLMClient } from '../../../infrastructure/external/llm/LLMClient';

const VALID_INDUSTRIES = [
  'Software & Technology',
  'Healthcare & Medical',
  'Financial Services',
  'Government & Public Sector',
  'Hospitality & Service',
  'Manufacturing & Industrial',
  'Professional Services',
] as const;

const DEFAULT_RESULT: IndustryClassificationResult = {
  industry: 'Professional Services',
  confidence: 0.5,
  offerings: [],
  reasoning: 'Default classification - website could not be analyzed',
};

export class IndustryClassificationService implements IIndustryClassificationService {
  constructor(private readonly llmClient: LLMClient) {}

  /**
   * Fetch website content for analysis
   */
  private async fetchWebsiteContent(websiteUrl: string): Promise<string | null> {
    try {
      // Normalize URL
      let url = websiteUrl.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      // Fetch homepage with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ProblemOps/1.0; +https://problemops.com)',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.log(`[IndustryClassification] Website fetch failed: ${response.status}`);
        return null;
      }

      const html = await response.text();

      // Extract text content
      const textContent = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 8000);

      return textContent;
    } catch (error) {
      console.log(`[IndustryClassification] Failed to fetch website: ${error}`);
      return null;
    }
  }

  /**
   * Classify industry using LLM
   */
  async classifyIndustry(websiteUrl: string): Promise<IndustryClassificationResult> {
    // Validate input
    if (!websiteUrl || websiteUrl.trim() === '') {
      return DEFAULT_RESULT;
    }

    // Fetch website content
    const websiteContent = await this.fetchWebsiteContent(websiteUrl);

    if (!websiteContent || websiteContent.length < 100) {
      console.log('[IndustryClassification] Insufficient website content');
      return DEFAULT_RESULT;
    }

    try {
      // Call LLM for classification
      const response = await this.llmClient.invoke({
        messages: [
          {
            role: 'system',
            content: `You are an industry classification expert. Analyze company websites and classify them into exactly ONE of these industries:

1. Software & Technology - Companies that build software, apps, platforms, SaaS, cloud services, IT services
2. Healthcare & Medical - Hospitals, clinics, medical device companies, pharmaceutical, healthcare services
3. Financial Services - Banks, investment firms, insurance, fintech, accounting, financial advisory
4. Government & Public Sector - Government agencies, public services, municipalities, non-profits serving public
5. Hospitality & Service - Hotels, restaurants, tourism, entertainment, customer service businesses
6. Manufacturing & Industrial - Factories, production, supply chain, logistics, industrial equipment
7. Professional Services - Consulting, legal, marketing agencies, HR services, business services

Return your response as valid JSON with this exact structure:
{
  "industry": "One of the 7 industries listed above",
  "confidence": 0.0 to 1.0,
  "offerings": ["list", "of", "main", "products/services"],
  "reasoning": "One sentence explaining why this classification"
}

Be decisive. Choose the BEST fit even if the company spans multiple industries.`,
          },
          {
            role: 'user',
            content: `Classify this company based on their website content:\n\n${websiteContent}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      // Extract text content
      const content = this.llmClient.extractTextContent(response);

      if (!content) {
        console.log('[IndustryClassification] No content in LLM response');
        return DEFAULT_RESULT;
      }

      // Parse JSON response
      const parsed = JSON.parse(content);

      // Validate industry
      if (!VALID_INDUSTRIES.includes(parsed.industry)) {
        console.log(`[IndustryClassification] Invalid industry: ${parsed.industry}`);
        return DEFAULT_RESULT;
      }

      return {
        industry: parsed.industry,
        confidence: Math.min(1, Math.max(0, parsed.confidence || 0.7)),
        offerings: Array.isArray(parsed.offerings) ? parsed.offerings.slice(0, 5) : [],
        reasoning: parsed.reasoning || 'Classification based on website analysis',
      };
    } catch (error) {
      console.log(`[IndustryClassification] LLM classification failed: ${error}`);
      return DEFAULT_RESULT;
    }
  }

  /**
   * Classify industry with caching
   * TODO: Implement caching by domain
   */
  async classifyIndustryWithCache(
    websiteUrl: string,
    _assessmentId?: string
  ): Promise<IndustryClassificationResult> {
    return this.classifyIndustry(websiteUrl);
  }

  /**
   * Get default classification result
   */
  getDefaultResult(): IndustryClassificationResult {
    return { ...DEFAULT_RESULT };
  }
}
