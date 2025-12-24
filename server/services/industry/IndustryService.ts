/**
 * Industry Service
 * Manages industry-specific configurations and logic
 */

import { IndustryConfig } from '../../domain/models/DysfunctionCostModels';
import { IIndustryService } from '../../domain/interfaces/ICalculationService';
import { INDUSTRY_CONFIGS, DEFAULT_INDUSTRY } from '../../shared/constants/DysfunctionCostConstants';

export class IndustryService implements IIndustryService {
  private readonly industryRegistry: Map<string, IndustryConfig>;
  private readonly defaultIndustry: IndustryConfig;

  constructor() {
    // Initialize industry registry
    this.industryRegistry = new Map();
    
    Object.values(INDUSTRY_CONFIGS).forEach(config => {
      const industryConfig = new IndustryConfig(config.name, config.phi, config.rho);
      this.industryRegistry.set(config.name, industryConfig);
    });

    // Set default industry
    const defaultConfig = INDUSTRY_CONFIGS.MANUFACTURING;
    this.defaultIndustry = new IndustryConfig(
      defaultConfig.name,
      defaultConfig.phi,
      defaultConfig.rho
    );
  }

  /**
   * Get industry configuration by name
   * Returns default if not found
   */
  getIndustryConfig(industry: string): IndustryConfig {
    return this.industryRegistry.get(industry) || this.defaultIndustry;
  }

  /**
   * Get all available industries
   */
  getAllIndustries(): IndustryConfig[] {
    return Array.from(this.industryRegistry.values());
  }

  /**
   * Get default industry
   */
  getDefaultIndustry(): IndustryConfig {
    return this.defaultIndustry;
  }

  /**
   * Check if industry exists
   */
  hasIndustry(industry: string): boolean {
    return this.industryRegistry.has(industry);
  }

  /**
   * Get industry names
   */
  getIndustryNames(): string[] {
    return Array.from(this.industryRegistry.keys());
  }
}
