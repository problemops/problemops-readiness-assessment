import jsPDF from 'jspdf';
import { generateTeamStory, DriverImpactNarrative } from './driverImpactContent';

type Driver = {
  id: string;
  name: string;
  description: string;
  weight: number;
  value: number;
};

type CompanyInfo = {
  name: string;
  website: string;
  team: string;
};

type FourCsAnalysis = {
  scores: {
    criteria: number;
    commitment: number;
    collaboration: number;
    change: number;
  };
  gaps: {
    criteria: number;
    commitment: number;
    collaboration: number;
    change: number;
  };
  target: number;
};

type TrainingModule = {
  title: string;
  description: string;
  exercises: string[];
  deliverables: string[];
  duration: string;
};

type TrainingPlan = {
  criteria: TrainingModule;
  commitment: TrainingModule;
  collaboration: TrainingModule;
  change: TrainingModule;
  priorities: string[];
};

type TrainingPriority = {
  area: string;
  reason: string;
  urgency: 'high' | 'medium' | 'low';
};

type AssessmentData = {
  drivers: Driver[];
  teamSize: number;
  avgSalary: number;
  interventionCost: number;
  readinessScore: number;
  dysfunctionCost: number;
  projectedSavings: number;
  roi: number;
  paybackMonths: number;
  companyInfo: CompanyInfo;
  assessmentAnswers: Record<number, number>;
  fourCsAnalysis?: FourCsAnalysis;
  trainingPlan?: TrainingPlan;
  trainingPriorities?: TrainingPriority[];
  recommendedDeliverables?: Record<string, string[]>;
  enhancedNarrative?: string;
  teamStory?: {
    narrative: string;
    driverImpacts: DriverImpactNarrative[];
    strengths: DriverImpactNarrative[];
    overallSeverity: string;
  };
  trainingType?: string;
  recommendedAreas?: Array<{id: string; name: string; score: number; weight: number; description: string}>;
};

const PAGE_WIDTH = 210; // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

export class SlidePDFGenerator {
  private doc: jsPDF;
  private data: AssessmentData;

  constructor(data: AssessmentData) {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    this.data = data;
  }

  private addPage() {
    this.doc.addPage();
  }

  private setTitle(text: string, y: number = 30) {
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(text, MARGIN, y);
  }

  private setSubtitle(text: string, y: number) {
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(text, MARGIN, y);
    this.doc.setTextColor(0, 0, 0);
  }

  private setBody(text: string, y: number, maxWidth: number = CONTENT_WIDTH) {
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    const lines = this.doc.splitTextToSize(text, maxWidth);
    this.doc.text(lines, MARGIN, y);
    return y + (lines.length * 6);
  }

  private setBullet(text: string, y: number, indent: number = 0) {
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    const bulletX = MARGIN + indent;
    const textX = bulletX + 5;
    this.doc.text('•', bulletX, y);
    const lines = this.doc.splitTextToSize(text, CONTENT_WIDTH - indent - 5);
    this.doc.text(lines, textX, y);
    return y + (lines.length * 6);
  }

  private addFooter(pageNumber: number) {
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(150, 150, 150);
    this.doc.text(
      `ProblemOps ROI Assessment | ${new Date().toLocaleDateString()}`,
      MARGIN,
      PAGE_HEIGHT - 10
    );
    this.doc.text(
      `Page ${pageNumber}`,
      PAGE_WIDTH - MARGIN - 15,
      PAGE_HEIGHT - 10
    );
    this.doc.setTextColor(0, 0, 0);
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }

