/**
 * Email Service
 * Handles email delivery for assessment results
 */

import { IEmailLogRepository } from '../../../domain/repositories/IAssessmentRepository';

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface SendEmailRequest {
  to: string;
  subject: string;
  body: string;
  assessmentId: string;
}

export class EmailService {
  constructor(private readonly emailLogRepository: IEmailLogRepository) {}

  /**
   * Generate email template for results link
   */
  generateResultsLinkEmail(
    companyName: string,
    assessmentId: string,
    resultsUrl: string
  ): EmailTemplate {
    return {
      subject: `${companyName} - Team Readiness Assessment Results`,
      body: `
Hello,

Thank you for completing the ProblemOps Team Readiness Assessment for ${companyName}.

Your results are ready! View your comprehensive report here:
${resultsUrl}

Your report includes:
• Overall team readiness score
• Cost of dysfunction analysis
• Priority matrix with actionable insights
• Customized training recommendations
• ROI projections for improvement programs

This link will remain active for 90 days.

Questions? Reply to this email or visit https://problemops.com/contact

Best regards,
The ProblemOps Team
      `.trim(),
    };
  }

  /**
   * Queue email for delivery
   */
  async queueEmail(request: SendEmailRequest): Promise<void> {
    // Log email to database
    await this.emailLogRepository.create({
      assessmentId: request.assessmentId,
      recipientEmail: request.to,
      emailType: 'results_link',
    });

    // TODO: Integrate with actual email provider (SendGrid, AWS SES, etc.)
    console.log(`[EmailService] Email queued for ${request.to}`);
    console.log(`[EmailService] Subject: ${request.subject}`);
  }

  /**
   * Send results link email
   */
  async sendResultsLink(
    companyName: string,
    recipientEmail: string,
    assessmentId: string,
    baseUrl: string
  ): Promise<void> {
    const resultsUrl = `${baseUrl}/results/${assessmentId}`;
    const template = this.generateResultsLinkEmail(companyName, assessmentId, resultsUrl);

    await this.queueEmail({
      to: recipientEmail,
      subject: template.subject,
      body: template.body,
      assessmentId,
    });
  }

  /**
   * Process pending emails (for background job)
   */
  async processPendingEmails(limit: number = 10): Promise<number> {
    const pendingEmails = await this.emailLogRepository.findPending(limit);

    let processedCount = 0;

    for (const email of pendingEmails) {
      try {
        // TODO: Send actual email via provider
        console.log(`[EmailService] Processing email ${email.id} to ${email.recipientEmail}`);

        // Update status to sent
        await this.emailLogRepository.updateStatus(email.assessmentId, 'sent');
        processedCount++;
      } catch (error) {
        console.error(`[EmailService] Failed to send email ${email.id}:`, error);
        
        // Update status to failed
        await this.emailLogRepository.updateStatus(
          email.assessmentId,
          'failed',
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    }

    return processedCount;
  }
}
