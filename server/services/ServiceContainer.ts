/**
 * Service Container
 * Implements Dependency Injection pattern
 * Single source of truth for service instantiation
 */

import { ICalculationService } from '../domain/interfaces/ICalculationService';
import { IAssessmentService } from '../domain/interfaces/IAssessmentService';
import { IIndustryClassificationService } from '../domain/interfaces/IIndustryClassificationService';
import { CalculationService } from './calculation/CalculationService';
import { AssessmentService } from '../application/services/assessment/AssessmentService';
import { IndustryClassificationService } from '../application/services/industry/IndustryClassificationService';
import { LLMClient } from '../infrastructure/external/llm/LLMClient';
import { ValidationService } from './calculation/ValidationService';
import { CostComponentService } from './calculation/CostComponentService';
import { MultiplierService } from './calculation/MultiplierService';
import { IndustryService } from './industry/IndustryService';
import { DomainFactory } from '../domain/factories/DomainFactory';
import { AssessmentRepository } from '../infrastructure/database/repositories/AssessmentRepository';
import { EmailLogRepository } from '../infrastructure/database/repositories/EmailLogRepository';

/**
 * Service Container
 * Manages service lifecycle and dependencies
 */
export class ServiceContainer {
  private static instance: ServiceContainer;
  private calculationService: ICalculationService | null = null;
  private assessmentService: IAssessmentService | null = null;
  private industryClassificationService: IIndustryClassificationService | null = null;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  /**
   * Get calculation service (lazy initialization)
   */
  getCalculationService(): ICalculationService {
    if (!this.calculationService) {
      // Create dependencies
      const validationService = new ValidationService();
      const domainFactory = new DomainFactory();
      const industryService = new IndustryService();
      const costComponentService = new CostComponentService();
      const multiplierService = new MultiplierService();

      // Inject dependencies into main service
      this.calculationService = new CalculationService(
        validationService,
        domainFactory,
        industryService,
        costComponentService,
        multiplierService
      );
    }

    return this.calculationService;
  }

  /**
   * Get assessment service (lazy initialization)
   */
  getAssessmentService(): IAssessmentService {
    if (!this.assessmentService) {
      // Create dependencies
      const assessmentRepository = new AssessmentRepository();
      const emailLogRepository = new EmailLogRepository();
      const calculationService = this.getCalculationService();
      const industryService = this.getIndustryClassificationService();
      const priorityMatrixService = new (require('../application/services/priorityMatrix/PriorityMatrixService').PriorityMatrixService)();
      const trainingService = new (require('../application/services/training/TrainingRecommendationService').TrainingRecommendationService)();

      // Inject dependencies
      this.assessmentService = new AssessmentService(
        assessmentRepository,
        emailLogRepository,
        calculationService,
        industryService,
        priorityMatrixService,
        trainingService
      );
    }

    return this.assessmentService;
  }

  /**
   * Get industry classification service (lazy initialization)
   */
  getIndustryClassificationService(): IIndustryClassificationService {
    if (!this.industryClassificationService) {
      const llmClient = new LLMClient();
      this.industryClassificationService = new IndustryClassificationService(llmClient);
    }

    return this.industryClassificationService;
  }

  /**
   * Reset container (useful for testing)
   */
  reset(): void {
    this.calculationService = null;
    this.assessmentService = null;
    this.industryClassificationService = null;
  }
}

/**
 * Convenience function to get calculation service
 */
export function getCalculationService(): ICalculationService {
  return ServiceContainer.getInstance().getCalculationService();
}

/**
 * Convenience function to get assessment service
 */
export function getAssessmentService(): IAssessmentService {
  return ServiceContainer.getInstance().getAssessmentService();
}

/**
 * Convenience function to get industry classification service
 */
export function getIndustryClassificationService(): IIndustryClassificationService {
  return ServiceContainer.getInstance().getIndustryClassificationService();
}
