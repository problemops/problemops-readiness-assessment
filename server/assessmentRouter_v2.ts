/**
 * Assessment Router v2.0
 * Fully refactored to use microservices architecture
 * 
 * All business logic delegated to services:
 * - AssessmentService: CRUD operations
 * - CalculationService: TCD calculations
 * - IndustryClassificationService: Industry detection
 * - PriorityMatrixService: Priority matrix calculations
 * - TrainingRecommendationService: ROI and training recommendations
 * - EmailService: Email delivery
 */

import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import {
  getAssessmentService,
  getCalculationService,
  getIndustryClassificationService,
} from "./services/ServiceContainer";
import { PriorityMatrixService } from "./application/services/priorityMatrix/PriorityMatrixService";
import { TrainingRecommendationService } from "./application/services/training/TrainingRecommendationService";
import { EmailService } from "./application/services/email/EmailService";
import { EmailLogRepository } from "./infrastructure/database/repositories/EmailLogRepository";

// Input validation schemas
const createAssessmentSchema = z.object({
  companyInfo: z.object({
    name: z.string().min(1, "Company name is required"),
    email: z.string().email().optional().or(z.literal("")),
    website: z.string().url().optional().or(z.literal("")),
    team: z.string().optional(),
    teamSize: z.string().transform(Number),
    avgSalary: z.string().transform(Number),
    trainingType: z.enum(["half-day", "full-day", "month-long", "not-sure"]),
  }),
  scores: z.record(z.string(), z.number()),
  answers: z.record(z.string(), z.number()),
});

export const assessmentRouterV2 = router({
  /**
   * Create a new assessment
   * POST /api/trpc/assessment.create
   */
  create: publicProcedure
    .input(createAssessmentSchema)
    .mutation(async ({ input }) => {
      console.log('[AssessmentV2] Creating assessment for:', input.companyInfo.name);
      
      try {
        // Get services
        const assessmentService = getAssessmentService();
        const industryService = getIndustryClassificationService();
        const calculationService = getCalculationService();
        const priorityMatrixService = new PriorityMatrixService();
        const trainingService = new TrainingRecommendationService();
        const emailService = new EmailService(new EmailLogRepository());

        // 1. Detect industry from website
        console.log('[AssessmentV2] Detecting industry...');
        const industryResult = input.companyInfo.website
          ? await industryService.classifyIndustry(input.companyInfo.website)
          : industryService.getDefaultResult();
        
        console.log('[AssessmentV2] Industry:', industryResult.industry, 'confidence:', industryResult.confidence);

        // 2. Calculate readiness score
        console.log('[AssessmentV2] Calculating readiness score...');
        const readinessScore = calculationService.calculateReadinessScore(input.scores as any);
        console.log('[AssessmentV2] Readiness score:', readinessScore);

        // 3. Calculate Enhanced Dysfunction Cost v4.0
        console.log('[AssessmentV2] Calculating TCD v4.0...');
        const teamSize = parseInt(input.companyInfo.teamSize as any);
        const avgSalary = parseInt(input.companyInfo.avgSalary as any);
        const totalPayroll = teamSize * avgSalary;

        const tcdResult = await calculationService.calculate({
          payroll: totalPayroll,
          teamSize,
          driverScores: input.scores as any,
          industry: industryResult.industry,
          revenue: undefined,
        });

        const dysfunctionCost = tcdResult.tcd.toNumber();
        console.log('[AssessmentV2] TCD:', dysfunctionCost);

        // 4. Calculate priority matrix
        console.log('[AssessmentV2] Calculating priority matrix...');
        const priorityMatrix = priorityMatrixService.calculatePriorityMatrix(
          input.scores,
          industryResult.industry
        );
        console.log('[AssessmentV2] Priority matrix:', priorityMatrix.quadrantCounts);

        // 5. Generate training recommendations
        console.log('[AssessmentV2] Generating training recommendations...');
        const trainingRecommendation = trainingService.generateRecommendation(
          input.companyInfo.trainingType,
          dysfunctionCost,
          priorityMatrix
        );
        console.log('[AssessmentV2] Training ROI:', trainingRecommendation.roiPercentage);

        // 6. Create assessment entity and save
        console.log('[AssessmentV2] Saving assessment...');
        const createRequest = {
          ...input,
          companyInfo: {
            ...input.companyInfo,
            teamSize: teamSize.toString(),
            avgSalary: avgSalary.toString(),
          },
        };

        const response = await assessmentService.createAssessment(createRequest);
        console.log('[AssessmentV2] Assessment created:', response.assessmentId);

        // 7. Send email if provided
        if (input.companyInfo.email) {
          console.log('[AssessmentV2] Sending results email...');
          await emailService.sendResultsLink(
            input.companyInfo.name,
            input.companyInfo.email,
            response.assessmentId,
            process.env.BASE_URL || 'https://problemops.com'
          );
          console.log('[AssessmentV2] Email queued');
        }

        console.log('[AssessmentV2] Assessment creation complete');
        return response;

      } catch (error) {
        console.error('[AssessmentV2] Error:', error);
        throw error;
      }
    }),

  /**
   * Get assessment by ID
   * GET /api/trpc/assessment.getById
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      console.log('[AssessmentV2] Getting assessment:', input.id);
      
      const assessmentService = getAssessmentService();
      const result = await assessmentService.getAssessment(input.id);
      
      console.log('[AssessmentV2] Assessment retrieved');
      return result;
    }),

  /**
   * List all assessments
   * GET /api/trpc/assessment.list
   */
  list: publicProcedure
    .input(z.object({
      limit: z.number().optional(),
      offset: z.number().optional(),
    }))
    .query(async ({ input }) => {
      console.log('[AssessmentV2] Listing assessments');
      
      const assessmentService = getAssessmentService();
      const result = await assessmentService.listAssessments(input);
      
      console.log('[AssessmentV2] Found', result.total, 'assessments');
      return result;
    }),

  /**
   * Delete assessment
   * DELETE /api/trpc/assessment.delete
   */
  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      console.log('[AssessmentV2] Deleting assessment:', input.id);
      
      const assessmentService = getAssessmentService();
      await assessmentService.deleteAssessment(input.id);
      
      console.log('[AssessmentV2] Assessment deleted');
      return { success: true };
    }),
});
