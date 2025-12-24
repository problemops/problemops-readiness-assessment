import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { assessments, assessmentData, emailLogs } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { classifyIndustry } from "./industryClassifier";
import { 
  calculatePriorityMatrix, 
  normalizeDriverScores,
  isValidIndustry,
  getDefaultIndustry,
  type Industry 
} from "../client/src/lib/priorityMatrixCalculations";

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

export const assessmentRouter = router({
  /**
   * Create a new assessment
   * POST /api/trpc/assessment.create
   */
  create: publicProcedure
    .input(createAssessmentSchema)
    .mutation(async ({ input }) => {
      console.log('[Assessment] ========== CREATE MUTATION START ==========');
      console.log('[Assessment] Timestamp:', new Date().toISOString());
      
      try {
        const { companyInfo, scores, answers } = input;
        console.log('[Assessment] Company:', companyInfo.name);
        console.log('[Assessment] Scores:', JSON.stringify(scores));
        console.log('[Assessment] Answers count:', Object.keys(answers).length);
        
        // Calculate readiness score (weighted average)
        console.log('[Assessment] Calculating readiness score...');
        const DRIVER_WEIGHTS: Record<string, number> = {
          trust: 0.20,
          psych_safety: 0.18,
          tms: 0.15,
          comm_quality: 0.15,
          goal_clarity: 0.12,
          coordination: 0.10,
          team_cognition: 0.10,
        };
        
        const readinessScore = Object.entries(scores).reduce((sum, [driverId, score]) => {
          const weight = DRIVER_WEIGHTS[driverId] || 0;
          if (weight === 0) {
            console.warn(`[Assessment] Unknown driver ID: ${driverId}`);
          }
          return sum + (score / 7) * weight;
        }, 0);
        console.log('[Assessment] Readiness score:', readinessScore);
        
        // Calculate dysfunction cost
        const totalPayroll = companyInfo.teamSize * companyInfo.avgSalary;
        const dysfunctionCost = totalPayroll * (1 - readinessScore);
        console.log('[Assessment] Dysfunction cost:', dysfunctionCost);
        
        // Generate UUID for assessment
        const assessmentId = randomUUID();
        console.log('[Assessment] Generated ID:', assessmentId);
        
        // Classify industry from website (async, batch processing)
        console.log('[Assessment] Classifying industry from website...');
        let detectedIndustry: Industry = getDefaultIndustry();
        let industryConfidence = 0.5;
        
        if (companyInfo.website) {
          try {
            const classification = await classifyIndustry(companyInfo.website);
            detectedIndustry = classification.industry;
            industryConfidence = classification.confidence;
            console.log('[Assessment] Detected industry:', detectedIndustry, 'confidence:', industryConfidence);
          } catch (error) {
            console.warn('[Assessment] Industry classification failed, using default:', error);
          }
        } else {
          console.log('[Assessment] No website provided, using default industry');
        }
        
        // Calculate priority matrix
        console.log('[Assessment] Calculating priority matrix...');
        const normalizedScores = normalizeDriverScores(scores);
        const priorityMatrix = calculatePriorityMatrix(normalizedScores, detectedIndustry);
        console.log('[Assessment] Priority matrix calculated:', priorityMatrix.quadrantCounts);
        
        // Get database instance
        console.log('[Assessment] Getting database connection...');
        const db = await getDb();
        if (!db) {
          console.error('[Assessment] ERROR: Database not available!');
          throw new Error("Database not available");
        }
        console.log('[Assessment] Database connection obtained');
        
        // Insert into assessments table
        console.log('[Assessment] Inserting into assessments table...');
        const assessmentValues = {
          id: assessmentId,
          companyName: companyInfo.name,
          companyEmail: companyInfo.email || null,
          companyWebsite: companyInfo.website || null,
          teamName: companyInfo.team || null,
          teamSize: companyInfo.teamSize,
          avgSalary: companyInfo.avgSalary,
          trainingType: companyInfo.trainingType,
          readinessScore: readinessScore.toFixed(4),
          dysfunctionCost: dysfunctionCost.toFixed(2),
          detectedIndustry: detectedIndustry,
          industryConfidence: industryConfidence.toFixed(2),
        };
        console.log('[Assessment] Assessment values:', JSON.stringify(assessmentValues));
        
        await db.insert(assessments).values(assessmentValues);
        console.log('[Assessment] Successfully inserted into assessments table');
        
        // Insert into assessmentData table
        console.log('[Assessment] Inserting into assessmentData table...');
        const dataValues = {
          assessmentId,
          answers: JSON.stringify(answers),
          driverScores: JSON.stringify(scores),
          priorityAreas: null,
          roiData: null,
          priorityMatrixData: JSON.stringify(priorityMatrix),
        };
        
        await db.insert(assessmentData).values(dataValues);
        console.log('[Assessment] Successfully inserted into assessmentData table');
        
        // If email provided, queue email job
        if (companyInfo.email) {
          console.log('[Assessment] Queueing email for:', companyInfo.email);
          await db.insert(emailLogs).values({
            assessmentId,
            recipientEmail: companyInfo.email,
            emailType: "results_with_pdf",
            status: "pending",
          });
          console.log('[Assessment] Email queued successfully');
        }
        
        const response = {
          success: true,
          assessmentId,
          redirectUrl: `/results/${assessmentId}`,
        };
        console.log('[Assessment] Returning response:', JSON.stringify(response));
        console.log('[Assessment] ========== CREATE MUTATION END ==========');
        
        return response;
        
      } catch (error) {
        console.error('[Assessment] ========== ERROR ==========');
        console.error('[Assessment] Error type:', error instanceof Error ? error.constructor.name : typeof error);
        console.error('[Assessment] Error message:', error instanceof Error ? error.message : String(error));
        console.error('[Assessment] Error stack:', error instanceof Error ? error.stack : 'No stack');
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
      console.log('[Assessment] getById called with ID:', input.id);
      
      // Get database instance
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }
      
      // Fetch from both tables
      const [assessment] = await db
        .select()
        .from(assessments)
        .where(eq(assessments.id, input.id))
        .limit(1);
      
      if (!assessment) {
        console.error('[Assessment] Assessment not found:', input.id);
        throw new Error("Assessment not found");
      }
      
      const [data] = await db
        .select()
        .from(assessmentData)
        .where(eq(assessmentData.assessmentId, input.id))
        .limit(1);
      
      if (!data) {
        console.error('[Assessment] Assessment data not found:', input.id);
        throw new Error("Assessment data not found");
      }
      
      // Parse JSON fields
      const scores = JSON.parse(data.driverScores);
      const answers = JSON.parse(data.answers);
      const priorityMatrixData = data.priorityMatrixData ? JSON.parse(data.priorityMatrixData) : null;
      
      console.log('[Assessment] Successfully retrieved assessment:', input.id);
      
      return {
        companyInfo: {
          name: assessment.companyName,
          email: assessment.companyEmail || undefined,
          website: assessment.companyWebsite || undefined,
          team: assessment.teamName || undefined,
          teamSize: assessment.teamSize.toString(),
          avgSalary: assessment.avgSalary.toString(),
          trainingType: assessment.trainingType,
        },
        scores,
        answers,
        readinessScore: parseFloat(assessment.readinessScore),
        dysfunctionCost: parseFloat(assessment.dysfunctionCost),
        detectedIndustry: assessment.detectedIndustry || 'Professional Services',
        industryConfidence: assessment.industryConfidence ? parseFloat(assessment.industryConfidence) : 0.5,
        priorityMatrixData,
        createdAt: assessment.createdAt,
      };
    }),

  /**
   * List all assessments (for admin dashboard)
   * GET /api/trpc/assessment.list
   */
  list: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(async ({ input }) => {
      const { limit = 20, offset = 0 } = input || {};
      
      // Get database instance
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }
      
      const results = await db
        .select({
          id: assessments.id,
          companyName: assessments.companyName,
          teamName: assessments.teamName,
          trainingType: assessments.trainingType,
          readinessScore: assessments.readinessScore,
          dysfunctionCost: assessments.dysfunctionCost,
          createdAt: assessments.createdAt,
        })
        .from(assessments)
        .orderBy(desc(assessments.createdAt))
        .limit(limit)
        .offset(offset);
      
      return {
        assessments: results.map((a: any) => ({
          ...a,
          readinessScore: parseFloat(a.readinessScore),
          dysfunctionCost: parseFloat(a.dysfunctionCost),
        })),
        total: results.length,
      };
    }),
});
