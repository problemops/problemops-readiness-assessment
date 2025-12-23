import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { assessments, assessmentData, emailLogs } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

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
      const { companyInfo, scores, answers } = input;
      
      // Calculate readiness score (weighted average)
      const DRIVER_WEIGHTS: Record<string, number> = {
        trust: 0.20,
        psychSafety: 0.18,
        tms: 0.15,
        commQuality: 0.15,
        goalClarity: 0.12,
        coordination: 0.10,
        teamCognition: 0.10,
      };
      
      const readinessScore = Object.entries(scores).reduce((sum, [driverId, score]) => {
        const weight = DRIVER_WEIGHTS[driverId] || 0;
        return sum + (score / 7) * weight;
      }, 0);
      
      // Calculate dysfunction cost
      const totalPayroll = companyInfo.teamSize * companyInfo.avgSalary;
      const dysfunctionCost = totalPayroll * (1 - readinessScore);
      
      // Generate UUID for assessment
      const assessmentId = randomUUID();
      
      // Get database instance
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }
      
      // Insert into assessments table
      await db.insert(assessments).values({
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
      });
      
      // Insert into assessmentData table
      await db.insert(assessmentData).values({
        assessmentId,
        answers: JSON.stringify(answers),
        driverScores: JSON.stringify(scores),
        priorityAreas: null, // Will be calculated on demand
        roiData: null, // Will be calculated on demand
      });
      
      // If email provided, queue email job
      if (companyInfo.email) {
        await db.insert(emailLogs).values({
          assessmentId,
          recipientEmail: companyInfo.email,
          emailType: "results_with_pdf",
          status: "pending",
        });
      }
      
      return {
        success: true,
        assessmentId,
        redirectUrl: `/results/${assessmentId}`,
      };
    }),

  /**
   * Get assessment by ID
   * GET /api/trpc/assessment.getById
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
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
        throw new Error("Assessment not found");
      }
      
      const [data] = await db
        .select()
        .from(assessmentData)
        .where(eq(assessmentData.assessmentId, input.id))
        .limit(1);
      
      if (!data) {
        throw new Error("Assessment data not found");
      }
      
      // Parse JSON fields
      const scores = JSON.parse(data.driverScores);
      const answers = JSON.parse(data.answers);
      
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
        .orderBy(assessments.createdAt)
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
