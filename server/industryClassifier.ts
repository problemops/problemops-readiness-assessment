/**
 * Industry Classifier
 * 
 * Uses LLM to analyze company websites and classify them into one of 7 industry categories.
 * Falls back to "Professional Services" if website is unreachable or classification fails.
 */

import { invokeLLM } from "./_core/llm";
import type { Industry } from "../client/src/lib/priorityMatrixCalculations";

// Industry classification result
export interface IndustryClassificationResult {
  industry: Industry;
  confidence: number;
  offerings: string[];
  reasoning: string;
}

// Default result when classification fails
const DEFAULT_RESULT: IndustryClassificationResult = {
  industry: 'Professional Services',
  confidence: 0.5,
  offerings: [],
  reasoning: 'Default classification - website could not be analyzed',
};

/**
 * Fetch website content for analysis
 * Returns the text content of the homepage and about page
 */
async function fetchWebsiteContent(websiteUrl: string): Promise<string | null> {
  try {
    // Normalize URL
    let url = websiteUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Fetch homepage
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ProblemOps/1.0; +https://problemops.com)',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.log(`Website fetch failed with status: ${response.status}`);
      return null;
    }

    const html = await response.text();

    // Extract text content (simple extraction - remove HTML tags)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')   // Remove styles
      .replace(/<[^>]+>/g, ' ')                          // Remove HTML tags
      .replace(/\s+/g, ' ')                              // Normalize whitespace
      .trim()
      .substring(0, 8000); // Limit to ~8000 chars for LLM context

    return textContent;
  } catch (error) {
    console.log(`Failed to fetch website: ${error}`);
    return null;
  }
}

/**
 * Classify industry using LLM
 */
export async function classifyIndustry(websiteUrl: string): Promise<IndustryClassificationResult> {
  // If no website provided, return default
  if (!websiteUrl || websiteUrl.trim() === '') {
    return DEFAULT_RESULT;
  }

  // Fetch website content
  const websiteContent = await fetchWebsiteContent(websiteUrl);

  if (!websiteContent || websiteContent.length < 100) {
    console.log('Insufficient website content for classification');
    return DEFAULT_RESULT;
  }

  try {
    // Call LLM for classification
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
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

Be decisive. Choose the BEST fit even if the company spans multiple industries.`
        },
        {
          role: "user",
          content: `Classify this company based on their website content:\n\n${websiteContent}`
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse LLM response
    const rawContent = response.choices?.[0]?.message?.content;
    if (!rawContent) {
      console.log('No content in LLM response');
      return DEFAULT_RESULT;
    }

    // Handle content as string or array
    let content: string;
    if (typeof rawContent === 'string') {
      content = rawContent;
    } else if (Array.isArray(rawContent)) {
      // Extract text from content array
      const textPart = rawContent.find(part => part.type === 'text');
      content = textPart && 'text' in textPart ? textPart.text : '';
    } else {
      console.log('Unexpected content format');
      return DEFAULT_RESULT;
    }

    const parsed = JSON.parse(content);

    // Validate industry is one of our supported types
    const validIndustries: Industry[] = [
      'Software & Technology',
      'Healthcare & Medical',
      'Financial Services',
      'Government & Public Sector',
      'Hospitality & Service',
      'Manufacturing & Industrial',
      'Professional Services',
    ];

    if (!validIndustries.includes(parsed.industry)) {
      console.log(`Invalid industry returned: ${parsed.industry}`);
      return DEFAULT_RESULT;
    }

    return {
      industry: parsed.industry as Industry,
      confidence: Math.min(1, Math.max(0, parsed.confidence || 0.7)),
      offerings: Array.isArray(parsed.offerings) ? parsed.offerings.slice(0, 5) : [],
      reasoning: parsed.reasoning || 'Classification based on website analysis',
    };

  } catch (error) {
    console.log(`LLM classification failed: ${error}`);
    return DEFAULT_RESULT;
  }
}

/**
 * Classify industry with caching (for future implementation)
 * Currently just calls classifyIndustry directly
 */
export async function classifyIndustryWithCache(
  websiteUrl: string,
  _assessmentId?: string
): Promise<IndustryClassificationResult> {
  // TODO: Implement caching by domain to avoid re-analyzing same company
  return classifyIndustry(websiteUrl);
}
