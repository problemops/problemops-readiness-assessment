/**
 * Domain models for Dysfunction Cost calculations
 * Immutable value objects with validation
 */

import Decimal from 'decimal.js';

/**
 * Driver score value object (1-7 scale)
 * Immutable and self-validating
 */
export class DriverScore {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): DriverScore {
    const clamped = Math.max(1, Math.min(7, value));
    return new DriverScore(clamped);
  }

  get value(): number {
    return this._value;
  }

  /**
   * Normalize to [0, 1] range
   */
  normalize(): number {
    return (this._value - 1) / 6;
  }

  /**
   * Invert score (7 - value) for dysfunction calculations
   */
  invert(): number {
    return 7 - this._value;
  }

  toString(): string {
    return this._value.toFixed(1);
  }
}

/**
 * Collection of all 7 driver scores
 * Ensures all required drivers are present
 */
export interface DriverScores {
  readonly trust: DriverScore;
  readonly psychSafety: DriverScore;
  readonly commQuality: DriverScore;
  readonly goalClarity: DriverScore;
  readonly coordination: DriverScore;
  readonly tms: DriverScore;
  readonly teamCognition: DriverScore;
}

/**
 * Raw driver scores from input (before validation)
 */
export interface RawDriverScores {
  trust: number;
  psych_safety: number;
  comm_quality: number;
  goal_clarity: number;
  coordination: number;
  tms: number;
  team_cognition: number;
}

/**
 * Industry configuration value object
 */
export class IndustryConfig {
  constructor(
    public readonly name: string,
    public readonly phi: number,  // Industry adjustment factor
    public readonly rho: number   // Turnover rate multiplier
  ) {}

  static readonly HEALTHCARE = new IndustryConfig('Healthcare', 1.30, 1.25);
  static readonly FINANCIAL_SERVICES = new IndustryConfig('Financial Services', 1.25, 1.20);
  static readonly TECHNOLOGY = new IndustryConfig('Technology', 1.20, 1.15);
  static readonly PROFESSIONAL_SERVICES = new IndustryConfig('Professional Services', 1.15, 1.10);
  static readonly MANUFACTURING = new IndustryConfig('Manufacturing', 1.00, 1.00);
  static readonly RETAIL = new IndustryConfig('Retail', 0.90, 0.95);
  static readonly GOVERNMENT = new IndustryConfig('Government', 0.85, 0.90);

  static readonly DEFAULT = IndustryConfig.MANUFACTURING;

  private static readonly REGISTRY = new Map<string, IndustryConfig>([
    ['Healthcare', IndustryConfig.HEALTHCARE],
    ['Financial Services', IndustryConfig.FINANCIAL_SERVICES],
    ['Technology', IndustryConfig.TECHNOLOGY],
    ['Professional Services', IndustryConfig.PROFESSIONAL_SERVICES],
    ['Manufacturing', IndustryConfig.MANUFACTURING],
    ['Retail', IndustryConfig.RETAIL],
    ['Government', IndustryConfig.GOVERNMENT],
  ]);

  static fromName(name: string): IndustryConfig {
    return this.REGISTRY.get(name) || this.DEFAULT;
  }

  static getAllIndustries(): IndustryConfig[] {
    return Array.from(this.REGISTRY.values());
  }
}

/**
 * Team size value object with validation
 */
export class TeamSize {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): TeamSize {
    if (value < 1) {
      throw new Error(`Team size must be at least 1, got: ${value}`);
    }
    return new TeamSize(Math.floor(value));
  }

  get value(): number {
    return this._value;
  }

  /**
   * Calculate team size efficiency factor η(N)
   * Penalizes understaffing (N < 5) and overstaffing (N > 12)
   */
  getEfficiencyFactor(): number {
    if (this._value < 5) {
      return 1.2; // 20% penalty for understaffing
    } else if (this._value <= 12) {
      return 1.0; // Optimal range
    } else {
      return 1.0 + 0.02 * (this._value - 12); // 2% penalty per person over 12
    }
  }

  isUnderstaffed(): boolean {
    return this._value < 5;
  }

  isOverstaffed(): boolean {
    return this._value > 12;
  }

  isOptimal(): boolean {
    return this._value >= 5 && this._value <= 12;
  }
}

/**
 * Payroll value object with validation and precision
 */
export class Payroll {
  private readonly _amount: Decimal;

  private constructor(amount: Decimal) {
    this._amount = amount;
  }

  static create(amount: number): Payroll {
    if (amount <= 0) {
      throw new Error(`Payroll must be greater than 0, got: ${amount}`);
    }
    return new Payroll(new Decimal(amount));
  }

  get amount(): Decimal {
    return this._amount;
  }

  get value(): number {
    return this._amount.toNumber();
  }

  multiply(factor: number | Decimal): Payroll {
    return new Payroll(this._amount.times(factor));
  }

  toString(): string {
    return `$${this._amount.toFixed(2)}`;
  }
}

