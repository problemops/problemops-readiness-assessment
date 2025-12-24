/**
 * Test Data Fixtures for E2E Tests
 */

export const TEST_COMPANY = {
  name: 'Acme Corporation',
  email: 'test@acme.com',
  website: 'https://acme.com',
  teamName: 'Engineering Team',
  teamSize: 10,
  avgSalary: 100000,
};

export const TEST_ANSWERS = {
  // All answers set to 3 (moderate) for consistent testing
  uniform: Array.from({ length: 35 }, () => 3),
  
  // Mixed scores for realistic testing
  mixed: [
    1, 2, 1, 3, 2, // Trust (low)
    6, 7, 6, 5, 6, // Psych Safety (high)
    3, 4, 3, 4, 3, // TMS (moderate)
    2, 3, 2, 3, 2, // Comm Quality (low-moderate)
    5, 6, 5, 6, 5, // Goal Clarity (moderate-high)
    4, 4, 4, 4, 4, // Coordination (moderate)
    3, 3, 3, 3, 3, // Team Cognition (moderate)
  ],
  
  // Perfect scores
  perfect: Array.from({ length: 35 }, () => 7),
  
  // Critical scores
  critical: Array.from({ length: 35 }, () => 1),
};

export const TRAINING_TYPES = {
  HALF_DAY: 'half-day',
  FULL_DAY: 'full-day',
  MONTH_LONG: 'month-long',
  NOT_SURE: 'not-sure',
} as const;

export const TRAINING_COSTS = {
  [TRAINING_TYPES.HALF_DAY]: 2000,
  [TRAINING_TYPES.FULL_DAY]: 3500,
  [TRAINING_TYPES.MONTH_LONG]: 30000,
};

export const EXPECTED_ROI_RANGES = {
  // ROI should be positive for most scenarios
  MIN_ROI_PERCENT: 0,
  MAX_ROI_PERCENT: 2000, // 2000% max
  
  // Payback period in months
  MIN_PAYBACK_MONTHS: 0.1,
  MAX_PAYBACK_MONTHS: 36,
};

/**
 * Calculate expected readiness score from answers
 */
export function calculateExpectedReadiness(answers: number[]): number {
  const sum = answers.reduce((a, b) => a + b, 0);
  const avg = sum / answers.length;
  return Math.round((avg / 7) * 100) / 100;
}

/**
 * Calculate expected dysfunction cost
 */
export function calculateExpectedDysfunctionCost(
  teamSize: number,
  avgSalary: number,
  readiness: number
): number {
  const annualCost = teamSize * avgSalary;
  const dysfunctionRate = 1 - readiness;
  return Math.round(annualCost * dysfunctionRate);
}
