/**
 * Input validation service for Dysfunction Cost calculations
 * Centralizes all validation logic with detailed error messages
 */

import {
  InvalidTeamSizeError,
  InvalidPayrollError,
  InvalidDriverScoreError,
  ValidationError,
} from '../errors/DysfunctionCostErrors';
import { RawDriverScores } from '../models/DysfunctionCostModels';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export class DysfunctionCostValidator {
  /**
   * Validate team size
   */
  static validateTeamSize(teamSize: number): void {
    if (teamSize < 1) {
      throw new InvalidTeamSizeError(teamSize);
    }
    if (!Number.isFinite(teamSize)) {
      throw new ValidationError('Team size must be a finite number', { teamSize });
    }
    if (teamSize !== Math.floor(teamSize)) {
      throw new ValidationError('Team size must be an integer', { teamSize });
    }
  }

  /**
   * Validate payroll
   */
  static validatePayroll(payroll: number): void {
    if (payroll <= 0) {
      throw new InvalidPayrollError(payroll);
    }
    if (!Number.isFinite(payroll)) {
      throw new ValidationError('Payroll must be a finite number', { payroll });
    }
  }

  /**
   * Validate a single driver score
   */
  static validateDriverScore(driverName: string, score: number): void {
    if (!Number.isFinite(score)) {
      throw new InvalidDriverScoreError(driverName, score);
    }
    // Note: We clamp scores to [1,7] rather than rejecting out-of-range values
    // This is a business decision to be more forgiving with user input
  }

  /**
   * Validate all driver scores
   */
  static validateDriverScores(scores: RawDriverScores): void {
    const driverNames: (keyof RawDriverScores)[] = [
      'trust',
      'psych_safety',
      'comm_quality',
      'goal_clarity',
      'coordination',
      'tms',
      'team_cognition',
    ];

    for (const driverName of driverNames) {
      const score = scores[driverName];
      if (score === undefined || score === null) {
        throw new ValidationError(`Missing driver score: ${driverName}`, { driverName });
      }
      this.validateDriverScore(driverName, score);
    }
  }

  /**
   * Validate revenue (optional field)
   */
  static validateRevenue(revenue: number | undefined): void {
    if (revenue !== undefined && revenue !== null) {
      if (!Number.isFinite(revenue)) {
        throw new ValidationError('Revenue must be a finite number', { revenue });
      }
      if (revenue < 0) {
        throw new ValidationError('Revenue cannot be negative', { revenue });
      }
    }
  }

  /**
   * Validate industry name
   */
  static validateIndustry(industry: string): void {
    if (!industry || typeof industry !== 'string') {
      throw new ValidationError('Industry must be a non-empty string', { industry });
    }
    // Note: We don't validate against a specific list because we have a fallback to default
  }

  /**
   * Validate all inputs at once
   * Returns all validation errors instead of throwing on first error
   */
  static validateAll(input: {
    payroll: number;
    teamSize: number;
    driverScores: RawDriverScores;
    industry: string;
    revenue?: number;
  }): ValidationResult {
    const errors: ValidationError[] = [];

    try {
      this.validatePayroll(input.payroll);
    } catch (error) {
      if (error instanceof ValidationError) errors.push(error);
    }

    try {
      this.validateTeamSize(input.teamSize);
    } catch (error) {
      if (error instanceof ValidationError) errors.push(error);
    }

    try {
      this.validateDriverScores(input.driverScores);
    } catch (error) {
      if (error instanceof ValidationError) errors.push(error);
    }

    try {
      this.validateIndustry(input.industry);
    } catch (error) {
      if (error instanceof ValidationError) errors.push(error);
    }

    try {
      this.validateRevenue(input.revenue);
    } catch (error) {
      if (error instanceof ValidationError) errors.push(error);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
