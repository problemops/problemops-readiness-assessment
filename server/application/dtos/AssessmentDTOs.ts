/**
 * Data Transfer Objects for Assessment API
 * Separates API layer from domain layer
 */

/**
 * Request DTO for creating assessment
 */
export interface CreateAssessmentRequest {
  companyInfo: {
    name: string;
    email?: string;
    website?: string;
    team?: string;
    teamSize: string; // Will be parsed to number
    avgSalary: string; // Will be parsed to number
    trainingType: 'half-day' | 'full-day' | 'month-long' | 'not-sure';
  };
  scores: Record<string, number>;
  answers: Record<string, number>;
}

/**
 * Response DTO for assessment creation
 */
export interface CreateAssessmentResponse {
  success: boolean;
  assessmentId: string;
  redirectUrl: string;
}

/**
 * Response DTO for assessment retrieval
 */
export interface GetAssessmentResponse {
  companyInfo: {
    name: string;
    email?: string;
    website?: string;
    team?: string;
    teamSize: string;
    avgSalary: string;
    trainingType: string;
  };
  scores: Record<string, number>;
  answers: Record<string, number>;
  readinessScore: number;
  dysfunctionCost: number;
  detectedIndustry: string;
  industryConfidence: number;
  priorityMatrixData?: any;
  roiData?: any;
  createdAt: Date;
}

/**
 * Response DTO for assessment list
 */
export interface ListAssessmentsResponse {
  assessments: Array<{
    id: string;
    companyName: string;
    teamName?: string;
    trainingType: string;
    readinessScore: number;
    dysfunctionCost: number;
    createdAt: Date;
  }>;
  total: number;
  limit: number;
  offset: number;
}

/**
 * Request DTO for listing assessments
 */
export interface ListAssessmentsRequest {
  limit?: number;
  offset?: number;
}