  private formatPercent(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      maximumFractionDigits: 1,
    }).format(value);
  }

  // Page 1: Cover Page
  private generateCoverPage() {
    this.doc.setFillColor(37, 99, 235); // Primary blue
    this.doc.rect(0, 0, PAGE_WIDTH, 80, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(32);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Team Readiness', MARGIN, 35);
    this.doc.text('Assessment Report', MARGIN, 50);
    
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(this.data.companyInfo.name || 'Your Organization', MARGIN, 110);
    
    if (this.data.companyInfo.team) {
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(100, 100, 100);
      this.doc.text(this.data.companyInfo.team, MARGIN, 120);
    }
    
    // Readiness Score
    this.doc.setFontSize(48);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(37, 99, 235);
    this.doc.text(this.formatPercent(this.data.readinessScore), MARGIN, 160);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text('Team Readiness Score', MARGIN, 172);
    
    // Date
    this.doc.setFontSize(11);
    this.doc.text(`Assessment Date: ${new Date().toLocaleDateString()}`, MARGIN, PAGE_HEIGHT - 30);
    
    this.doc.setTextColor(0, 0, 0);
  }

  // Page 2: Company Overview
  private generateCompanyOverview() {
    this.addPage();
    this.setTitle('Company Overview');
    
    let y = 50;
    
    if (this.data.companyInfo.name) {
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Organization:', MARGIN, y);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(this.data.companyInfo.name, MARGIN + 35, y);
      y += 10;
    }
    
    if (this.data.companyInfo.website) {
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Website:', MARGIN, y);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(37, 99, 235);
      this.doc.text(this.data.companyInfo.website, MARGIN + 25, y);
      this.doc.setTextColor(0, 0, 0);
      y += 10;
    }
    
    if (this.data.companyInfo.team) {
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Team/Department:', MARGIN, y);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(this.data.companyInfo.team, MARGIN + 45, y);
      y += 10;
    }
    
    y += 10;
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Team Composition:', MARGIN, y);
    y += 8;
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    y = this.setBullet(`Team Size: ${this.data.teamSize} members`, y);
    y = this.setBullet(`Average Salary: ${this.formatCurrency(this.data.avgSalary)}`, y);
    y = this.setBullet(`Total Annual Payroll: ${this.formatCurrency(this.data.teamSize * this.data.avgSalary)}`, y);
    
    // Add training scope if available
    if (this.data.trainingType) {
      y += 10;
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Selected Training Scope:', MARGIN, y);
      y += 8;
      
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'normal');
      const trainingLabels: Record<string, string> = {
        'half-day': 'Half Day Workshop ($2,000)',
        'full-day': 'Full Day Workshop ($3,500)',
        'month-long': 'Month-Long Engagement ($30,000)',
        'not-sure': 'Exploring Options (PDF shows Month-Long option)'
      };
      const trainingLabel = trainingLabels[this.data.trainingType] || 'Not specified';
      y = this.setBullet(trainingLabel, y);
      
      if (this.data.recommendedAreas && this.data.recommendedAreas.length > 0 && this.data.trainingType !== 'not-sure') {
        const focusText = this.data.trainingType === 'month-long' 
          ? 'Focus: All 7 drivers in prioritized sequence'
          : `Focus: ${this.data.recommendedAreas.map(a => a.name).join(', ')}`;
        y = this.setBullet(focusText, y);
      }
    }
    
    y += 10;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Assessment Context', MARGIN, y);
    y += 8;
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    const contextText = `This assessment evaluates your team across 7 research-validated drivers of team effectiveness. The results provide actionable insights into areas of strength and opportunities for improvement, along with a financial analysis of the cost of team dysfunction and the potential ROI of targeted interventions.`;
    y = this.setBody(contextText, y);
    
    this.addFooter(2);
  }

  // Page 3: Executive Summary
  private generateExecutiveSummary() {
    this.addPage();
    this.setTitle('Executive Summary');
    this.setSubtitle('Financial Impact Analysis', 45);
    
    let y = 70;
    
    // Metrics boxes
    const boxHeight = 35;
    const boxSpacing = 10;
    
    // Cost of Dysfunction
    this.doc.setFillColor(239, 68, 68); // Red
    this.doc.setDrawColor(220, 38, 38);
    this.doc.roundedRect(MARGIN, y, CONTENT_WIDTH, boxHeight, 3, 3, 'FD');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('ANNUAL COST OF DYSFUNCTION', MARGIN + 5, y + 8);
    
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(this.formatCurrency(this.data.dysfunctionCost), MARGIN + 5, y + 20);
    
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Wasted payroll due to inefficiency', MARGIN + 5, y + 28);
    
    y += boxHeight + boxSpacing;
    
    // Projected Savings
    this.doc.setFillColor(37, 99, 235); // Blue
    this.doc.setDrawColor(29, 78, 216);
    this.doc.roundedRect(MARGIN, y, CONTENT_WIDTH, boxHeight, 3, 3, 'FD');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('PROJECTED ANNUAL SAVINGS', MARGIN + 5, y + 8);
    
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(this.formatCurrency(this.data.projectedSavings), MARGIN + 5, y + 20);
    
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('If improved to 85% readiness baseline', MARGIN + 5, y + 28);
    
    y += boxHeight + boxSpacing;
    
    // ROI
    this.doc.setFillColor(100, 100, 100); // Gray
    this.doc.setDrawColor(75, 75, 75);
    this.doc.roundedRect(MARGIN, y, (CONTENT_WIDTH / 2) - 5, boxHeight, 3, 3, 'FD');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('RETURN ON INVESTMENT', MARGIN + 5, y + 8);
    
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(this.formatPercent(this.data.roi), MARGIN + 5, y + 20);
    
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Payback in ${this.data.paybackMonths.toFixed(1)} months`, MARGIN + 5, y + 28);
    
    // Investment
    this.doc.roundedRect(MARGIN + (CONTENT_WIDTH / 2) + 5, y, (CONTENT_WIDTH / 2) - 5, boxHeight, 3, 3, 'FD');
    
    this.doc.setFontSize(10);
    this.doc.text('INTERVENTION INVESTMENT', MARGIN + (CONTENT_WIDTH / 2) + 10, y + 8);
    
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(this.formatCurrency(this.data.interventionCost), MARGIN + (CONTENT_WIDTH / 2) + 10, y + 20);
    
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Estimated cost of workshops/tools', MARGIN + (CONTENT_WIDTH / 2) + 10, y + 28);
    
    this.doc.setTextColor(0, 0, 0);
    this.addFooter(3);
  }

  // Page 4: Driver Performance Overview
  private generateDriverOverview() {
    this.addPage();
    this.setTitle('Driver Performance Overview');
    this.setSubtitle('7 Research-Validated Effectiveness Drivers', 45);
    
    let y = 70;
    const barWidth = CONTENT_WIDTH - 60;
    const barHeight = 20;
    const barSpacing = 8;
    
    this.data.drivers.forEach((driver) => {
      // Driver name
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(driver.name, MARGIN, y);
      
      // Score
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`${driver.value.toFixed(1)}/7`, MARGIN + barWidth + 5, y);
      
      y += 5;
      
      // Progress bar background
      this.doc.setFillColor(230, 230, 230);
      this.doc.roundedRect(MARGIN, y, barWidth, barHeight, 2, 2, 'F');
      
      // Progress bar fill
      const fillWidth = (driver.value / 7) * barWidth;
      const color = driver.value >= 5.5 ? [37, 99, 235] : driver.value >= 4 ? [234, 179, 8] : [239, 68, 68];
      this.doc.setFillColor(color[0], color[1], color[2]);
      this.doc.roundedRect(MARGIN, y, fillWidth, barHeight, 2, 2, 'F');
      
      y += barHeight + barSpacing;
    });
    
    this.addFooter(4);
  }

  // Pages 5-11: Individual Driver Pages
  private generateDriverPage(driver: Driver, pageNumber: number) {
    this.addPage();
    this.setTitle(driver.name);
    
    // Score badge
    const badgeSize = 40;
    const badgeX = PAGE_WIDTH - MARGIN - badgeSize;
    const badgeY = 20;
    
    const color = driver.value >= 5.5 ? [37, 99, 235] : driver.value >= 4 ? [234, 179, 8] : [239, 68, 68];
    this.doc.setFillColor(color[0], color[1], color[2]);
    this.doc.circle(badgeX + (badgeSize / 2), badgeY + (badgeSize / 2), badgeSize / 2, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(driver.value.toFixed(1), badgeX + (badgeSize / 2), badgeY + (badgeSize / 2) + 2, { align: 'center' });
    
    this.doc.setTextColor(0, 0, 0);
    
    let y = 50;
    
    // Description
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Definition:', MARGIN, y);
    y += 8;
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    y = this.setBody(driver.description, y);
    
    y += 10;
    
    // Assessment Insights
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Assessment Insights:', MARGIN, y);
    y += 8;
    
    const insights = this.generateDriverInsights(driver);
    insights.forEach(insight => {
      y = this.setBullet(insight, y);
      y += 2;
    });
    
    y += 10;
    
    // Impact
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Financial Impact:', MARGIN, y);
    y += 8;
    
    const totalMaxWeightedScore = this.data.drivers.reduce((sum, d) => sum + (7 * d.weight), 0);
    const weightedGap = (7 * driver.weight) - (driver.value * driver.weight);
    const dysfunctionShare = weightedGap / totalMaxWeightedScore;
    const costAmount = dysfunctionShare * (this.data.teamSize * this.data.avgSalary);
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    y = this.setBullet(`This driver contributes approximately ${this.formatCurrency(costAmount)} to your annual cost of dysfunction.`, y);
    y = this.setBullet(`Improving this score by 1 point could save roughly ${this.formatCurrency(costAmount / (7 - driver.value))} annually.`, y);
    
    this.addFooter(pageNumber);
  }

  private generateDriverInsights(driver: Driver): string[] {
    const score = driver.value;
    const insights: string[] = [];
    
    if (score >= 6) {
      insights.push(`Your team demonstrates strong ${driver.name.toLowerCase()} with a score of ${score.toFixed(1)}/7.`);
      insights.push('This is a significant strength that supports overall team effectiveness.');
      insights.push('Focus on maintaining this high performance while addressing lower-scoring areas.');
    } else if (score >= 5) {
      insights.push(`Your team shows good ${driver.name.toLowerCase()} with a score of ${score.toFixed(1)}/7.`);
      insights.push('There is room for improvement to reach optimal performance.');
      insights.push('Consider targeted interventions to strengthen this driver further.');
    } else if (score >= 4) {
      insights.push(`Your team has moderate ${driver.name.toLowerCase()} with a score of ${score.toFixed(1)}/7.`);
      insights.push('This represents a significant opportunity for improvement.');
      insights.push('Addressing this gap should be a priority in your action plan.');
    } else {
      insights.push(`Your team faces challenges with ${driver.name.toLowerCase()}, scoring ${score.toFixed(1)}/7.`);
      insights.push('This is a critical area requiring immediate attention.');
      insights.push('Improvement here will have substantial impact on team effectiveness and financial outcomes.');
    }
    
    return insights;
  }

  // Page 12: Team Narrative
  private generateTeamNarrative() {
    this.addPage();
    this.setTitle('Your Team\'s Current Story');
    this.setSubtitle('Understanding How Team Dynamics Impact Your Bottom Line', 45);
    
    let y = 70;
    
    // Overview narrative
    const narrative = this.data.teamStory?.narrative || this.generateNarrativeText();
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    const lines = this.doc.splitTextToSize(narrative, CONTENT_WIDTH);
    this.doc.text(lines, MARGIN, y);
    y += lines.length * 5 + 15;
    
    // Areas Causing Waste
    if (this.data.teamStory?.driverImpacts && this.data.teamStory.driverImpacts.length > 0) {
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(220, 38, 38); // Red
      this.doc.text('Where Your Team May Be Wasting Resources', MARGIN, y);
      this.doc.setTextColor(0, 0, 0);
      y += 10;
      
      for (const impact of this.data.teamStory.driverImpacts) {
        // Check if we need a new page
        if (y > PAGE_HEIGHT - 100) {
          this.addFooter(12);
          this.addPage();
          y = 30;
        }
        
        // Calculate driver cost
        const driver = this.data.drivers.find(d => d.id === impact.driverKey);
        const driverGap = driver ? (1 - (driver.value / 7)) : 0;
        const driverCost = driver ? (this.data.teamSize * this.data.avgSalary) * driver.weight * driverGap : 0;
        const gapPercent = Math.round(driverGap * 100);
        const impactWeight = driver ? Math.round(driver.weight * 100) : 0;
        
        // Driver name
        this.doc.setFontSize(14);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(impact.driverName, MARGIN, y);
        y += 7;
        
        // Severity badge and score
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'normal');
        const severityColor = impact.severityLevel === 'critical' ? [220, 38, 38] : 
                              impact.severityLevel === 'high' ? [234, 88, 12] : [202, 138, 4];
        this.doc.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
        this.doc.text(`${impact.severityLabel} | Score: ${impact.score.toFixed(1)}/7.0`, MARGIN, y);
        this.doc.setTextColor(0, 0, 0);
        y += 7;
        
        // Cost callout
        this.doc.setFontSize(16);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(234, 88, 12); // Orange
        const costText = `$${driverCost.toLocaleString('en-US', {maximumFractionDigits: 0})}`;
        this.doc.text(costText, MARGIN, y);
        this.doc.setTextColor(0, 0, 0);
        y += 6;
        
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(100, 100, 100);
        this.doc.text('Annual cost from this driver', MARGIN, y);
        y += 4;
        this.doc.text(`Gap: ${gapPercent}% • Impact weight: ${impactWeight}%`, MARGIN, y);
        this.doc.setTextColor(0, 0, 0);
        y += 7;
        
        // Summary statement
        this.doc.setFontSize(10);
        const summaryLines = this.doc.splitTextToSize(impact.summaryStatement, CONTENT_WIDTH);
        this.doc.text(summaryLines, MARGIN, y);
        y += summaryLines.length * 4 + 4;
        
        // Behavioral consequences
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('Team Behaviors:', MARGIN, y);
        y += 5;
        this.doc.setFont('helvetica', 'normal');
        for (const behavior of impact.behavioralConsequences.slice(0, 2)) {
          const behaviorLines = this.doc.splitTextToSize(`• ${behavior}`, CONTENT_WIDTH - 5);
          this.doc.text(behaviorLines, MARGIN + 3, y);
          y += behaviorLines.length * 4;
        }
        y += 4;
        
        // Waste outcomes
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text('Leads to Waste In:', MARGIN, y);
        y += 5;
        this.doc.setFont('helvetica', 'normal');
        const wasteText = impact.wasteOutcomes.map((w: any) => w.category).join(', ');
        const wasteLines = this.doc.splitTextToSize(wasteText, CONTENT_WIDTH);
        this.doc.text(wasteLines, MARGIN, y);
        y += wasteLines.length * 4 + 4;
        
        // Citation
        this.doc.setFontSize(8);
        this.doc.setTextColor(100, 100, 100);
        const citationText = `Research: ${impact.citation.finding} (${impact.citation.authors}, ${impact.citation.year})`;
        const citationLines = this.doc.splitTextToSize(citationText, CONTENT_WIDTH);
        this.doc.text(citationLines, MARGIN, y);
        this.doc.setTextColor(0, 0, 0);
        y += citationLines.length * 4 + 10;
      }
    }
    
    this.addFooter(12);
    
    // Add strengths on a new page if they exist
    if (this.data.teamStory?.strengths && this.data.teamStory.strengths.length > 0) {
      this.generateTeamStrengths();
    }
  }
  
  private generateTeamStrengths() {
    this.addPage();
    this.setTitle('Where Your Team Excels');
    this.setSubtitle('Drivers Contributing to Efficiency and Productivity', 45);
    
    let y = 70;
    
    for (const strength of this.data.teamStory!.strengths.slice(0, 4)) {
      // Check if we need a new page
      if (y > PAGE_HEIGHT - 70) {
        this.addFooter(13);
        this.addPage();
        y = 30;
      }
      
      // Driver name and score
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(22, 163, 74); // Green
      this.doc.text(`${strength.driverName} (Score: ${strength.score.toFixed(1)}/7.0)`, MARGIN, y);
      this.doc.setTextColor(0, 0, 0);
      y += 6;
      
      // Strength label
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(22, 163, 74);
      this.doc.text(`${strength.severityLabel}`, MARGIN, y);
      this.doc.setTextColor(0, 0, 0);
      y += 6;
      
      // Summary statement
      this.doc.setFontSize(10);
      const summaryLines = this.doc.splitTextToSize(strength.summaryStatement, CONTENT_WIDTH);
      this.doc.text(summaryLines, MARGIN, y);
      y += summaryLines.length * 4 + 4;
      
      // Positive behaviors
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Positive Team Behaviors:', MARGIN, y);
      y += 5;
      this.doc.setFont('helvetica', 'normal');
      for (const behavior of strength.behavioralConsequences.slice(0, 2)) {
        const behaviorLines = this.doc.splitTextToSize(`✓ ${behavior}`, CONTENT_WIDTH - 5);
        this.doc.text(behaviorLines, MARGIN + 3, y);
        y += behaviorLines.length * 4;
      }
      y += 4;
      
      // Efficiency gains
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Drives Efficiency In:', MARGIN, y);
      y += 5;
      this.doc.setFont('helvetica', 'normal');
      const efficiencyText = strength.wasteOutcomes.map((w: any) => w.category).join(', ');
      const efficiencyLines = this.doc.splitTextToSize(efficiencyText, CONTENT_WIDTH);
      this.doc.text(efficiencyLines, MARGIN, y);
      y += efficiencyLines.length * 4 + 4;
      
      // Citation
      this.doc.setFontSize(8);
      this.doc.setTextColor(100, 100, 100);
      const citationText = `Research: ${strength.citation.finding} (${strength.citation.authors}, ${strength.citation.year})`;
      const citationLines = this.doc.splitTextToSize(citationText, CONTENT_WIDTH);
      this.doc.text(citationLines, MARGIN, y);
      this.doc.setTextColor(0, 0, 0);
      y += citationLines.length * 4 + 10;
    }
    
    this.addFooter(13);
  }

  private generateNarrativeText(): string {
    // Use enhanced narrative if available
    if (this.data.enhancedNarrative) {
      return this.data.enhancedNarrative;
    }
    
    // Fallback to basic narrative
    const { drivers, readinessScore, companyInfo } = this.data;
    
    const strengths = drivers.filter(d => d.value >= 5.5).map(d => d.name);
    const opportunities = drivers.filter(d => d.value < 4.5).map(d => d.name);
    
    const companyContext = companyInfo.name ? `${companyInfo.name}${companyInfo.team ? `'s ${companyInfo.team}` : ''}` : 'Your team';
    
    let narrative = `${companyContext} demonstrates a readiness score of ${this.formatPercent(readinessScore)}, `;
    
    if (readinessScore >= 0.85) {
      narrative += 'indicating a highly effective team operating at peak performance. ';
    } else if (readinessScore >= 0.70) {
      narrative += 'suggesting a functional team with notable areas for optimization. ';
    } else if (readinessScore >= 0.50) {
      narrative += 'revealing significant dysfunction that is impacting team effectiveness and organizational outcomes. ';
    } else {
      narrative += 'indicating a critical state requiring immediate intervention to restore team functionality. ';
    }
    
    if (strengths.length > 0) {
      narrative += `The team shows particular strength in ${strengths.join(', ')}, which provides a solid foundation for improvement efforts. `;
    }
    
    if (opportunities.length > 0) {
      narrative += `However, challenges in ${opportunities.join(', ')} represent significant opportunities for growth. `;
    }
    
    narrative += `By addressing these gaps through targeted interventions based on the ProblemOps methodology, the team can unlock ${this.formatCurrency(this.data.projectedSavings)} in annual value while building a more cohesive, effective, and resilient working environment.`;
    
    return narrative;
  }

  // Pages 13-16: Training Plan
  private generateTrainingPlan() {
    const clusters = [
      {
        title: 'Foundation Cluster',
        subtitle: 'Building Trust & Psychological Safety',
        drivers: ['Trust', 'Psychological Safety'],
        description: 'These foundational drivers create the bedrock for all other team dynamics. Without trust and psychological safety, teams cannot engage in productive conflict, share knowledge openly, or coordinate effectively.',
        interventions: [
          'Conduct structured vulnerability exercises to build interpersonal trust',
          'Implement regular retrospectives with emphasis on learning over blame',
          'Create explicit norms around feedback and constructive disagreement',
          'Use ProblemOps Conversation frameworks to surface and resolve tensions',
          'Establish team working agreements that prioritize psychological safety'
        ]
      },
      {
        title: 'Knowledge Cluster',
        subtitle: 'Developing Transactive Memory & Team Cognition',
        drivers: ['Transactive Memory', 'Team Cognition'],
        description: 'These drivers enable teams to leverage distributed expertise and make better collective decisions. Knowing who knows what and how to think together as a unit are critical for complex problem-solving.',
        interventions: [
          'Map team expertise using skills matrices and knowledge directories',
          'Practice ProblemOps Shared Language exercises to align mental models',
          'Conduct collaborative problem-solving sessions with explicit thinking protocols',
          'Create documentation systems that capture decision rationale and context',
          'Run scenario planning exercises to build shared understanding of challenges'
        ]
      },
      {
        title: 'Execution Cluster',
        subtitle: 'Strengthening Coordination & Goal Clarity',
        drivers: ['Coordination', 'Goal Clarity'],
        description: 'These drivers ensure teams can translate strategy into action. Clear goals and smooth coordination are essential for efficient execution and avoiding wasted effort.',
        interventions: [
          'Establish clear OKRs with explicit success metrics and milestones',
          'Implement dependency mapping and workflow visualization practices',
          'Use ProblemOps Problem Framing to ensure shared understanding of objectives',
          'Create regular synchronization rituals to maintain alignment',
          'Develop escalation protocols for handling blockers and dependencies'
        ]
      },
      {
        title: 'Communication Cluster',
        subtitle: 'Enhancing Communication Quality',
        drivers: ['Communication Quality'],
        description: 'High-quality communication underpins all other drivers. It\'s not about frequency but about clarity, timeliness, and shared understanding.',
        interventions: [
          'Adopt structured communication protocols (e.g., SBAR, situation-complication-resolution)',
          'Practice active listening and paraphrasing techniques in meetings',
          'Use ProblemOps Conversation frameworks to improve dialogue quality',
          'Implement asynchronous communication best practices for distributed work',
          'Create communication charters that define expectations and norms'
        ]
      }
    ];
    
    clusters.forEach((cluster, index) => {
      this.addPage();
      this.setTitle(cluster.title);
      this.setSubtitle(cluster.subtitle, 45);
      
      let y = 65;
      
      // Relevant drivers
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Focus Areas:', MARGIN, y);
      y += 6;
      
      this.doc.setFont('helvetica', 'normal');
      cluster.drivers.forEach(driverName => {
        const driver = this.data.drivers.find(d => d.name === driverName);
        if (driver) {
          this.doc.text(`• ${driver.name}: ${driver.value.toFixed(1)}/7`, MARGIN + 5, y);
          y += 6;
        }
      });
      
      y += 8;
      
      // Description
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'normal');
      y = this.setBody(cluster.description, y);
      
      y += 10;
      
      // Recommended Interventions
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Recommended Interventions:', MARGIN, y);
      y += 8;
      
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'normal');
      cluster.interventions.forEach(intervention => {
        y = this.setBullet(intervention, y);
        y += 3;
      });
      
      this.addFooter(13 + index);
    });
  }

  // Page 17: Next Steps
  private generateNextSteps() {
    this.addPage();
    this.setTitle('Next Steps');
    this.setSubtitle('Your Path Forward', 45);
    
    let y = 70;
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Immediate Actions:', MARGIN, y);
    y += 10;
    
    const actions = [
      'Share this report with team leadership and key stakeholders',
      'Prioritize interventions based on the lowest-scoring drivers with highest financial impact',
      'Schedule a team workshop to discuss findings and co-create an action plan',
      'Establish baseline metrics to track improvement over time',
      'Consider engaging a ProblemOps facilitator for guided implementation'
    ];
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    actions.forEach((action, index) => {
      y = this.setBullet(`${index + 1}. ${action}`, y);
      y += 4;
    });
    
    y += 15;
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Learn More:', MARGIN, y);
    y += 10;
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    y = this.setBullet('Visit problemops.com for articles, case studies, and resources', y);
    y = this.setBullet('Explore the ProblemOps Lessons series for practical frameworks', y);
    y = this.setBullet('Contact us to discuss customized training and facilitation', y);
    
    y += 20;
    
    // Contact box
    this.doc.setFillColor(245, 245, 245);
    this.doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 40, 3, 3, 'F');
    
    y += 10;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Contact Information', MARGIN + 5, y);
    
    y += 8;
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Website: problemops.com', MARGIN + 5, y);
    
    y += 6;
    this.doc.text('For questions about this assessment or to schedule a consultation,', MARGIN + 5, y);
    
    y += 6;
    this.doc.text('visit our website or reach out through the contact form.', MARGIN + 5, y);
    
    this.addFooter(17);
  }

  // Page: 4 C's Framework Analysis
  private generateFourCsPage() {
    if (!this.data.fourCsAnalysis) return;
    
    this.addPage();
    this.setTitle('The 4 C\'s of ProblemOps');
    this.setSubtitle('Criteria, Commitment, Collaboration, Change', 45);
    
    let y = 70;
    
    const { scores, gaps, target } = this.data.fourCsAnalysis;
    const targetPercent = target * 100;
    
    // Intro text
    const intro = 'The ProblemOps framework organizes team effectiveness into four interconnected capabilities. Your scores in each area reveal where your team excels and where focused improvement will yield the greatest impact.';
    y = this.setBody(intro, y) + 10;
    
    // 4 C's scores
    const fourCs = [
      { name: 'Criteria', score: scores.criteria, gap: gaps.criteria, desc: 'Clear problem definition and shared language' },
      { name: 'Commitment', score: scores.commitment, gap: gaps.commitment, desc: 'Aligned goals and strategic clarity' },
      { name: 'Collaboration', score: scores.collaboration, gap: gaps.collaboration, desc: 'Trust, safety, and knowledge sharing' },
      { name: 'Change', score: scores.change, gap: gaps.change, desc: 'Adaptive coordination and execution' }
    ];
    
    fourCs.forEach((c) => {
      const scorePercent = c.score * 100;
      const gapPercent = c.gap * 100;
      
      // C name and score
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(c.name, MARGIN, y);
      
      this.doc.setFontSize(16);
      this.doc.setTextColor(37, 99, 235);
      this.doc.text(`${scorePercent.toFixed(0)}%`, MARGIN + 50, y);
      this.doc.setTextColor(0, 0, 0);
      
      y += 6;
      
      // Description
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(100, 100, 100);
      this.doc.text(c.desc, MARGIN, y);
      this.doc.setTextColor(0, 0, 0);
      
      y += 6;
      
      // Progress bar
      const barWidth = CONTENT_WIDTH - 60;
      const barHeight = 8;
      
      // Background
      this.doc.setFillColor(240, 240, 240);
      this.doc.roundedRect(MARGIN, y, barWidth, barHeight, 2, 2, 'F');
      
      // Fill
      const fillWidth = (scorePercent / 100) * barWidth;
      const color = scorePercent >= targetPercent ? [34, 197, 94] : scorePercent >= 70 ? [251, 191, 36] : [239, 68, 68];
      this.doc.setFillColor(color[0], color[1], color[2]);
      this.doc.roundedRect(MARGIN, y, fillWidth, barHeight, 2, 2, 'F');
      
      // Target line
      const targetX = MARGIN + (targetPercent / 100) * barWidth;
      this.doc.setDrawColor(100, 100, 100);
      this.doc.setLineWidth(0.5);
      this.doc.line(targetX, y - 2, targetX, y + barHeight + 2);
      
      // Gap text
      this.doc.setFontSize(9);
      this.doc.setTextColor(100, 100, 100);
      this.doc.text(`Gap to target: ${gapPercent.toFixed(0)}%`, MARGIN + barWidth + 5, y + 5);
      this.doc.setTextColor(0, 0, 0);
      
      y += barHeight + 15;
    });
    
    this.addFooter(4);
  }
  
  // Page: ProblemOps Principles
  private generateProblemOpsPrinciples() {
    this.addPage();
    this.setTitle('ProblemOps Principles');
    this.setSubtitle('A framework for continuous team improvement', 45);
    
    let y = 70;
    
    const principles = [
      {
        title: '1. Shared Language Creates Shared Understanding',
        text: 'Teams that develop common vocabulary and mental models can communicate more efficiently and make better collective decisions.'
      },
      {
        title: '2. Problems Are Opportunities for Alignment',
        text: 'Every challenge is a chance to clarify goals, surface assumptions, and build stronger team agreements.'
      },
      {
        title: '3. Process Follows People',
        text: 'Effective systems emerge from understanding how people actually work, not from imposing rigid frameworks.'
      },
      {
        title: '4. Continuous Learning Over Perfect Planning',
        text: 'Teams improve through rapid experimentation and reflection, not exhaustive upfront analysis.'
      },
      {
        title: '5. Transparency Builds Trust',
        text: 'Making work visible and sharing context openly creates psychological safety and enables better coordination.'
      }
    ];
    
    principles.forEach((p) => {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(p.title, MARGIN, y);
      y += 8;
      
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'normal');
      const lines = this.doc.splitTextToSize(p.text, CONTENT_WIDTH);
      this.doc.text(lines, MARGIN, y);
      y += (lines.length * 6) + 10;
    });
    
    this.addFooter(13);
  }

  public generate(): jsPDF {
    this.generateCoverPage();
    this.generateCompanyOverview();
    this.generateExecutiveSummary();
    this.generateFourCsPage();
    this.generateDriverOverview();
    
    // Individual driver pages
    this.data.drivers.forEach((driver, index) => {
      this.generateDriverPage(driver, 6 + index);
    });
    
    this.generateTeamNarrative();
    this.generateProblemOpsPrinciples();
    this.generateTrainingPlan();
    this.generateNextSteps();
    
    return this.doc;
  }

  public download(filename: string = 'team-readiness-assessment.pdf') {
    this.generate();
    this.doc.save(filename);
  }
}
