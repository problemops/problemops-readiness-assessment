/**
 * Factory for creating domain objects
 * Centralizes complex object creation logic
 */

import {
  DriverScore,
  DriverScores,
  RawDriverScores,
  TeamSize,
  Payroll,
  BusinessValueRatio,
  EngagementScore,
} from '../models/DysfunctionCostModels';
import { IDomainFactory } from '../interfaces/ICalculationService';

export class DomainFactory implements IDomainFactory {
  /**
   * Create validated driver scores from raw input
   */
  createDriverScores(raw: RawDriverScores): DriverScores {
    return {
      trust: DriverScore.create(raw.trust),
      psychSafety: DriverScore.create(raw.psych_safety),
      commQuality: DriverScore.create(raw.comm_quality),
      goalClarity: DriverScore.create(raw.goal_clarity),
      coordination: DriverScore.create(raw.coordination),
      tms: DriverScore.create(raw.tms),
      teamCognition: DriverScore.create(raw.team_cognition),
    };
  }

  /**
   * Create team size with validation
   */
  createTeamSize(size: number): TeamSize {
    return TeamSize.create(size);
  }

  /**
   * Create payroll with validation
   */
  createPayroll(amount: number): Payroll {
    return Payroll.create(amount);
  }

  /**
   * Create business value ratio
   */
  createBusinessValueRatio(revenue: number | undefined, payroll: number): BusinessValueRatio {
    return BusinessValueRatio.create(revenue, payroll);
  }

  /**
   * Create engagement score
   */
  createEngagementScore(trust: number, psychSafety: number): EngagementScore {
    const trustScore = DriverScore.create(trust);
    const psychSafetyScore = DriverScore.create(psychSafety);
    return EngagementScore.create(trustScore, psychSafetyScore);
  }
}
