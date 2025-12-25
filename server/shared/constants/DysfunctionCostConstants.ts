/**
 * Shared constants for Dysfunction Cost calculations
 * Single source of truth for all coefficients and thresholds
 */

/**
 * Research-backed cost coefficients
 */
export const COST_COEFFICIENTS = {
  /** Productivity loss coefficient (Gallup Q12 research) */
  PRODUCTIVITY: 0.25,
  
  /** Rework cost coefficient (Love et al. 2010 construction research) */
  REWORK: 0.10,
  
  /** Turnover cost coefficient (Boushey & Glynn 2012, median across all positions) */
  TURNOVER: 0.21,
  
  /** Opportunity cost coefficient */
  OPPORTUNITY: 0.15,
  
  /** Overhead cost coefficient */
  OVERHEAD: 0.12,
  
  /** Maximum disengagement coefficient (Gallup actively disengaged) */
  DISENGAGEMENT_MAX: 0.18,
} as const;

/**
 * Overlap discount to prevent double-counting
 */
export const OVERLAP_DISCOUNT = 0.88; // 12% reduction

/**
 * Driver score bounds
 */
export const DRIVER_BOUNDS = {
  MIN: 1,
  MAX: 7,
} as const;

/**
 * Team size thresholds
 */
export const TEAM_SIZE_THRESHOLDS = {
  /** Minimum viable team size */
  MIN: 1,
  
  /** Understaffed threshold */
  UNDERSTAFFED: 5,
  
  /** Optimal range upper bound */
  OPTIMAL_MAX: 12,
  
  /** Understaffing penalty multiplier */
  UNDERSTAFFED_PENALTY: 1.2,
  
  /** Overstaffing penalty per person */
  OVERSTAFFED_PENALTY_PER_PERSON: 0.02,
} as const;

/**
 * Engagement score thresholds (Kahn 1990, Gallup Q12)
 */
export const ENGAGEMENT_THRESHOLDS = {
  /** Engaged threshold (Trust + Psych Safety avg) */
  ENGAGED: 5.5,
  
  /** Not engaged threshold */
  NOT_ENGAGED: 3.5,
  
  /** Sigmoid function parameters for continuous engagement */
  SIGMOID: {
    /** Midpoint of sigmoid curve */
    MIDPOINT: 4.0,
    
    /** Steepness of sigmoid curve */
    STEEPNESS: 2.0,
  },
} as const;

/**
 * Business Value ratio bounds
 */
export const BUSINESS_VALUE_BOUNDS = {
  MIN: 1.0,
  MAX: 10.0,
} as const;

/**
 * Gaming detection thresholds
 */
export const GAMING_DETECTION = {
  /** Trust <-> Psychological Safety correlation tolerance */
  TRUST_PSYCH_TOLERANCE: 1.5,
  
  /** Communication <-> Coordination correlation tolerance */
  COMM_COORD_TOLERANCE: 2.0,
  
  /** Goal Clarity <-> Team Cognition correlation tolerance */
  GOAL_TC_TOLERANCE: 2.5,
  
  /** Anomaly threshold before penalty applies */
  ANOMALY_THRESHOLD: 1.5,
  
  /** Gaming penalty rate (per anomaly point above threshold) */
  PENALTY_RATE: 0.1,
  
  /** Maximum gaming penalty multiplier */
  MAX_PENALTY: 1.5,
} as const;

/**
 * 4 C's multiplier parameters
 */
export const FOUR_CS_PARAMS = {
  /** Maximum amplification from poor 4 C's scores */
  MAX_AMPLIFICATION: 0.5,
  
  /** Neutral multiplier when no 4 C's data */
  NEUTRAL: 1.0,
} as const;

/**
 * Upper bound cap for TCD
 */
export const TCD_UPPER_BOUND_MULTIPLIER = 3.5; // 350% of payroll

/**
 * Confidence interval parameters
 */
export const CONFIDENCE_INTERVAL = {
  /** Confidence level (95%) */
  LEVEL: 0.95,
  
  /** Lower bound multiplier (based on Monte Carlo validation) */
  LOWER_MULTIPLIER: 0.75,
  
  /** Upper bound multiplier (based on Monte Carlo validation) */
  UPPER_MULTIPLIER: 1.30,
} as const;

/**
 * Driver weights for cost allocation (must sum to 1.00)
 * Based on meta-analysis research:
 * - Trust (18%): Costa & Anderson (2011), r=0.33
 * - Psychological Safety (17%): Frazier et al. (2017) + Kahn (1990)
 * - Communication Quality (15%): Marlow et al. (2018), r=0.31
 * - Goal Clarity (14%): Mathieu et al. (2008), r=0.28
 * - Coordination (13%): LePine et al. (2008), r=0.29
 * - Transactive Memory (12%): DeChurch & Mesmer-Magnus (2010), r=0.26
 * - Team Cognition (11%): DeChurch & Mesmer-Magnus (2010), r=0.35
 */
export const DRIVER_WEIGHTS = {
  trust: 0.18,
  psych_safety: 0.17,
  comm_quality: 0.15,
  goal_clarity: 0.14,
  coordination: 0.13,
  tms: 0.12,
  team_cognition: 0.11,
} as const;

/**
 * Industry configurations
 */
export const INDUSTRY_CONFIGS = {
  HEALTHCARE: {
    name: 'Healthcare',
    phi: 1.30,
    rho: 1.25,
  },
  FINANCIAL_SERVICES: {
    name: 'Financial Services',
    phi: 1.25,
    rho: 1.20,
  },
  TECHNOLOGY: {
    name: 'Technology',
    phi: 1.20,
    rho: 1.15,
  },
  PROFESSIONAL_SERVICES: {
    name: 'Professional Services',
    phi: 1.15,
    rho: 1.10,
  },
  MANUFACTURING: {
    name: 'Manufacturing',
    phi: 1.00,
    rho: 1.00,
  },
  RETAIL: {
    name: 'Retail',
    phi: 0.90,
    rho: 0.95,
  },
  GOVERNMENT: {
    name: 'Government',
    phi: 0.85,
    rho: 0.90,
  },
} as const;

/**
 * Default industry when detection fails
 */
export const DEFAULT_INDUSTRY = 'Manufacturing';

/**
 * Formula version
 */
export const FORMULA_VERSION = '4.0.0';

/**
 * Decimal.js precision configuration
 */
export const DECIMAL_CONFIG = {
  precision: 50,
  rounding: 4, // ROUND_HALF_UP
} as const;
