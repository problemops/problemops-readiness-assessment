/**
 * Driver Weights for Cost of Dysfunction Calculation
 * 
 * These weights determine what percentage of the Total Cost of Dysfunction (TCD)
 * is attributed to each driver. Based on meta-analysis research:
 * 
 * - Trust (18%): Costa & Anderson (2011), r=0.33
 * - Psychological Safety (17%): Frazier et al. (2017), r=0.27 + Kahn (1990) engagement link
 * - Communication Quality (15%): Marlow et al. (2018), r=0.31
 * - Goal Clarity (14%): Mathieu et al. (2008), r=0.28
 * - Coordination (13%): LePine et al. (2008), r=0.29
 * - Transactive Memory (12%): DeChurch & Mesmer-Magnus (2010), r=0.26
 * - Team Cognition (11%): DeChurch & Mesmer-Magnus (2010), r=0.35
 * 
 * Note: Weights sum to 1.00 (100%)
 */

export const DRIVER_WEIGHTS: Record<string, number> = {
  trust: 0.18,
  psych_safety: 0.17,
  comm_quality: 0.15,
  goal_clarity: 0.14,
  coordination: 0.13,
  tms: 0.12,
  team_cognition: 0.11,
} as const;

/**
 * Validate that weights sum to 1.0
 */
export function validateWeights(): boolean {
  const sum = Object.values(DRIVER_WEIGHTS).reduce((a, b) => a + b, 0);
  return Math.abs(sum - 1.0) < 0.001;
}

/**
 * Calculate driver cost from Total Cost of Dysfunction
 * 
 * Formula: Driver Cost = TCD × driver_weight
 * 
 * @param tcd - Total Cost of Dysfunction (from v4.0 formula)
 * @param driverId - The driver ID
 * @returns The cost attributed to this driver
 */
export function calculateDriverCostFromTCD(tcd: number, driverId: string): number {
  const weight = DRIVER_WEIGHTS[driverId] || 0;
  return tcd * weight;
}

/**
 * Calculate all driver costs from Total Cost of Dysfunction
 * 
 * @param tcd - Total Cost of Dysfunction (from v4.0 formula)
 * @returns Record of driver ID to cost
 */
export function calculateAllDriverCostsFromTCD(tcd: number): Record<string, number> {
  const costs: Record<string, number> = {};
  
  for (const [driverId, weight] of Object.entries(DRIVER_WEIGHTS)) {
    costs[driverId] = tcd * weight;
  }
  
  return costs;
}

/**
 * Calculate "Value If Fixed" for a driver
 * 
 * Formula: Value If Fixed = Driver Cost × improvement_factor
 * Where improvement_factor = 0.85 (85% improvement assumption)
 * 
 * @param driverCost - The cost attributed to this driver
 * @param improvementFactor - Expected improvement (default 0.85 = 85%)
 * @returns The value if this driver is fixed
 */
export function calculateValueIfFixed(driverCost: number, improvementFactor: number = 0.85): number {
  return driverCost * improvementFactor;
}

/**
 * Get driver weight as percentage string
 */
export function getDriverWeightPercent(driverId: string): string {
  const weight = DRIVER_WEIGHTS[driverId] || 0;
  return `${Math.round(weight * 100)}%`;
}
