/**
 * Assessment Service
 * Orchestrates assessment creation, retrieval, and management
 * Coordinates between calculation, industry, priority matrix, and email services
 */

import { randomUUID } from 'crypto';
import { IAssessmentService } from '../../../domain/interfaces/IAssessmentService';
import { IAssessmentRepository, IEmailLogRepository } from '../../../domain/repositories/IAssessmentRepository';
import { ICalculationService } from '../../../domain/interfaces/ICalculationService';
import { IIndustryClassificationService } from '../../../domain/interfaces/IIndustryClassificationService';
import { PriorityMatrixService } from '../priorityMatrix/PriorityMatrixService';
import { TrainingRecommendationService } from '../training/TrainingRecommendationService';
import { Assessment } from '../../../domain/models/Assessment';
import { AssessmentMapper } from '../../mappers/AssessmentMapper';
import {
  CreateAssessmentRequest,
  CreateAssessmentResponse,
  GetAssessmentResponse,
  ListAssessmentsRequest,
  ListAssessmentsResponse,
} from '../../dtos/AssessmentDTOs';

export class AssessmentService implements IAssessmentService {
  constructor(
    private readonly assessmentRepository: IAssessmentRepository,
    private readonly emailLogRepository: IEmailLogRepository,
    private readonly calculationService: ICalculationService,
    private readonly industryService: IIndustryClassificationService,
    private readonly priorityMatrixService: PriorityMatrixService,
    private readonly trainingService: TrainingRecommendationService
  ) {}

  /**
   * Create a new assessment
   */
  async createAssessment(request: CreateAssessmentRequest): Promise<CreateAssessmentResponse> {
    // Parse and validate input
    const teamSize = parseInt(request.companyInfo.teamSize);
    const avgSalary = parseInt(request.companyInfo.avgSalary);

    if (isNaN(teamSize) || teamSize < 1) {
      throw new Error('Invalid team size');
    }

    if (isNaN(avgSalary) || avgSalary <= 0) {
      throw new Error('Invalid average salary');
    }

    // Calculate readiness score (backward compatible)
    const readinessScore = this.calculationService.calculateReadinessScore(request.scores as any);

    // Calculate total payroll
    const totalPayroll = teamSize * avgSalary;

    // Detect industry from website
    const industryResult = request.companyInfo.website
      ? await this.industryService.classifyIndustry(request.companyInfo.website)
      : this.industryService.getDefaultResult();
    
    const detectedIndustry = industryResult.industry;
    const industryConfidence = industryResult.confidence;

    // Calculate Enhanced Dysfunction Cost v4.0
    const tcdResult = await this.calculationService.calculate({
      payroll: totalPayroll,
      teamSize,
      driverScores: request.scores as any,
      industry: detectedIndustry,
      revenue: undefined, // TODO: Add revenue field to form
    });

    const dysfunctionCost = tcdResult.tcd.toNumber();

    // Generate assessment ID
    const assessmentId = randomUUID();

    // Calculate priority matrix
    const priorityMatrix = this.priorityMatrixService.calculatePriorityMatrix(
      request.scores,
      detectedIndustry
    );

    // Generate training recommendation
    const trainingRecommendation = this.trainingService.generateRecommendation(
      request.companyInfo.trainingType,
      dysfunctionCost,
      priorityMatrix
    );

    // Create assessment entity with all data
    const assessment = Assessment.create(
      assessmentId,
      {
        name: request.companyInfo.name,
        email: request.companyInfo.email,
        website: request.companyInfo.website,
        team: request.companyInfo.team,
      },
      {
        size: teamSize,
        avgSalary,
      },
      request.companyInfo.trainingType,
      request.scores as any,
      request.answers,
      {
        readinessScore,
        dysfunctionCost,
      },
      {
        industry: detectedIndustry,
        confidence: industryConfidence,
      },
      priorityMatrix,
      {
        tcd: tcdResult,
        training: trainingRecommendation,
      }
    );

    // Save to database
    await this.assessmentRepository.save(assessment);

    // Queue email if provided
    if (request.companyInfo.email) {
      await this.emailLogRepository.create({
        assessmentId,
        recipientEmail: request.companyInfo.email,
        emailType: 'results_link',
      });
    }

    // Return response
    return {
      success: true,
      assessmentId,
      redirectUrl: `/results/${assessmentId}`,
    };
  }

  /**
   * Get assessment by ID
   */
  async getAssessment(id: string): Promise<GetAssessmentResponse> {
    const assessment = await this.assessmentRepository.findById(id);

    if (!assessment) {
      throw new Error('Assessment not found');
    }

    return AssessmentMapper.toGetResponse(assessment);
  }

  /**
   * List all assessments with pagination
   */
  async listAssessments(request: ListAssessmentsRequest): Promise<ListAssessmentsResponse> {
    const limit = request.limit || 10;
    const offset = request.offset || 0;

    const assessments = await this.assessmentRepository.findAll(limit, offset);
    const total = await this.assessmentRepository.count();

    return AssessmentMapper.toListResponse(assessments, total, limit, offset);
  }

  /**
   * Delete assessment
   */
  async deleteAssessment(id: string): Promise<void> {
    await this.assessmentRepository.delete(id);
  }
}
