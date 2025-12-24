/**
 * Validation Service
 * Centralizes all input validation logic
 */

import { IValidationService, CalculationInput } from '../../domain/interfaces/ICalculationService';
import { DysfunctionCostValidator } from '../../domain/validators/DysfunctionCostValidator';

export class ValidationService implements IValidationService {
  /**
   * Validate calculation input (throws on first error)
   */
  validate(input: CalculationInput): void {
    DysfunctionCostValidator.validatePayroll(input.payroll);
    DysfunctionCostValidator.validateTeamSize(input.teamSize);
    DysfunctionCostValidator.validateDriverScores(input.driverScores);
    DysfunctionCostValidator.validateIndustry(input.industry);
    DysfunctionCostValidator.validateRevenue(input.revenue);
  }

  /**
   * Validate and return all errors (doesn't throw)
   */
  validateAll(input: CalculationInput): { isValid: boolean; errors: Error[] } {
    const result = DysfunctionCostValidator.validateAll(input);
    return {
      isValid: result.isValid,
      errors: result.errors,
    };
  }
}
