/**
 * Slide Deck Generator for Assessment Results
 * Generates a professional presentation from assessment data
 */

export interface SlideGenerationData {
  // Company Information
  companyInfo: {
    name: string;
    website?: string;
    teamName?: string;
  };
  
  // Assessment Scores
  drivers: Array<{
    id: string;
    name: string;
    value: number;
    weight: number;
    description: string;
  }>;
  
  readinessScore: number;
  
  // Financial Data
  teamSize: number;
  avgSalary: number;
  dysfunctionCost: number;
  
  // ROI Data
  roiData: {
    cost: number;
    savings: number;
    roi: number;
    paybackMonths: number;
  };
  
  // Analysis
  fourCsAnalysis: {
    cohesion: number;
    communication: number;
    coordination: number;
    cognition: number;
  };
  
  // Training Information
  trainingType: string;
  recommendedAreas: Array<{
    driver: string;
    priority: string;
    gap: number;
  }>;
  
  // Assessment ID for PDF link
  assessmentId: string;
}

export interface SlideOutline {
  id: string;
  page_title: string;
  summary: string;
}

/**
 * Generate slide deck outline from assessment data
 */
export function generateSlideOutline(data: SlideGenerationData): SlideOutline[] {
  const slides: SlideOutline[] = [];
  
  // Slide 1: Title Slide
  slides.push({
    id: 'title',
    page_title: 'Team Cross-Functional Efficiency Readiness Assessment Results',
    summary: `Assessment results for ${data.companyInfo.name}. Includes company information, assessment date, and a prominent "Get the PDF" button linking to the downloadable report.`
  });
  
  // Slide 2: Executive Summary
  const roiPercent = Math.round(data.roiData.roi * 100);
  slides.push({
    id: 'executive_summary',
    page_title: `Your Team's ${Math.round(data.readinessScore * 100)}% Readiness Score Reveals Significant Opportunity`,
    summary: `Key metrics: Overall readiness ${Math.round(data.readinessScore * 100)}%, annual dysfunction cost $${Math.round(data.dysfunctionCost/1000)}K, potential savings $${Math.round(data.roiData.savings/1000)}K, ROI ${roiPercent}%, payback ${data.roiData.paybackMonths} months. Large readiness gauge visualization.`
  });
  
  // Slide 3: Assessment Framework
  slides.push({
    id: 'framework',
    page_title: 'Comprehensive Evaluation Across 7 Critical Team Effectiveness Drivers',
    summary: "Evidence-based assessment framework covering Trust, Psychological Safety, Transactive Memory, Communication Quality, Goal Clarity, Coordination, and Team Cognition. Visual icon grid showing all 7 drivers."
  });
  
  // Slide 4: 4Cs Analysis
  slides.push({
    id: 'four_cs',
    page_title: "Your Team's Performance Across Four Critical Dimensions",
    summary: `4Cs scores: Cohesion ${Math.round(data.fourCsAnalysis.cohesion * 100)}%, Communication ${Math.round(data.fourCsAnalysis.communication * 100)}%, Coordination ${Math.round(data.fourCsAnalysis.coordination * 100)}%, Cognition ${Math.round(data.fourCsAnalysis.cognition * 100)}%. Radar chart comparing actual vs 85% target.`
  });
  
  // Slide 5: Driver Scores
  slides.push({
    id: 'driver_scores',
    page_title: 'Detailed Performance Analysis Identifies Specific Improvement Areas',
    summary: "Horizontal bar chart showing all 7 driver scores with 85% target line. Each driver shows current score, percentage, and gap from target."
  });
  
  // Slide 6: Priority Areas
  const highPriority = data.recommendedAreas.filter(a => a.priority === 'HIGH');
  slides.push({
    id: 'priority_areas',
    page_title: `${highPriority.length} High-Priority Areas Demand Immediate Attention`,
    summary: "Priority matrix showing HIGH, MEDIUM, and LOW priority drivers based on gap from target. High priority areas highlighted with impact descriptions."
  });
  
  // Slide 7: Cost of Dysfunction
  const annualCost = data.teamSize * data.avgSalary;
  slides.push({
    id: 'dysfunction_cost',
    page_title: `Team Inefficiency Currently Costs $${Math.round(data.dysfunctionCost/1000)}K Annually`,
    summary: `Team of ${data.teamSize} people, average salary $${Math.round(data.avgSalary/1000)}K, annual cost $${Math.round(annualCost/1000)}K, dysfunction ${Math.round((1-data.readinessScore)*100)}%, annual waste $${Math.round(data.dysfunctionCost/1000)}K. Waterfall chart showing cost breakdown.`
  });
  
  // Slide 8: ROI Analysis
  slides.push({
    id: 'roi_analysis',
    page_title: `Recommended Training Delivers ${Math.round(data.roiData.roi)}x Return on Investment`,
    summary: `Training investment $${Math.round(data.roiData.cost/1000)}K, projected savings $${Math.round(data.roiData.savings/1000)}K, ROI ${roiPercent}%, payback ${data.roiData.paybackMonths} months. ROI visualization showing investment vs savings over time.`
  });
  
  // Slide 9: Training Recommendation
  const trainingName = getTrainingTypeName(data.trainingType);
  slides.push({
    id: 'training_recommendation',
    page_title: `${trainingName}: Targeted Training for Maximum Impact`,
    summary: `Recommended training option: ${trainingName}. Details on focus areas, duration, investment, and expected outcomes. Clear value proposition.`
  });
  
  // Slide 10: Recommended Focus Areas
  slides.push({
    id: 'focus_areas',
    page_title: 'Targeted Training Will Address Your Most Critical Gaps',
    summary: "Detailed breakdown of recommended focus areas based on training type. For each driver: current score, target score, key improvement areas, expected outcomes. Before/after comparison bars."
  });
  
  // Slide 11: Implementation Roadmap
  slides.push({
    id: 'roadmap',
    page_title: 'Clear Path to Measurable Team Performance Improvement',
    summary: "3-phase implementation: Phase 1 - Training Delivery, Phase 2 - Practice & Integration (2-4 weeks), Phase 3 - Measurement (Month 3). Timeline visualization with milestones."
  });
  
  // Slide 12: Next Steps
  slides.push({
    id: 'next_steps',
    page_title: "Take Action to Transform Your Team's Effectiveness",
    summary: "Clear call-to-action: 1) Review findings with leadership, 2) Select training option, 3) Schedule kickoff, 4) Measure results. Contact information and ProblemOps branding."
  });
  
  return slides;
}

function getTrainingTypeName(type: string): string {
  const names: Record<string, string> = {
    "not-sure": "Explore All Options",
    "half-day": "Half Day Workshop",
    "full-day": "Full Day Workshop",
    "month-long": "Month-Long Engagement"
  };
  return names[type] || "Custom Training";
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format percentage for display
 */
export function formatPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Get slide generation API endpoint
 */
export function getSlideGenerationEndpoint(): string {
  return '/api/generate-slides';
}
