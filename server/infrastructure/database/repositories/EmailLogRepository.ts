/**
 * Email Log Repository Implementation
 * Tracks email delivery status
 */

import { eq } from 'drizzle-orm';
import { getDb } from '../../../db';
import { emailLogs } from '../../../../drizzle/schema';
import { IEmailLogRepository } from '../../../domain/repositories/IAssessmentRepository';

export class EmailLogRepository implements IEmailLogRepository {
  /**
   * Create email log entry
   */
  async create(data: {
    assessmentId: string;
    recipientEmail: string;
    emailType: 'results_link' | 'results_with_pdf';
  }): Promise<void> {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    await db.insert(emailLogs).values({
      assessmentId: data.assessmentId,
      recipientEmail: data.recipientEmail,
      emailType: data.emailType,
      status: 'pending',
    });
  }

  /**
   * Update email status
   */
  async updateStatus(
    assessmentId: string,
    status: 'pending' | 'sent' | 'failed' | 'bounced',
    errorMessage?: string
  ): Promise<void> {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    await db
      .update(emailLogs)
      .set({
        status,
        errorMessage: errorMessage || null,
      })
      .where(eq(emailLogs.assessmentId, assessmentId));
  }

  /**
   * Find pending emails
   */
  async findPending(limit: number): Promise<Array<{
    id: number;
    assessmentId: string;
    recipientEmail: string;
    emailType: string;
  }>> {
    const db = await getDb();
    if (!db) return [];

    const results = await db
      .select({
        id: emailLogs.id,
        assessmentId: emailLogs.assessmentId,
        recipientEmail: emailLogs.recipientEmail,
        emailType: emailLogs.emailType,
      })
      .from(emailLogs)
      .where(eq(emailLogs.status, 'pending'))
      .limit(limit);

    return results;
  }
}
