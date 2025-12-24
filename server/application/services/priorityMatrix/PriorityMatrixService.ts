/**
 * Priority Matrix Service
 * Research-backed calculation of Team Performance Impact and Business Value
 * 
 * Based on meta-analysis data:
 * - DeChurch & Mesmer-Magnus (2010): Team Cognition r=0.35, TMS r=0.26
 * - Costa & Anderson (2011): Trust r=0.33
 * - Marlow et al. (2018): Communication r=0.31
 * - LePine et al. (2008): Coordination r=0.29
 * - Mathieu et al. (2008): Goal Clarity r=0.28
 * - Frazier et al. (2017): Psychological Safety r=0.27
 */

export type DriverId = 
  | 'trust'
  | 'psych_safety'
  | 'comm_quality'
  | 'goal_clarity'
  | 'coordination'
  | 'tms'
  | 'team_cognition';

export type Quadrant = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

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

export interface PriorityMatrixResult {
  industry: string;
  drivers: DriverMatrixResult[];
  quadrantCounts: Record<Quadrant, number>;
  calculatedAt: string;
}

// Team Performance Impact Weights (constant across industries)
const TEAM_IMPACT_WEIGHTS: Record<DriverId, number> = {
  team_cognition: 1.00,
  trust: 0.94,
  comm_quality: 0.89,
  coordination: 0.83,
  goal_clarity: 0.80,
  psych_safety: 0.77,
  tms: 0.74,
};

// Business Value Weights by Industry
const BUSINESS_VALUE_WEIGHTS: Record<string, Record<DriverId, number>> = {
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

const DRIVER_NAMES: Record<DriverId, string> = {
  trust: 'Trust',
  psych_safety: 'Psychological Safety',
  comm_quality: 'Communication Quality',
  goal_clarity: 'Goal Clarity',
  coordination: 'Coordination',
  tms: 'Transactive Memory',
  team_cognition: 'Team Cognition',
};

const QUADRANT_THRESHOLD = 2.5;

export class PriorityMatrixService {
  /**
   * Calculate the gap for a driver score
   */
  private calculateGap(score: number): number {
    return Math.max(0, 7 - score);
  }

  /**
   * Determine quadrant based on weighted scores
   */
  private determineQuadrant(teamImpactScore: number, businessValueScore: number): Quadrant {
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
  private calculateDriverMatrix(
    driverId: DriverId,
    score: number,
    industry: string
  ): DriverMatrixResult {
    const gap = this.calculateGap(score);
    const teamImpactWeight = TEAM_IMPACT_WEIGHTS[driverId];
    
    // Get business value weights for industry (fallback to Professional Services)
    const industryWeights = BUSINESS_VALUE_WEIGHTS[industry] || BUSINESS_VALUE_WEIGHTS['Professional Services'];
    const businessValueWeight = industryWeights[driverId];
    
    const teamImpactScore = gap * teamImpactWeight;
    const businessValueScore = gap * businessValueWeight;
    
    const quadrant = this.determineQuadrant(teamImpactScore, businessValueScore);

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
  calculatePriorityMatrix(
    driverScores: Record<string, number>,
    industry: string
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
      this.calculateDriverMatrix(driverId, driverScores[driverId] || 4, industry)
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
   * Get drivers sorted by priority
   */
  getDriversByPriority(matrixResult: PriorityMatrixResult): DriverMatrixResult[] {
    const priorityOrder: Quadrant[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    
    return [...matrixResult.drivers].sort((a, b) => {
      const aIndex = priorityOrder.indexOf(a.quadrant);
      const bIndex = priorityOrder.indexOf(b.quadrant);
      
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
      
      // Within same quadrant, sort by team impact score (descending)
      return b.teamImpactScore - a.teamImpactScore;
    });
  }
}
