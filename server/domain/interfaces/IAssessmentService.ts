/**
 * Assessment Service Interface
 * Defines contract for assessment business logic
 */

import {
  CreateAssessmentRequest,
  CreateAssessmentResponse,
  GetAssessmentResponse,
  ListAssessmentsRequest,
  ListAssessmentsResponse,
} from '../../application/dtos/AssessmentDTOs';

export interface IAssessmentService {
  /**
   * Create a new assessment
   */
  createAssessment(request: CreateAssessmentRequest): Promise<CreateAssessmentResponse>;

  /**
   * Get assessment by ID
   */
  getAssessment(id: string): Promise<GetAssessmentResponse>;

  /**
   * List all assessments with pagination
   */
  listAssessments(request: ListAssessmentsRequest): Promise<ListAssessmentsResponse>;

  /**
   * Delete assessment
   */
  deleteAssessment(id: string): Promise<void>;
}
