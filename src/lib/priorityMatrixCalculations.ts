/**
 * Priority Matrix Calculations
 * 
 * Research-backed calculation of Team Performance Impact and Business Value If Fixed
 * for the 7 team effectiveness drivers.
 * 
 * Based on meta-analysis data:
 * - DeChurch & Mesmer-Magnus (2010): Team Cognition r=0.35, TMS r=0.26
 * - Costa & Anderson (2011): Trust r=0.33
 * - Marlow et al. (2018): Communication r=0.31
 * - LePine et al. (2008): Coordination r=0.29
 * - Mathieu et al. (2008): Goal Clarity r=0.28
 * - Frazier et al. (2017): Psychological Safety r=0.27
 */

// Industry types supported
export type Industry = 
  | 'Software & Technology'
  | 'Healthcare & Medical'
  | 'Financial Services'
  | 'Government & Public Sector'
  | 'Hospitality & Service'
  | 'Manufacturing & Industrial'
  | 'Professional Services';

// Driver IDs matching the assessment system
export type DriverId = 
  | 'trust'
  | 'psych_safety'
  | 'comm_quality'
  | 'goal_clarity'
  | 'coordination'
  | 'tms'
  | 'team_cognition';

// Quadrant types
export type Quadrant = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

// Team Performance Impact Weights (constant across industries)
// Normalized from meta-analysis correlation coefficients
export const TEAM_IMPACT_WEIGHTS: Record<DriverId, number> = {
  team_cognition: 1.00,   // r = 0.35 (highest)
  trust: 0.94,            // r = 0.33
  comm_quality: 0.89,     // r = 0.31
  coordination: 0.83,     // r = 0.29
  goal_clarity: 0.80,     // r = 0.28
  psych_safety: 0.77,     // r = 0.27
  tms: 0.74,              // r = 0.26
};

// Business Value Weights by Industry
// Base weights from research + industry-specific modifiers (±15%)
export const BUSINESS_VALUE_WEIGHTS: Record<Industry, Record<DriverId, number>> = {
  'Software & Technology': {
    trust: 0.94,
    psych_safety: 0.89,
    comm_quality: 1.00,
    goal_clarity: 0.85,
    coordination: 0.95,
    tms: 0.79,
    team_cognition: 1.00,
  },
  'Healthcare & Medical': {
    trust: 1.00,
    psych_safety: 0.89,
    comm_quality: 1.00,
    goal_clarity: 0.85,
    coordination: 0.88,
    tms: 0.79,
    team_cognition: 1.00,
  },
  'Financial Services': {
    trust: 0.94,
    psych_safety: 0.82,
    comm_quality: 1.00,
    goal_clarity: 0.85,
    coordination: 0.83,
    tms: 0.74,
    team_cognition: 1.00,
  },
  'Government & Public Sector': {
    trust: 0.94,
    psych_safety: 0.77,
    comm_quality: 0.94,
    goal_clarity: 0.92,
    coordination: 0.83,
    tms: 0.74,
    team_cognition: 0.90,
  },
  'Hospitality & Service': {
    trust: 1.00,
    psych_safety: 0.82,
    comm_quality: 0.94,
    goal_clarity: 0.80,
    coordination: 0.83,
    tms: 0.69,
    team_cognition: 0.85,
  },
  'Manufacturing & Industrial': {
    trust: 0.94,
    psych_safety: 0.77,
    comm_quality: 0.89,
    goal_clarity: 0.85,
    coordination: 0.95,
    tms: 0.85,
    team_cognition: 0.90,
  },
  'Professional Services': {
    trust: 1.00,
    psych_safety: 0.82,
    comm_quality: 1.00,
    goal_clarity: 0.85,
    coordination: 0.88,
    tms: 0.85,
    team_cognition: 1.00,
  },
};

// Driver display names
export const DRIVER_NAMES: Record<DriverId, string> = {
  trust: 'Trust',
  psych_safety: 'Psychological Safety',
  comm_quality: 'Communication Quality',
  goal_clarity: 'Goal Clarity',
  coordination: 'Coordination',
  tms: 'Transactive Memory',
  team_cognition: 'Team Cognition',
};

// Quadrant threshold
export const QUADRANT_THRESHOLD = 2.5;

// Quadrant definitions
export const QUADRANT_DEFINITIONS: Record<Quadrant, {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
}> = {
  CRITICAL: {
    label: 'Critical',
    description: 'High impact on daily team performance AND high business value if fixed. Address immediately.',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    textColor: '#991B1B',
  },
  HIGH: {
    label: 'High',
    description: 'Lower daily impact but high business value. Strategic investment opportunity.',
    color: '#2563EB',
    bgColor: '#DBEAFE',
    textColor: '#1E40AF',
  },
  MEDIUM: {
    label: 'Medium',
    description: 'High daily impact but lower business ROI. Improves team morale and efficiency.',
    color: '#D97706',
    bgColor: '#FEF3C7',
    textColor: '#92400E',
  },
  LOW: {
    label: 'Low',
    description: 'Lower impact on both dimensions. Monitor and maintain current state.',
    color: '#059669',
    bgColor: '#D1FAE5',
    textColor: '#065F46',
  },
};

// Result type for a single driver calculation
export interface DriverMatrixResult {
  driverId: DriverId;
  driverName: string;
  score: number;
  gap: number;
  teamImpactWeight: number;
  teamImpactScore: number;
  businessValueWeight: number;
  businessValueScore: number;
  quadrant: Quadrant;
}

// Full matrix result
export interface PriorityMatrixResult {
  industry: Industry;
  drivers: DriverMatrixResult[];
  quadrantCounts: Record<Quadrant, number>;
  calculatedAt: string;
}

