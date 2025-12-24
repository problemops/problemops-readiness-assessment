/**
 * Assessment Repository Interface
 * Defines contract for assessment data access
 * Follows Repository pattern for data persistence abstraction
 */

import { Assessment } from '../models/Assessment';

export interface IAssessmentRepository {
  /**
   * Save a new assessment
   */
  save(assessment: Assessment): Promise<void>;

  /**
   * Find assessment by ID
   */
  findById(id: string): Promise<Assessment | null>;

  /**
   * Find all assessments with pagination
   */
  findAll(limit: number, offset: number): Promise<Assessment[]>;

  /**
   * Count total assessments
   */
  count(): Promise<number>;

  /**
   * Update assessment with additional data
   */
  update(id: string, data: Partial<{
    priorityMatrixData: any;
    roiData: any;
  }>): Promise<void>;

  /**
   * Delete assessment
   */
  delete(id: string): Promise<void>;
}

/**
 * Email Log Repository Interface
 */
export interface IEmailLogRepository {
  /**
   * Create email log entry
   */
  create(data: {
    assessmentId: string;
    recipientEmail: string;
    emailType: 'results_link' | 'results_with_pdf';
  }): Promise<void>;

  /**
   * Update email status
   */
  updateStatus(
    assessmentId: string,
    status: 'pending' | 'sent' | 'failed' | 'bounced',
    errorMessage?: string
  ): Promise<void>;

  /**
   * Find pending emails
   */
  findPending(limit: number): Promise<Array<{
    id: number;
    assessmentId: string;
    recipientEmail: string;
    emailType: string;
  }>>;
}