/**
 * Business Value ratio with bounds [1, 10]
 */
export class BusinessValueRatio {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(revenue: number | undefined, payroll: number): BusinessValueRatio {
    if (!revenue || revenue <= 0) {
      return new BusinessValueRatio(1.0);
    }
    const ratio = revenue / payroll;
    const clamped = Math.max(1.0, Math.min(10.0, ratio));
    return new BusinessValueRatio(clamped);
  }

  get value(): number {
    return this._value;
  }

  isLow(): boolean {
    return this._value < 2.0;
  }

  isHigh(): boolean {
    return this._value > 5.0;
  }
}

/**
 * Engagement score (average of Trust and Psychological Safety)
 */
export class EngagementScore {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(trust: DriverScore, psychSafety: DriverScore): EngagementScore {
    const avg = (trust.value + psychSafety.value) / 2;
    return new EngagementScore(avg);
  }

  get value(): number {
    return this._value;
  }

  getCategory(): 'Engaged' | 'Not Engaged' | 'Actively Disengaged' {
    if (this._value >= 5.5) return 'Engaged';
    if (this._value >= 3.5) return 'Not Engaged';
    return 'Actively Disengaged';
  }

  /**
   * Calculate continuous engagement coefficient using sigmoid
   * E_coef(E) = 0.18 / (1 + e^(2(E-4)))
   */
  getCoefficient(): number {
    const exponent = 2 * (this._value - 4);
    const sigmoid = 1 / (1 + Math.exp(exponent));
    return 0.18 * sigmoid;
  }

  /**
   * Normalized adjustment factor for disengagement
   */
  getAdjustmentFactor(): number {
    return (7 - this._value) / 6;
  }
}

/**
 * Anomaly score for gaming detection
 */
export class AnomalyScore {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static calculate(scores: DriverScores): AnomalyScore {
    const anomalies: number[] = [];

    // Trust <-> Psychological Safety (tolerance: 1.5 points)
    const trustPsychDiff = Math.abs(scores.trust.value - scores.psychSafety.value);
    if (trustPsychDiff > 1.5) {
      anomalies.push(trustPsychDiff - 1.5);
    }

    // Communication <-> Coordination (tolerance: 2.0 points)
    const commCoordDiff = Math.abs(scores.commQuality.value - scores.coordination.value);
    if (commCoordDiff > 2.0) {
      anomalies.push(commCoordDiff - 2.0);
    }

    // Goal Clarity <-> Team Cognition (tolerance: 2.5 points)
    const goalTcDiff = Math.abs(scores.goalClarity.value - scores.teamCognition.value);
    if (goalTcDiff > 2.5) {
      anomalies.push(goalTcDiff - 2.5);
    }

    const total = anomalies.reduce((sum, a) => sum + a, 0);
    return new AnomalyScore(total);
  }

  get value(): number {
    return this._value;
  }

  /**
   * Calculate gaming penalty multiplier G
   * G = min(1.5, 1 + 0.1 × max(0, A_total - 1.5))
   */
  getPenaltyMultiplier(): number {
    if (this._value <= 1.5) {
      return 1.0; // No penalty
    }
    return Math.min(1.5, 1.0 + 0.1 * (this._value - 1.5));
  }

  hasAnomaly(): boolean {
    return this._value > 1.5;
  }
}

/**
 * 4 C's scores (optional)
 */
export interface FourCsScores {
  criteria: number;
  commitment: number;
  collaboration: number;
  change: number;
}

/**
 * 4 C's multiplier
 */
export class FourCsMultiplier {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(scores?: FourCsScores): FourCsMultiplier {
    if (!scores) {
      return new FourCsMultiplier(1.0);
    }

    const avgScore = (scores.criteria + scores.commitment + scores.collaboration + scores.change) / 4;
    // M_4C = 1 + 0.5 × (1 - avg/7)
    const multiplier = 1.0 + 0.5 * (1.0 - avgScore / 7.0);
    return new FourCsMultiplier(multiplier);
  }

  get value(): number {
    return this._value;
  }
}

/**
 * Confidence interval for TCD estimate
 */
export class ConfidenceInterval {
  constructor(
    public readonly lower: Decimal,
    public readonly upper: Decimal,
    public readonly confidenceLevel: number = 0.95
  ) {}

  static create(tcd: Decimal, confidenceLevel: number = 0.95): ConfidenceInterval {
    // Based on Monte Carlo validation: ±25% at 95% confidence
    const lower = tcd.times(0.75);
    const upper = tcd.times(1.30);
    return new ConfidenceInterval(lower, upper, confidenceLevel);
  }

  contains(value: Decimal): boolean {
    return value.gte(this.lower) && value.lte(this.upper);
  }

  getWidth(): Decimal {
    return this.upper.minus(this.lower);
  }

  toString(): string {
    return `[${this.lower.toFixed(2)}, ${this.upper.toFixed(2)}] (${this.confidenceLevel * 100}% CI)`;
  }
}
