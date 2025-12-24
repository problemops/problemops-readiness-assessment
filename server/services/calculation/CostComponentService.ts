/**
 * Cost Component Service
 * Calculates individual cost components (C1-C6)
 * Each method is a pure function with clear inputs and outputs
 */

import Decimal from 'decimal.js';
import {
  DriverScores,
  Payroll,
  IndustryConfig,
  BusinessValueRatio,
  EngagementScore,
} from '../../domain/models/DysfunctionCostModels';
import { ICostComponentService } from '../../domain/interfaces/ICalculationService';
import { COST_COEFFICIENTS } from '../../shared/constants/DysfunctionCostConstants';

export class CostComponentService implements ICostComponentService {
  /**
   * C1: Productivity Loss
   * Formula: P × 0.25 × (1 - R)
   * where R = normalized readiness score
   */
  calculateProductivityLoss(payroll: Payroll, driverScores: DriverScores): Decimal {
    // Calculate readiness score (normalized average of all drivers)
    const driverValues = [
      driverScores.trust,
      driverScores.psychSafety,
      driverScores.commQuality,
      driverScores.goalClarity,
      driverScores.coordination,
      driverScores.tms,
      driverScores.teamCognition,
    ];

    const avgScore = driverValues.reduce((sum, score) => sum + score.value, 0) / driverValues.length;
    const readiness = (avgScore - 1) / 6; // Normalize to [0, 1]

    return payroll.amount
      .times(COST_COEFFICIENTS.PRODUCTIVITY)
      .times(1 - readiness);
  }

  /**
   * C2: Rework Costs
   * Formula: P × 0.10 × Q_adj
   * where Q_adj = quality adjustment based on Communication and Team Cognition
   */
  calculateReworkCosts(payroll: Payroll, driverScores: DriverScores): Decimal {
    const commInverted = driverScores.commQuality.invert();
    const tcInverted = driverScores.teamCognition.invert();
    const qualityAdj = (commInverted + tcInverted) / 12;

    return payroll.amount
      .times(COST_COEFFICIENTS.REWORK)
      .times(qualityAdj);
  }

  /**
   * C3: Turnover Costs
   * Formula: P × 0.21 × T_adj
   * where T_adj = turnover adjustment based on Trust and Psychological Safety
   */
  calculateTurnoverCosts(
    payroll: Payroll,
    driverScores: DriverScores,
    industryConfig: IndustryConfig
  ): Decimal {
    const trustInverted = driverScores.trust.invert();
    const psychInverted = driverScores.psychSafety.invert();
    const turnoverAdj = ((trustInverted + psychInverted) / 12) * industryConfig.rho;

    return payroll.amount
      .times(COST_COEFFICIENTS.TURNOVER)
      .times(turnoverAdj);
  }

  /**
   * C4: Opportunity Costs
   * Formula: P × 0.15 × O_adj × BV
   * where O_adj = opportunity adjustment based on Coordination and Goal Clarity
   */
  calculateOpportunityCosts(
    payroll: Payroll,
    driverScores: DriverScores,
    businessValue: BusinessValueRatio
  ): Decimal {
    const coordInverted = driverScores.coordination.invert();
    const goalInverted = driverScores.goalClarity.invert();
    const opportunityAdj = (coordInverted + goalInverted) / 12;

    return payroll.amount
      .times(COST_COEFFICIENTS.OPPORTUNITY)
      .times(opportunityAdj)
      .times(businessValue.value);
  }

  /**
   * C5: Overhead Costs
   * Formula: P × 0.12 × H_adj
   * where H_adj = overhead adjustment based on TMS and Communication
   */
  calculateOverheadCosts(payroll: Payroll, driverScores: DriverScores): Decimal {
    const tmsInverted = driverScores.tms.invert();
    const commInverted = driverScores.commQuality.invert();
    const overheadAdj = (tmsInverted + commInverted) / 12;

    return payroll.amount
      .times(COST_COEFFICIENTS.OVERHEAD)
      .times(overheadAdj);
  }

  /**
   * C6: Disengagement Costs
   * Formula: P × E_coef(E) × E_adj
   * where E_coef is continuous sigmoid function
   */
  calculateDisengagementCosts(
    payroll: Payroll,
    engagement: EngagementScore
  ): Decimal {
    const coefficient = engagement.getCoefficient();
    const adjustment = engagement.getAdjustmentFactor();

    return payroll.amount
      .times(coefficient)
      .times(adjustment);
  }

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
  } {
    const C1 = this.calculateProductivityLoss(payroll, driverScores);
    const C2 = this.calculateReworkCosts(payroll, driverScores);
    const C3 = this.calculateTurnoverCosts(payroll, driverScores, industryConfig);
    const C4 = this.calculateOpportunityCosts(payroll, driverScores, businessValue);
    const C5 = this.calculateOverheadCosts(payroll, driverScores);
    const C6 = this.calculateDisengagementCosts(payroll, engagement);

    const subtotal = C1.plus(C2).plus(C3).plus(C4).plus(C5).plus(C6);

    return { C1, C2, C3, C4, C5, C6, subtotal };
  }
}
