/**
 * Main Calculation Service
 * Orchestrates all calculation logic using microservices architecture
 * Implements dependency injection and single responsibility principle
 */

import Decimal from 'decimal.js';
import {
  ICalculationService,
  IValidationService,
  IDomainFactory,
  IIndustryService,
  ICostComponentService,
  IMultiplierService,
  CalculationInput,
  CalculationResult,
  CostComponents,
} from '../../domain/interfaces/ICalculationService';
import {
  DriverScores,
  RawDriverScores,
  EngagementScore,
  AnomalyScore,
  ConfidenceInterval,
} from '../../domain/models/DysfunctionCostModels';
import {
  OVERLAP_DISCOUNT,
  TCD_UPPER_BOUND_MULTIPLIER,
  FORMULA_VERSION,
  DRIVER_WEIGHTS,
  DECIMAL_CONFIG,
} from '../../shared/constants/DysfunctionCostConstants';

// Configure Decimal.js
Decimal.set(DECIMAL_CONFIG);

export class CalculationService implements ICalculationService {
  constructor(
    private readonly validationService: IValidationService,
    private readonly domainFactory: IDomainFactory,
    private readonly industryService: IIndustryService,
    private readonly costComponentService: ICostComponentService,
    private readonly multiplierService: IMultiplierService
  ) {}

  /**
   * Calculate Total Cost of Dysfunction
   * Main orchestration method
   */
  async calculate(input: CalculationInput): Promise<CalculationResult> {
    // Step 1: Validate input
    this.validationService.validate(input);

    // Step 2: Create domain objects
    const driverScores = this.domainFactory.createDriverScores(input.driverScores);
    const teamSize = this.domainFactory.createTeamSize(input.teamSize);
    const payroll = this.domainFactory.createPayroll(input.payroll);
    const businessValue = this.domainFactory.createBusinessValueRatio(input.revenue, input.payroll);
    const industryConfig = this.industryService.getIndustryConfig(input.industry);

    // Step 3: Calculate engagement
    const engagement = EngagementScore.create(driverScores.trust, driverScores.psychSafety);

    // Step 4: Calculate anomaly score for gaming detection
    const anomaly = AnomalyScore.calculate(driverScores);

    // Step 5: Calculate all cost components
    const components = this.costComponentService.calculateAll(
      payroll,
      driverScores,
      industryConfig,
      businessValue,
      engagement
    );

    // Step 6: Apply overlap discount
    const subtotalWithDiscount = components.subtotal.times(OVERLAP_DISCOUNT);

    // Step 7: Calculate multipliers
    const multipliers = this.multiplierService.calculateAll(
      teamSize,
      anomaly,
      input.fourCsScores
    );

    // Step 8: Calculate raw TCD
    const tcdRaw = subtotalWithDiscount
      .times(multipliers.fourCs)
      .times(industryConfig.phi)
      .times(multipliers.teamSize)
      .times(multipliers.gaming);

    // Step 9: Apply upper bound cap
    const upperBound = payroll.amount.times(TCD_UPPER_BOUND_MULTIPLIER);
    const tcd = Decimal.min(tcdRaw, upperBound);

    // Step 10: Calculate confidence interval
    const confidenceInterval = ConfidenceInterval.create(tcd);

    // Step 11: Build result object
    const result: CalculationResult = {
      tcd,
      tcdRaw,
      costComponents: {
        productivity: components.C1,
        rework: components.C2,
        turnover: components.C3,
        opportunity: components.C4,
        overhead: components.C5,
        disengagement: components.C6,
        subtotal: components.subtotal,
        subtotalWithDiscount,
      },
      multipliers: {
        fourCs: multipliers.fourCs,
        industry: industryConfig.phi,
        teamSize: multipliers.teamSize,
        gaming: multipliers.gaming,
      },
      engagement: {
        score: engagement.value,
        category: engagement.getCategory(),
        coefficient: engagement.getCoefficient(),
      },
      anomaly: {
        score: anomaly.value,
        hasAnomaly: anomaly.hasAnomaly(),
        penaltyMultiplier: anomaly.getPenaltyMultiplier(),
      },
      confidenceInterval: {
        lower: confidenceInterval.lower,
        upper: confidenceInterval.upper,
        level: confidenceInterval.confidenceLevel,
      },
      metadata: {
        version: FORMULA_VERSION,
        timestamp: new Date(),
        industry: industryConfig.name,
      },
    };

    return result;
  }

  /**
   * Calculate readiness score (backward compatible with v3.x)
   * Maintains same weighted average calculation
   */
  calculateReadinessScore(driverScores: RawDriverScores): number {
    const clampedScores = this.domainFactory.createDriverScores(driverScores);

    const scoreMap: Record<string, number> = {
      trust: clampedScores.trust.value,
      psych_safety: clampedScores.psychSafety.value,
      comm_quality: clampedScores.commQuality.value,
      goal_clarity: clampedScores.goalClarity.value,
      coordination: clampedScores.coordination.value,
      tms: clampedScores.tms.value,
      team_cognition: clampedScores.teamCognition.value,
    };

    const readinessScore = Object.entries(scoreMap).reduce((sum, [driverId, score]) => {
      const weight = DRIVER_WEIGHTS[driverId as keyof typeof DRIVER_WEIGHTS] || 0;
      return sum + (score / 7) * weight;
    }, 0);

    return parseFloat(readinessScore.toFixed(4));
  }
}
