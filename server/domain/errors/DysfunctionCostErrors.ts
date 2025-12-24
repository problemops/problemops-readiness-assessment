/**
 * Domain-specific error classes for Dysfunction Cost calculations
 * Follows enterprise error handling patterns with error codes and context
 */

export abstract class DysfunctionCostError extends Error {
  abstract readonly code: string;
  readonly timestamp: Date;
  readonly context?: Record<string, unknown>;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
    };
  }
}

export class ValidationError extends DysfunctionCostError {
  readonly code: string = 'VALIDATION_ERROR';

  constructor(message: string, context?: Record<string, unknown>) {
    super(message, context);
  }
}

export class InvalidTeamSizeError extends ValidationError {
  override readonly code = 'INVALID_TEAM_SIZE' as const;

  constructor(teamSize: number) {
    super(`Team size must be at least 1, got: ${teamSize}`, { teamSize });
  }
}

export class InvalidPayrollError extends ValidationError {
  override readonly code = 'INVALID_PAYROLL' as const;

  constructor(payroll: number) {
    super(`Payroll must be greater than 0, got: ${payroll}`, { payroll });
  }
}

export class InvalidDriverScoreError extends ValidationError {
  override readonly code = 'INVALID_DRIVER_SCORE' as const;

  constructor(driverName: string, score: number) {
    super(
      `Driver score for "${driverName}" must be between 1 and 7, got: ${score}`,
      { driverName, score }
    );
  }
}

export class CalculationError extends DysfunctionCostError {
  readonly code: string = 'CALCULATION_ERROR';

  constructor(message: string, context?: Record<string, unknown>) {
    super(message, context);
  }
}

export class IndustryNotFoundError extends DysfunctionCostError {
  readonly code: string = 'INDUSTRY_NOT_FOUND';

  constructor(industry: string) {
    super(`Industry "${industry}" not found in configuration`, { industry });
  }
}
