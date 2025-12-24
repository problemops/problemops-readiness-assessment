/**
 * Assessment Entity
 * Core domain model representing a team readiness assessment
 */

export interface AssessmentId {
  value: string;
}

export interface CompanyInfo {
  name: string;
  email?: string;
  website?: string;
  team?: string;
}

export interface TeamMetrics {
  size: number;
  avgSalary: number;
}

export type TrainingType = 'half-day' | 'full-day' | 'month-long' | 'not-sure';

export interface DriverScoresMap {
  trust: number;
  psych_safety: number;
  comm_quality: number;
  goal_clarity: number;
  coordination: number;
  tms: number;
  team_cognition: number;
}

export interface AssessmentResults {
  readinessScore: number;
  dysfunctionCost: number;
}

export interface IndustryDetection {
  industry: string;
  confidence: number;
}

/**
 * Assessment aggregate root
 */
export class Assessment {
  constructor(
    public readonly id: AssessmentId,
    public readonly companyInfo: CompanyInfo,
    public readonly teamMetrics: TeamMetrics,
    public readonly trainingType: TrainingType,
    public readonly driverScores: DriverScoresMap,
    public readonly answers: Record<string, number>,
    public readonly results: AssessmentResults,
    public readonly industryDetection: IndustryDetection,
    public readonly createdAt: Date,
    public readonly priorityMatrixData?: any,
    public readonly roiData?: any
  ) {}

  /**
   * Factory method to create new assessment
   */
  static create(
    id: string,
    companyInfo: CompanyInfo,
    teamMetrics: TeamMetrics,
    trainingType: TrainingType,
    driverScores: DriverScoresMap,
    answers: Record<string, number>,
    results: AssessmentResults,
    industryDetection: IndustryDetection,
    priorityMatrixData?: any,
    roiData?: any
  ): Assessment {
    return new Assessment(
      { value: id },
      companyInfo,
      teamMetrics,
      trainingType,
      driverScores,
      answers,
      results,
      industryDetection,
      new Date(),
      priorityMatrixData,
      roiData
    );
  }

  /**
   * Reconstruct from database
   */
  static fromPersistence(data: {
    id: string;
    companyInfo: CompanyInfo;
    teamMetrics: TeamMetrics;
    trainingType: TrainingType;
    driverScores: DriverScoresMap;
    answers: Record<string, number>;
    results: AssessmentResults;
    industryDetection: IndustryDetection;
    createdAt: Date;
    priorityMatrixData?: any;
    roiData?: any;
  }): Assessment {
    return new Assessment(
      { value: data.id },
      data.companyInfo,
      data.teamMetrics,
      data.trainingType,
      data.driverScores,
      data.answers,
      data.results,
      data.industryDetection,
      data.createdAt,
      data.priorityMatrixData,
      data.roiData
    );
  }

  /**
   * Get total payroll
   */
  getTotalPayroll(): number {
    return this.teamMetrics.size * this.teamMetrics.avgSalary;
  }

  /**
   * Check if email was provided
   */
  hasEmail(): boolean {
    return !!this.companyInfo.email;
  }

  /**
   * Check if website was provided
   */
  hasWebsite(): boolean {
    return !!this.companyInfo.website;
  }
}
