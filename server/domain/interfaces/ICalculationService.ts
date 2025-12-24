/**
 * Service interfaces for dependency inversion principle
 * Services depend on abstractions, not concrete implementations
 */

import Decimal from 'decimal.js';
import {
  DriverScores,
  RawDriverScores,
  IndustryConfig,
  TeamSize,
  Payroll,
  BusinessValueRatio,
  EngagementScore,
  AnomalyScore,
  FourCsScores,
  FourCsMultiplier,
  ConfidenceInterval,
} from '../models/DysfunctionCostModels';

/**
 * Input for TCD calculation
 */
export interface CalculationInput {
  payroll: number;
  teamSize: number;
  driverScores: RawDriverScores;
  industry: string;
  revenue?: number;
  fourCsScores?: FourCsScores;
}

/**
 * Cost components breakdown
 */
export interface CostComponents {
  productivity: Decimal;
  rework: Decimal;
  turnover: Decimal;
  opportunity: Decimal;
  overhead: Decimal;
  disengagement: Decimal;
  subtotal: Decimal;
  subtotalWithDiscount: Decimal;
}

/**
 * Multipliers applied to calculation
 */
export interface Multipliers {
  fourCs: number;
  industry: number;
  teamSize: number;
  gaming: number;
}

/**
 * Complete TCD calculation result
 */
export interface CalculationResult {
  tcd: Decimal;
  tcdRaw: Decimal;
  costComponents: CostComponents;
  multipliers: Multipliers;
  engagement: {
    score: number;
    category: 'Engaged' | 'Not Engaged' | 'Actively Disengaged';
    coefficient: number;
  };
  anomaly: {
    score: number;
    hasAnomaly: boolean;
    penaltyMultiplier: number;
  };
  confidenceInterval: {
    lower: Decimal;
    upper: Decimal;
    level: number;
  };
  metadata: {
    version: string;
    timestamp: Date;
    industry: string;
  };
}

/**
 * Service for calculating individual cost components
 */
export interface ICostComponentService {
  /**
   * Calculate productivity loss (C1)
   */
  calculateProductivityLoss(payroll: Payroll, driverScores: DriverScores): Decimal;

  /**
   * Calculate rework costs (C2)
   */
  calculateReworkCosts(payroll: Payroll, driverScores: DriverScores): Decimal;

  /**
   * Calculate turnover costs (C3)
   */
  calculateTurnoverCosts(
    payroll: Payroll,
    driverScores: DriverScores,
    industryConfig: IndustryConfig
  ): Decimal;

  /**
   * Calculate opportunity costs (C4)
   */
  calculateOpportunityCosts(
    payroll: Payroll,
    driverScores: DriverScores,
    businessValue: BusinessValueRatio
  ): Decimal;

  /**
   * Calculate overhead costs (C5)
   */
  calculateOverheadCosts(payroll: Payroll, driverScores: DriverScores): Decimal;

  /**
   * Calculate disengagement costs (C6)
   */
  calculateDisengagementCosts(
    payroll: Payroll,
    engagement: EngagementScore
  ): Decimal;

  /**
   * Calculate all cost components at once
   */
  calculateAll(
    payroll: Payroll,
    driverScores: DriverScores,
    industryConfig: IndustryConfig,
    businessValue: BusinessValueRatio,
    engagement: EngagementScore
  ): {
    C1: Decimal;
    C2: Decimal;
    C3: Decimal;
    C4: Decimal;
    C5: Decimal;
    C6: Decimal;
    subtotal: Decimal;
  };
}

/**
 * Service for calculating multipliers
 */
export interface IMultiplierService {
  /**
   * Calculate 4 C's multiplier
   */
  calculateFourCsMultiplier(scores?: FourCsScores): FourCsMultiplier;

  /**
   * Calculate team size efficiency factor
   */
  calculateTeamSizeFactor(teamSize: TeamSize): number;

  /**
   * Calculate gaming penalty
   */
  calculateGamingPenalty(anomaly: AnomalyScore): number;

  /**
   * Calculate all multipliers at once
   */
  calculateAll(
    teamSize: TeamSize,
    anomaly: AnomalyScore,
    fourCsScores?: FourCsScores
  ): {
    fourCs: number;
    teamSize: number;
    gaming: number;
  };
}

/**
 * Service for industry-specific logic
 */
export interface IIndustryService {
  /**
   * Get industry configuration by name
   */
  getIndustryConfig(industry: string): IndustryConfig;

  /**
   * Get all available industries
   */
  getAllIndustries(): IndustryConfig[];

  /**
   * Get default industry
   */
  getDefaultIndustry(): IndustryConfig;
}

/**
 * Main calculation service interface
 */
export interface ICalculationService {
  /**
   * Calculate Total Cost of Dysfunction
   */
  calculate(input: CalculationInput): Promise<CalculationResult>;

  /**
   * Calculate readiness score (backward compatible)
   */
  calculateReadinessScore(driverScores: RawDriverScores): number;
}

/**
 * Service for validation
 */
export interface IValidationService {
  /**
   * Validate calculation input
   */
  validate(input: CalculationInput): void;

  /**
   * Validate and return all errors
   */
  validateAll(input: CalculationInput): { isValid: boolean; errors: Error[] };
}

/**
 * Factory for creating domain objects
 */
export interface IDomainFactory {
  /**
   * Create driver scores from raw input
   */
  createDriverScores(raw: RawDriverScores): DriverScores;

  /**
   * Create team size
   */
  createTeamSize(size: number): TeamSize;

  /**
   * Create payroll
   */
  createPayroll(amount: number): Payroll;

  /**
   * Create business value ratio
   */
  createBusinessValueRatio(revenue: number | undefined, payroll: number): BusinessValueRatio;

  /**
   * Create engagement score
   */
  createEngagementScore(trust: number, psychSafety: number): EngagementScore;
}