/**
 * Calculate the gap for a driver score
 * Gap = 7 - Score (higher gap = more urgent)
 */
export function calculateGap(score: number): number {
  return Math.max(0, 7 - score);
}

/**
 * Determine which quadrant a driver belongs to based on weighted scores
 */
export function determineQuadrant(teamImpactScore: number, businessValueScore: number): Quadrant {
  const highTeamImpact = teamImpactScore >= QUADRANT_THRESHOLD;
  const highBusinessValue = businessValueScore >= QUADRANT_THRESHOLD;

  if (highTeamImpact && highBusinessValue) {
    return 'CRITICAL';
  } else if (!highTeamImpact && highBusinessValue) {
    return 'HIGH';
  } else if (highTeamImpact && !highBusinessValue) {
    return 'MEDIUM';
  } else {
    return 'LOW';
  }
}

/**
 * Calculate priority matrix for a single driver
 */
export function calculateDriverMatrix(
  driverId: DriverId,
  score: number,
  industry: Industry
): DriverMatrixResult {
  const gap = calculateGap(score);
  const teamImpactWeight = TEAM_IMPACT_WEIGHTS[driverId];
  const businessValueWeight = BUSINESS_VALUE_WEIGHTS[industry][driverId];
  
  const teamImpactScore = gap * teamImpactWeight;
  const businessValueScore = gap * businessValueWeight;
  
  const quadrant = determineQuadrant(teamImpactScore, businessValueScore);

  return {
    driverId,
    driverName: DRIVER_NAMES[driverId],
    score,
    gap,
    teamImpactWeight,
    teamImpactScore,
    businessValueWeight,
    businessValueScore,
    quadrant,
  };
}

/**
 * Calculate the full priority matrix for all drivers
 */
export function calculatePriorityMatrix(
  driverScores: Record<DriverId, number>,
  industry: Industry
): PriorityMatrixResult {
  const driverIds: DriverId[] = [
    'trust',
    'psych_safety',
    'comm_quality',
    'goal_clarity',
    'coordination',
    'tms',
    'team_cognition',
  ];

  const drivers = driverIds.map(driverId => 
    calculateDriverMatrix(driverId, driverScores[driverId] || 4, industry)
  );

  // Count drivers in each quadrant
  const quadrantCounts: Record<Quadrant, number> = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
  };

  drivers.forEach(driver => {
    quadrantCounts[driver.quadrant]++;
  });

  return {
    industry,
    drivers,
    quadrantCounts,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Get drivers sorted by priority (CRITICAL first, then HIGH, MEDIUM, LOW)
 */
export function getDriversByPriority(matrixResult: PriorityMatrixResult): DriverMatrixResult[] {
  const priorityOrder: Quadrant[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  
  return [...matrixResult.drivers].sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a.quadrant);
    const bIndex = priorityOrder.indexOf(b.quadrant);
    
    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }
    
    // Within same quadrant, sort by combined score (descending)
    const aCombined = a.teamImpactScore + a.businessValueScore;
    const bCombined = b.teamImpactScore + b.businessValueScore;
    return bCombined - aCombined;
  });
}

/**
 * Get drivers in a specific quadrant
 */
export function getDriversInQuadrant(
  matrixResult: PriorityMatrixResult,
  quadrant: Quadrant
): DriverMatrixResult[] {
  return matrixResult.drivers.filter(d => d.quadrant === quadrant);
}

/**
 * Convert database driver keys to DriverId format
 * Database uses: comm_quality, psych_safety, tms, goal_clarity, coordination, trust, team_cognition
 */
export function normalizeDriverId(key: string): DriverId | null {
  const mapping: Record<string, DriverId> = {
    'trust': 'trust',
    'psych_safety': 'psych_safety',
    'psychSafety': 'psych_safety',
    'psychological_safety': 'psych_safety',
    'comm_quality': 'comm_quality',
    'commQuality': 'comm_quality',
    'communication_quality': 'comm_quality',
    'communication': 'comm_quality',
    'goal_clarity': 'goal_clarity',
    'goalClarity': 'goal_clarity',
    'coordination': 'coordination',
    'tms': 'tms',
    'transactive_memory': 'tms',
    'transactiveMemory': 'tms',
    'team_cognition': 'team_cognition',
    'teamCognition': 'team_cognition',
  };
  
  return mapping[key] || null;
}

/**
 * Convert driver scores from various formats to standardized DriverId keys
 */
export function normalizeDriverScores(scores: Record<string, number>): Record<DriverId, number> {
  const normalized: Partial<Record<DriverId, number>> = {};
  
  for (const [key, value] of Object.entries(scores)) {
    const driverId = normalizeDriverId(key);
    if (driverId) {
      normalized[driverId] = value;
    }
  }
  
  // Fill in defaults for any missing drivers
  const allDrivers: DriverId[] = [
    'trust', 'psych_safety', 'comm_quality', 'goal_clarity',
    'coordination', 'tms', 'team_cognition'
  ];
  
  for (const driverId of allDrivers) {
    if (normalized[driverId] === undefined) {
      normalized[driverId] = 4; // Default to middle score
    }
  }
  
  return normalized as Record<DriverId, number>;
}

/**
 * Validate that an industry string is a valid Industry type
 */
export function isValidIndustry(industry: string): industry is Industry {
  const validIndustries: Industry[] = [
    'Software & Technology',
    'Healthcare & Medical',
    'Financial Services',
    'Government & Public Sector',
    'Hospitality & Service',
    'Manufacturing & Industrial',
    'Professional Services',
  ];
  
  return validIndustries.includes(industry as Industry);
}

/**
 * Get default industry
 */
export function getDefaultIndustry(): Industry {
  return 'Professional Services';
}
