/**
 * Assessment Mapper
 * Converts between domain models and DTOs
 * Keeps domain layer independent from API layer
 */

import { Assessment } from '../../domain/models/Assessment';
import { GetAssessmentResponse, ListAssessmentsResponse } from '../dtos/AssessmentDTOs';

export class AssessmentMapper {
  /**
   * Map Assessment entity to GetAssessmentResponse DTO
   */
  static toGetResponse(assessment: Assessment): GetAssessmentResponse {
    return {
      companyInfo: {
        name: assessment.companyInfo.name,
        email: assessment.companyInfo.email,
        website: assessment.companyInfo.website,
        team: assessment.companyInfo.team,
        teamSize: assessment.teamMetrics.size.toString(),
        avgSalary: assessment.teamMetrics.avgSalary.toString(),
        trainingType: assessment.trainingType,
      },
      scores: { ...assessment.driverScores },
      answers: assessment.answers,
      readinessScore: assessment.results.readinessScore,
      dysfunctionCost: assessment.results.dysfunctionCost,
      detectedIndustry: assessment.industryDetection.industry,
      industryConfidence: assessment.industryDetection.confidence,
      priorityMatrixData: assessment.priorityMatrixData,
      roiData: assessment.roiData,
      createdAt: assessment.createdAt,
    };
  }

  /**
   * Map Assessment entities to ListAssessmentsResponse DTO
   */
  static toListResponse(
    assessments: Assessment[],
    total: number,
    limit: number,
    offset: number
  ): ListAssessmentsResponse {
    return {
      assessments: assessments.map(a => ({
        id: a.id.value,
        companyName: a.companyInfo.name,
        teamName: a.companyInfo.team,
        trainingType: a.trainingType,
        readinessScore: a.results.readinessScore,
        dysfunctionCost: a.results.dysfunctionCost,
        createdAt: a.createdAt,
      })),
      total,
      limit,
      offset,
    };
  }
}
