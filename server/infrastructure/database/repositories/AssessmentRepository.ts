/**
 * Assessment Repository Implementation
 * Concrete implementation using Drizzle ORM
 */

import { eq } from 'drizzle-orm';
import { getDb } from '../../../db';
import { assessments, assessmentData } from '../../../../drizzle/schema';
import { Assessment } from '../../../domain/models/Assessment';
import { IAssessmentRepository } from '../../../domain/repositories/IAssessmentRepository';

export class AssessmentRepository implements IAssessmentRepository {
  /**
   * Save a new assessment
   */
  async save(assessment: Assessment): Promise<void> {
    // Insert into assessments table
    const db = await getDb();
    if (!db) throw new Error('Database not available');
    
    await db.insert(assessments).values({
      id: assessment.id.value,
      companyName: assessment.companyInfo.name,
      companyEmail: assessment.companyInfo.email || null,
      companyWebsite: assessment.companyInfo.website || null,
      teamName: assessment.companyInfo.team || null,
      teamSize: assessment.teamMetrics.size,
      avgSalary: assessment.teamMetrics.avgSalary,
      trainingType: assessment.trainingType,
      readinessScore: assessment.results.readinessScore.toString(),
      dysfunctionCost: assessment.results.dysfunctionCost.toString(),
      detectedIndustry: assessment.industryDetection.industry,
      industryConfidence: assessment.industryDetection.confidence.toString(),
      createdAt: assessment.createdAt,
    });

    // Insert into assessmentData table
    await db.insert(assessmentData).values({
      assessmentId: assessment.id.value,
      answers: JSON.stringify(assessment.answers),
      driverScores: JSON.stringify(assessment.driverScores),
      priorityAreas: null,
      roiData: assessment.roiData ? JSON.stringify(assessment.roiData) : null,
      priorityMatrixData: assessment.priorityMatrixData ? JSON.stringify(assessment.priorityMatrixData) : null,
    });
  }

  /**
   * Find assessment by ID
   */
  async findById(id: string): Promise<Assessment | null> {
    const db = await getDb();
    if (!db) return null;
    
    const [assessment] = await db
      .select()
      .from(assessments)
      .where(eq(assessments.id, id))
      .limit(1);

    if (!assessment) {
      return null;
    }

    const [data] = await db
      .select()
      .from(assessmentData)
      .where(eq(assessmentData.assessmentId, id))
      .limit(1);

    if (!data) {
      return null;
    }

    return Assessment.fromPersistence({
      id: assessment.id,
      companyInfo: {
        name: assessment.companyName,
        email: assessment.companyEmail || undefined,
        website: assessment.companyWebsite || undefined,
        team: assessment.teamName || undefined,
      },
      teamMetrics: {
        size: assessment.teamSize,
        avgSalary: assessment.avgSalary,
      },
      trainingType: assessment.trainingType as any,
      driverScores: JSON.parse(data.driverScores),
      answers: JSON.parse(data.answers),
      results: {
        readinessScore: parseFloat(assessment.readinessScore),
        dysfunctionCost: parseFloat(assessment.dysfunctionCost),
      },
      industryDetection: {
        industry: assessment.detectedIndustry || 'Professional Services',
        confidence: assessment.industryConfidence ? parseFloat(assessment.industryConfidence) : 0.5,
      },
      createdAt: assessment.createdAt,
      priorityMatrixData: data.priorityMatrixData ? JSON.parse(data.priorityMatrixData) : undefined,
      roiData: data.roiData ? JSON.parse(data.roiData) : undefined,
    });
  }

  /**
   * Find all assessments with pagination
   */
  async findAll(limit: number, offset: number): Promise<Assessment[]> {
    const db = await getDb();
    if (!db) return [];
    
    const results = await db
      .select()
      .from(assessments)
      .limit(limit)
      .offset(offset)
      .orderBy(assessments.createdAt);

    const assessmentList: Assessment[] = [];

    for (const assessment of results) {
      const [data] = await db
        .select()
        .from(assessmentData)
        .where(eq(assessmentData.assessmentId, assessment.id))
        .limit(1);

      if (data) {
        assessmentList.push(
          Assessment.fromPersistence({
            id: assessment.id,
            companyInfo: {
              name: assessment.companyName,
              email: assessment.companyEmail || undefined,
              website: assessment.companyWebsite || undefined,
              team: assessment.teamName || undefined,
            },
            teamMetrics: {
              size: assessment.teamSize,
              avgSalary: assessment.avgSalary,
            },
            trainingType: assessment.trainingType as any,
            driverScores: JSON.parse(data.driverScores),
            answers: JSON.parse(data.answers),
            results: {
              readinessScore: parseFloat(assessment.readinessScore),
              dysfunctionCost: parseFloat(assessment.dysfunctionCost),
            },
            industryDetection: {
              industry: assessment.detectedIndustry || 'Professional Services',
              confidence: assessment.industryConfidence ? parseFloat(assessment.industryConfidence) : 0.5,
            },
            createdAt: assessment.createdAt,
            priorityMatrixData: data.priorityMatrixData ? JSON.parse(data.priorityMatrixData) : undefined,
            roiData: data.roiData ? JSON.parse(data.roiData) : undefined,
          })
        );
      }
    }

    return assessmentList;
  }

  /**
   * Count total assessments
   */
  async count(): Promise<number> {
    const db = await getDb();
    if (!db) return 0;
    
    const result = await db.select().from(assessments);
    return result.length;
  }

  /**
   * Update assessment with additional data
   */
  async update(
    id: string,
    data: Partial<{
      priorityMatrixData: any;
      roiData: any;
    }>
  ): Promise<void> {
    const updates: any = {};

    if (data.priorityMatrixData !== undefined) {
      updates.priorityMatrixData = JSON.stringify(data.priorityMatrixData);
    }

    if (data.roiData !== undefined) {
      updates.roiData = JSON.stringify(data.roiData);
    }

    if (Object.keys(updates).length > 0) {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      await db
        .update(assessmentData)
        .set(updates)
        .where(eq(assessmentData.assessmentId, id));
    }
  }

  /**
   * Delete assessment
   */
  async delete(id: string): Promise<void> {
    const db = await getDb();
    if (!db) throw new Error('Database not available');
    
    await db.delete(assessmentData).where(eq(assessmentData.assessmentId, id));
    await db.delete(assessments).where(eq(assessments.id, id));
  }
}
