import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { appRouter } from './routers';
import { getDb } from './db';
import { assessments, assessmentData } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Integration tests for Assessment API
 * Tests database persistence, ROI calculations, and data retrieval
 */

describe('Assessment API', () => {
  let testAssessmentId: string;
  
  const mockAssessmentInput = {
    companyInfo: {
      name: 'Test Company',
      email: 'test@example.com',
      website: 'https://test.com',
      team: 'Engineering',
      teamSize: '10',
      avgSalary: '100000',
      trainingType: 'half-day' as const,
    },
    scores: {
      trust: 3.5,
      psych_safety: 4.0,
      tms: 3.8,
      comm_quality: 4.2,
      goal_clarity: 3.6,
      coordination: 3.9,
      team_cognition: 4.1,
    },
    answers: {
      1: 4, 2: 3, 3: 4, 4: 3, 5: 4,
      6: 4, 7: 4, 8: 4, 9: 4, 10: 4,
      11: 4, 12: 4, 13: 4, 14: 3, 15: 4,
      16: 4, 17: 4, 18: 5, 19: 4, 20: 4,
      21: 4, 22: 3, 23: 4, 24: 4, 25: 3,
      26: 4, 27: 4, 28: 4, 29: 4, 30: 3,
      31: 4, 32: 4, 33: 4, 34: 5, 35: 4,
    },
  };

  const createCaller = () => {
    return appRouter.createCaller({
      req: {} as any,
      res: {} as any,
      user: null,
    });
  };

  describe('assessment.create', () => {
    it('should create assessment and return UUID', async () => {
      const caller = createCaller();
      const result = await caller.assessment.create(mockAssessmentInput);

      expect(result.success).toBe(true);
      expect(result.assessmentId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      expect(result.redirectUrl).toBe(`/results/${result.assessmentId}`);

      testAssessmentId = result.assessmentId;
    });

    it('should save assessment to database', async () => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [assessment] = await db
        .select()
        .from(assessments)
        .where(eq(assessments.id, testAssessmentId))
        .limit(1);

      expect(assessment).toBeDefined();
      expect(assessment.companyName).toBe('Test Company');
      expect(assessment.companyEmail).toBe('test@example.com');
      expect(assessment.teamSize).toBe(10);
      expect(assessment.avgSalary).toBe(100000);
      expect(assessment.trainingType).toBe('half-day');
    });

    it('should calculate readiness score correctly', async () => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [assessment] = await db
        .select()
        .from(assessments)
        .where(eq(assessments.id, testAssessmentId))
        .limit(1);

      const readinessScore = parseFloat(assessment.readinessScore);
      
      // Readiness score should be weighted average (0-1 range)
      expect(readinessScore).toBeGreaterThan(0);
      expect(readinessScore).toBeLessThan(1);
      
      // With scores 3.5-4.2 out of 7, actual calculation gives ~0.5503 (55%)
      expect(readinessScore).toBeGreaterThan(0.50);
      expect(readinessScore).toBeLessThan(0.60);
    });

    it('should calculate dysfunction cost correctly', async () => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [assessment] = await db
        .select()
        .from(assessments)
        .where(eq(assessments.id, testAssessmentId))
        .limit(1);

      const dysfunctionCost = parseFloat(assessment.dysfunctionCost);
      const totalPayroll = 10 * 100000; // 10 people * $100k
      
      // Dysfunction cost should be payroll * (1 - readiness)
      expect(dysfunctionCost).toBeGreaterThan(0);
      expect(dysfunctionCost).toBeLessThan(totalPayroll);
      
      // With ~55% readiness, dysfunction should be ~45% of payroll ($449,700)
      expect(dysfunctionCost).toBeGreaterThan(400000);
      expect(dysfunctionCost).toBeLessThan(500000);
    });

    it('should save assessment data to separate table', async () => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [data] = await db
        .select()
        .from(assessmentData)
        .where(eq(assessmentData.assessmentId, testAssessmentId))
        .limit(1);

      expect(data).toBeDefined();
      
      const answers = JSON.parse(data.answers);
      const scores = JSON.parse(data.driverScores);
      
      expect(Object.keys(answers).length).toBe(35);
      expect(Object.keys(scores).length).toBe(7);
      expect(scores.trust).toBe(3.5);
    });

    it('should handle missing optional fields', async () => {
      const caller = createCaller();
      const minimalInput = {
        companyInfo: {
          name: 'Minimal Company',
          email: '',
          website: '',
          team: '',
          teamSize: '5',
          avgSalary: '80000',
          trainingType: 'not-sure' as const,
        },
        scores: mockAssessmentInput.scores,
        answers: mockAssessmentInput.answers,
      };

      const result = await caller.assessment.create(minimalInput);
      expect(result.success).toBe(true);
      
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [assessment] = await db
        .select()
        .from(assessments)
        .where(eq(assessments.id, result.assessmentId))
        .limit(1);

      expect(assessment.companyEmail).toBeNull();
      expect(assessment.companyWebsite).toBeNull();
      expect(assessment.teamName).toBeNull();
    });
  });

  describe('assessment.getById', () => {
    it('should retrieve assessment by ID', async () => {
      const caller = createCaller();
      const result = await caller.assessment.getById({ id: testAssessmentId });

      expect(result.companyInfo.name).toBe('Test Company');
      expect(result.companyInfo.email).toBe('test@example.com');
      expect(result.companyInfo.teamSize).toBe('10');
      expect(result.companyInfo.avgSalary).toBe('100000');
    });

    it('should return parsed scores and answers', async () => {
      const caller = createCaller();
      const result = await caller.assessment.getById({ id: testAssessmentId });

      expect(result.scores.trust).toBe(3.5);
      expect(result.answers[1]).toBe(4);
      expect(Object.keys(result.answers).length).toBe(35);
    });

    it('should return calculated metrics', async () => {
      const caller = createCaller();
      const result = await caller.assessment.getById({ id: testAssessmentId });

      expect(result.readinessScore).toBeGreaterThan(0);
      expect(result.readinessScore).toBeLessThan(1);
      expect(result.dysfunctionCost).toBeGreaterThan(0);
    });

    it('should throw error for non-existent ID', async () => {
      const caller = createCaller();
      const fakeId = '00000000-0000-0000-0000-000000000000';

      await expect(
        caller.assessment.getById({ id: fakeId })
      ).rejects.toThrow('Assessment not found');
    });

    it('should throw error for invalid UUID format', async () => {
      const caller = createCaller();

      await expect(
        caller.assessment.getById({ id: 'invalid-uuid' })
      ).rejects.toThrow();
    });
  });

  describe('assessment.list', () => {
    it('should list all assessments', async () => {
      const caller = createCaller();
      const result = await caller.assessment.list();

      expect(result.assessments).toBeDefined();
      expect(Array.isArray(result.assessments)).toBe(true);
      expect(result.assessments.length).toBeGreaterThan(0);
    });

    it('should include key fields in list', async () => {
      const caller = createCaller();
      const result = await caller.assessment.list();

      const assessment = result.assessments.find(a => a.id === testAssessmentId);
      expect(assessment).toBeDefined();
      expect(assessment!.companyName).toBe('Test Company');
      expect(assessment!.trainingType).toBe('half-day');
      expect(assessment!.readinessScore).toBeGreaterThan(0);
    });

    it('should respect pagination limits', async () => {
      const caller = createCaller();
      const result = await caller.assessment.list({ limit: 1, offset: 0 });

      expect(result.assessments.length).toBeLessThanOrEqual(1);
    });
  });

  // Cleanup
  afterAll(async () => {
    // Clean up test data
    const db = await getDb();
    if (db && testAssessmentId) {
      await db.delete(assessments).where(eq(assessments.id, testAssessmentId));
    }
  });
});
