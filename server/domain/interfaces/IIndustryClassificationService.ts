/**
 * Industry Classification Service Interface
 * Defines contract for industry detection using LLM
 */

export interface IndustryClassificationResult {
  industry: string;
  confidence: number;
  offerings: string[];
  reasoning: string;
}

export interface IIndustryClassificationService {
  /**
   * Classify industry from website URL
   */
  classifyIndustry(websiteUrl: string): Promise<IndustryClassificationResult>;

  /**
   * Classify industry with caching
   */
  classifyIndustryWithCache(
    websiteUrl: string,
    assessmentId?: string
  ): Promise<IndustryClassificationResult>;

  /**
   * Get default classification result
   */
  getDefaultResult(): IndustryClassificationResult;
}
