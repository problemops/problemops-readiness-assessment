/**
 * Multiplier Service
 * Calculates all multipliers (M_4C, φ, η, G)
 */

import {
  FourCsScores,
  FourCsMultiplier,
  TeamSize,
  AnomalyScore,
} from '../../domain/models/DysfunctionCostModels';
import { IMultiplierService } from '../../domain/interfaces/ICalculationService';

export class MultiplierService implements IMultiplierService {
  /**
   * Calculate 4 C's multiplier
   * M_4C = 1 + 0.5 × (1 - avg/7)
   */
  calculateFourCsMultiplier(scores?: FourCsScores): FourCsMultiplier {
    return FourCsMultiplier.create(scores);
  }

  /**
   * Calculate team size efficiency factor η(N)
   * - N < 5: 1.2 (understaffed penalty)
   * - 5 ≤ N ≤ 12: 1.0 (optimal)
   * - N > 12: 1.0 + 0.02(N-12) (overstaffed penalty)
   */
  calculateTeamSizeFactor(teamSize: TeamSize): number {
    return teamSize.getEfficiencyFactor();
  }

  /**
   * Calculate gaming penalty multiplier G
   * G = min(1.5, 1 + 0.1 × max(0, A_total - 1.5))
   */
  calculateGamingPenalty(anomaly: AnomalyScore): number {
    return anomaly.getPenaltyMultiplier();
  }

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
  } {
    return {
      fourCs: this.calculateFourCsMultiplier(fourCsScores).value,
      teamSize: this.calculateTeamSizeFactor(teamSize),
      gaming: this.calculateGamingPenalty(anomaly),
    };
  }
}
