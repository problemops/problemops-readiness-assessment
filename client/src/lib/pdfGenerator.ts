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
  urgency: 'high' | 'medium' | 'low' | 'critical';
};

type ROIData = {
  cost: number;
  savings: number;
  roi: number;
  paybackMonths: number;
};

type TrainingOption = {
  id: string;
  name: string;
  cost: number;
  description: string;
};

type TCDCostComponents = {
  productivity: number;
  rework: number;
  turnover: number;
  opportunity: number;
  overhead: number;
  disengagement: number;
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
  otherDeliverables?: Record<string, string[]>;
  enhancedNarrative?: string;
  teamStory?: {
    narrative: string;
    driverImpacts: DriverImpactNarrative[];
    strengths: DriverImpactNarrative[];
    overallSeverity: string;
  };
  trainingType?: string;
  trainingOption?: TrainingOption;
  recommendedAreas?: Array<{id: string; name: string; score: number; weight: number; description: string}>;
  priorityAreas?: Array<{id: string; name: string; score: number; weight: number}>;
  roiData?: {
    halfDay: ROIData;
    fullDay: ROIData;
    monthLong: ROIData;
  };
  tcdCostComponents?: TCDCostComponents;
  driverCosts?: Record<string, number>;
  detectedIndustry?: string;
};

const PAGE_WIDTH = 210; // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

// ProblemOps brand color
const PRIMARY_COLOR = [100, 86, 58]; // #64563A

export class SlidePDFGenerator {
  private doc: jsPDF;
  private data: AssessmentData;
  private pageNumber: number = 0;

  constructor(data: AssessmentData) {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    this.data = data;
  }

  private addPage() {
    if (this.pageNumber > 0) {
      this.doc.addPage();
    }
    this.pageNumber++;
  }

  private setPageTitle(text: string, y: number = 30) {
    this.doc.setFontSize(28);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    this.doc.text(text, MARGIN, y);
    this.doc.setTextColor(0, 0, 0);
    return y + 15;
  }

  private setSubtitle(text: string, y: number) {
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(text, MARGIN, y);
    this.doc.setTextColor(0, 0, 0);
    return y + 10;
  }

  private setBody(text: string, y: number, maxWidth: number = CONTENT_WIDTH) {
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(50, 50, 50);
    const lines = this.doc.splitTextToSize(text, maxWidth);
    this.doc.text(lines, MARGIN, y);
    this.doc.setTextColor(0, 0, 0);
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

  private addFooter() {
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(150, 150, 150);
    this.doc.text(
      `ProblemOps Institute | problemops.com`,
      MARGIN,
      PAGE_HEIGHT - 10
    );
    this.doc.text(
      `Page ${this.pageNumber}`,
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

  // Page 1: Title Page
  private generateTitlePage() {
    this.addPage();
    
    // Company Name - Large and prominent
    this.doc.setFontSize(36);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    const companyName = this.data.companyInfo.name || 'Team Readiness Assessment';
    this.doc.text(companyName, PAGE_WIDTH / 2, 80, { align: 'center' });
    
    if (this.data.companyInfo.team) {
      this.doc.setFontSize(18);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(100, 100, 100);
      this.doc.text(this.data.companyInfo.team, PAGE_WIDTH / 2, 95, { align: 'center' });
    }
    
    // Report generated by ProblemOps Institute
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(80, 80, 80);
    this.doc.text('Report generated by ProblemOps Institute', PAGE_WIDTH / 2, 130, { align: 'center' });
    
    // Date
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    this.doc.text(today, PAGE_WIDTH / 2, 145, { align: 'center' });
    
    // Website
    this.doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    this.doc.text('https://problemops.com', PAGE_WIDTH / 2, 160, { align: 'center' });
    
    // Founder info
    this.doc.setTextColor(60, 60, 60);
    this.doc.setFontSize(12);
    this.doc.text('Morgan Denner, Founder and Head Trainer', PAGE_WIDTH / 2, 200, { align: 'center' });
    this.doc.text('mdenner@problemops.com', PAGE_WIDTH / 2, 212, { align: 'center' });
    
    this.doc.setTextColor(0, 0, 0);
  }

  // Page 2: Introduction
  private generateIntroductionPage() {
    this.addPage();
    let y = this.setPageTitle('Executive Summary');
    
    y = this.setSubtitle(`${this.data.companyInfo.name || 'Your organization'}${this.data.companyInfo.team ? ` - ${this.data.companyInfo.team}` : ''}`, y);
    y += 10;
    
    const introText = `${this.data.companyInfo.name || 'Your organization'}, thank you for completing the ProblemOps Team Readiness Assessment. Your results reveal how your team performs across seven research-validated drivers of effectiveness—from trust and psychological safety to coordination and shared cognition. These insights translate directly into financial impact, showing you both the current cost of team dysfunction and the potential savings from targeted improvement. Most importantly, this report provides a concrete action plan based on the ProblemOps framework, with specific exercises, deliverables, and training priorities tailored to your team's unique needs. Use these results to build the business case for investment in team development and to guide your improvement journey.`;
    
    y = this.setBody(introText, y);
    
    this.addFooter();
  }

  // Page 3: Key Metrics
  private generateKeyMetricsPage() {
    this.addPage();
    let y = this.setPageTitle("Your Team's Current Story");
    
    // Training Type Indicator
    if (this.data.trainingType && this.data.trainingType !== 'not-sure' && this.data.trainingOption) {
      y += 5;
      this.doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
      this.doc.setDrawColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
      this.doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 25, 3, 3, 'S');
      
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Selected Training Scope', MARGIN + 5, y + 10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(11);
      this.doc.text(this.data.trainingOption.name, MARGIN + 5, y + 18);
      y += 35;
    }
    
    // Two-column metrics
    const boxWidth = (CONTENT_WIDTH - 10) / 2;
    const boxHeight = 50;
    
    // Annual Cost of Dysfunction
    this.doc.setFillColor(254, 242, 242);
    this.doc.setDrawColor(239, 68, 68);
    this.doc.roundedRect(MARGIN, y, boxWidth, boxHeight, 3, 3, 'FD');
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text('Annual Cost of Dysfunction', MARGIN + 5, y + 12);
    
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(220, 38, 38);
    this.doc.text(this.formatCurrency(this.data.dysfunctionCost), MARGIN + 5, y + 30);
    
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text('Wasted payroll due to team inefficiency', MARGIN + 5, y + 42);
    
    // Team Readiness Score
    this.doc.setFillColor(239, 246, 255);
    this.doc.setDrawColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    this.doc.roundedRect(MARGIN + boxWidth + 10, y, boxWidth, boxHeight, 3, 3, 'FD');
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text('Team Readiness Score', MARGIN + boxWidth + 15, y + 12);
    
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    this.doc.text(this.formatPercent(this.data.readinessScore), MARGIN + boxWidth + 15, y + 30);
    
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text('Overall effectiveness across all 7 drivers', MARGIN + boxWidth + 15, y + 42);
    
    this.doc.setTextColor(0, 0, 0);
    
    this.addFooter();
  }

  // Page 4: ROI / Training Options
  private generateROIPage() {
    this.addPage();
    
    if (this.data.trainingType === 'not-sure' && this.data.roiData) {
      // Comparison table for "I'm Not Sure Yet"
      let y = this.setPageTitle('Training Options Comparison');
      y = this.setSubtitle('Compare the ROI and scope of each training option', y);
      y += 10;
      
      const { halfDay, fullDay, monthLong } = this.data.roiData;
      const priorityAreas = this.data.priorityAreas || [];
      
      // Table header
      const colWidths = [45, 25, 40, 30, 20, 20];
      const headers = ['Option', 'Investment', 'Focus Areas', 'ROI If Fixed', 'Return Rate', 'Payback'];
      
      this.doc.setFillColor(245, 245, 245);
      this.doc.rect(MARGIN, y, CONTENT_WIDTH, 10, 'F');
      
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'bold');
      let x = MARGIN + 2;
      headers.forEach((header, i) => {
        this.doc.text(header, x, y + 7);
        x += colWidths[i];
      });
      y += 12;
      
      // Table rows
      const options = [
        {
          name: 'Half Day Workshop',
          desc: 'Quick-start intervention',
          investment: this.formatCurrency(halfDay.cost),
          focus: `Top priority: ${priorityAreas[0]?.name || 'N/A'}`,
          savings: this.formatCurrency(halfDay.savings),
          roi: this.formatPercent(halfDay.roi),
          payback: `${halfDay.paybackMonths.toFixed(1)} mo`,
          highlight: false
        },
        {
          name: 'Full Day Workshop',
          desc: 'Focused deep-dive',
          investment: this.formatCurrency(fullDay.cost),
          focus: `Top 2: ${priorityAreas.slice(0, 2).map(a => a.name).join(', ')}`,
          savings: this.formatCurrency(fullDay.savings),
          roi: this.formatPercent(fullDay.roi),
          payback: `${fullDay.paybackMonths.toFixed(1)} mo`,
          highlight: false
        },
        {
          name: 'Month-Long Engagement',
          desc: 'Comprehensive transformation',
          investment: this.formatCurrency(monthLong.cost),
          focus: 'All 7 drivers',
          savings: this.formatCurrency(monthLong.savings),
          roi: this.formatPercent(monthLong.roi),
          payback: `${monthLong.paybackMonths.toFixed(1)} mo`,
          highlight: true
        }
      ];
      
      this.doc.setFont('helvetica', 'normal');
      options.forEach((opt) => {
        if (opt.highlight) {
          this.doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
          this.doc.setDrawColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
          this.doc.rect(MARGIN, y - 2, CONTENT_WIDTH, 22, 'S');
        }
        
        x = MARGIN + 2;
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(opt.name, x, y + 5);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(7);
        this.doc.text(opt.desc, x, y + 11);
        x += colWidths[0];
        
        this.doc.setFontSize(9);
        this.doc.text(opt.investment, x, y + 8);
        x += colWidths[1];
        
        const focusLines = this.doc.splitTextToSize(opt.focus, colWidths[2] - 2);
        this.doc.setFontSize(8);
        this.doc.text(focusLines, x, y + 5);
        x += colWidths[2];
        
        this.doc.setFontSize(9);
        this.doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
        this.doc.text(opt.savings, x, y + 8);
        x += colWidths[3];
        
        this.doc.setTextColor(22, 163, 74);
        this.doc.text(opt.roi, x, y + 8);
        x += colWidths[4];
        
        this.doc.setTextColor(0, 0, 0);
        this.doc.text(opt.payback, x, y + 8);
        
        y += 24;
      });
      
      // Recommendation note
      y += 10;
      this.doc.setFillColor(255, 251, 235);
      this.doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 30, 3, 3, 'F');
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Recommendation:', MARGIN + 5, y + 10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(9);
      const recText = 'The Month-Long Engagement offers the best long-term value by addressing all drivers systematically. However, if budget is a constraint, starting with a Full Day Workshop on your top 2 priorities can deliver meaningful improvements.';
      const recLines = this.doc.splitTextToSize(recText, CONTENT_WIDTH - 10);
      this.doc.text(recLines, MARGIN + 5, y + 18);
      
    } else {
      // Single ROI display for specific training type
      let y = this.setPageTitle('Return on Investment');
      
      const displayROI = this.data.trainingType === 'half-day' ? this.data.roiData?.halfDay :
                         this.data.trainingType === 'full-day' ? this.data.roiData?.fullDay :
                         this.data.roiData?.monthLong;
      
      if (displayROI) {
        y += 10;
        
        // Three metric boxes
        const boxWidth = (CONTENT_WIDTH - 20) / 3;
        const boxHeight = 60;
        
        // Projected Annual Savings
        this.doc.setFillColor(239, 246, 255);
        this.doc.setDrawColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
        this.doc.roundedRect(MARGIN, y, boxWidth, boxHeight, 3, 3, 'FD');
        
        this.doc.setFontSize(10);
        this.doc.setTextColor(100, 100, 100);
        this.doc.text('Projected Annual Savings', MARGIN + 5, y + 15);
        
        this.doc.setFontSize(20);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
        this.doc.text(this.formatCurrency(displayROI.savings), MARGIN + 5, y + 35);
        
        this.doc.setFontSize(8);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(100, 100, 100);
        this.doc.text(`From ${this.data.trainingOption?.name?.toLowerCase() || 'training'}`, MARGIN + 5, y + 48);
        
        // Return on Investment
        this.doc.setFillColor(240, 253, 244);
        this.doc.setDrawColor(22, 163, 74);
        this.doc.roundedRect(MARGIN + boxWidth + 10, y, boxWidth, boxHeight, 3, 3, 'FD');
        
        this.doc.setFontSize(10);
        this.doc.setTextColor(100, 100, 100);
        this.doc.text('Return on Investment', MARGIN + boxWidth + 15, y + 15);
        
        this.doc.setFontSize(20);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(22, 163, 74);
        this.doc.text(this.formatPercent(displayROI.roi), MARGIN + boxWidth + 15, y + 35);
        
        this.doc.setFontSize(8);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(100, 100, 100);
        this.doc.text(`Investment: ${this.formatCurrency(displayROI.cost)}`, MARGIN + boxWidth + 15, y + 48);
        
        // Payback Period
        this.doc.setFillColor(255, 251, 235);
        this.doc.setDrawColor(217, 119, 6);
        this.doc.roundedRect(MARGIN + (boxWidth + 10) * 2, y, boxWidth, boxHeight, 3, 3, 'FD');
        
        this.doc.setFontSize(10);
        this.doc.setTextColor(100, 100, 100);
        this.doc.text('Payback Period', MARGIN + (boxWidth + 10) * 2 + 5, y + 15);
        
        this.doc.setFontSize(20);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(217, 119, 6);
        this.doc.text(displayROI.paybackMonths.toFixed(1), MARGIN + (boxWidth + 10) * 2 + 5, y + 35);
        
        this.doc.setFontSize(8);
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(100, 100, 100);
        this.doc.text('months to recover investment', MARGIN + (boxWidth + 10) * 2 + 5, y + 48);
      }
    }
    
    this.doc.setTextColor(0, 0, 0);
    this.addFooter();
  }

  // Page 5: Team Narrative
  private generateTeamNarrativePage() {
    this.addPage();
    let y = this.setPageTitle("Your Team's Story");
    y += 5;
    
    const narrative = this.data.teamStory?.narrative || this.data.enhancedNarrative || '';
    if (narrative) {
      // Clean up markdown bold syntax
      const cleanNarrative = narrative.replace(/\*\*(.*?)\*\*/g, '$1');
      y = this.setBody(cleanNarrative, y);
    }
    
    this.addFooter();
  }

  // Page 6: Where Your Team May Be Wasting Resources
  private generateWasteAreasPage() {
    if (!this.data.teamStory?.driverImpacts || this.data.teamStory.driverImpacts.length === 0) return;
    
    this.addPage();
    let y = this.setPageTitle('Where Your Team May Be Wasting Resources');
    y = this.setSubtitle('Based on your scores, these drivers are contributing to lost productivity', y);
    y += 5;
    
    // Show driver cost breakdown summary
    this.doc.setFillColor(245, 245, 245);
    this.doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 25, 3, 3, 'F');
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Total Cost of Dysfunction:', MARGIN + 5, y + 10);
    this.doc.setTextColor(220, 38, 38);
    this.doc.text(this.formatCurrency(this.data.dysfunctionCost), MARGIN + 60, y + 10);
    this.doc.setTextColor(0, 0, 0);
    
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Driver Cost = Total Dysfunction Cost × Driver Weight', MARGIN + 5, y + 20);
    y += 35;
    
    // List driver impacts (top 4 to fit on page)
    for (const impact of this.data.teamStory.driverImpacts.slice(0, 4)) {
      const driver = this.data.drivers.find(d => d.id === impact.driverKey);
      const driverCost = this.data.driverCosts?.[impact.dbKey] || this.data.driverCosts?.[impact.driverKey] || 0;
      
      // Severity color
      const severityColor = impact.severityLevel === 'critical' ? [220, 38, 38] : 
                            impact.severityLevel === 'high' ? [234, 88, 12] : 
                            impact.severityLevel === 'low' ? [202, 138, 4] : [22, 163, 74];
      
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(impact.driverName, MARGIN, y);
      
      // Severity badge
      this.doc.setFontSize(8);
      this.doc.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
      this.doc.text(`${impact.severityLabel} | Score: ${impact.score.toFixed(1)}/7.0`, MARGIN + 60, y);
      this.doc.setTextColor(0, 0, 0);
      y += 6;
      
      // Cost
      this.doc.setFontSize(14);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(234, 88, 12);
      this.doc.text(this.formatCurrency(driverCost), MARGIN, y);
      this.doc.setTextColor(0, 0, 0);
      
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(' annual cost from this driver', MARGIN + 35, y);
      y += 8;
      
      // Summary
      this.doc.setFontSize(9);
      const summaryLines = this.doc.splitTextToSize(impact.summaryStatement, CONTENT_WIDTH);
      this.doc.text(summaryLines.slice(0, 2), MARGIN, y);
      y += Math.min(summaryLines.length, 2) * 4 + 10;
      
      if (y > PAGE_HEIGHT - 50) break;
    }
    
    this.addFooter();
  }

  // Page 7: Where Your Team Excels
  private generateStrengthsPage() {
    if (!this.data.teamStory?.strengths || this.data.teamStory.strengths.length === 0) return;
    
    this.addPage();
    let y = this.setPageTitle('Where Your Team Excels');
    y = this.setSubtitle('These high-scoring drivers contribute to your team\'s efficiency', y);
    y += 10;
    
    for (const strength of this.data.teamStory.strengths.slice(0, 4)) {
      this.doc.setFillColor(240, 253, 244);
      this.doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 35, 3, 3, 'F');
      
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(22, 163, 74);
      this.doc.text(`${strength.driverName} (${strength.score.toFixed(1)}/7.0)`, MARGIN + 5, y + 10);
      
      this.doc.setFontSize(8);
      this.doc.text(strength.severityLabel, MARGIN + 5, y + 18);
      this.doc.setTextColor(0, 0, 0);
      
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      const summaryLines = this.doc.splitTextToSize(strength.summaryStatement, CONTENT_WIDTH - 10);
      this.doc.text(summaryLines.slice(0, 2), MARGIN + 5, y + 26);
      
      y += 42;
      
      if (y > PAGE_HEIGHT - 60) break;
    }
    
    this.addFooter();
  }

  // Page 8: Understanding Your Cost of Dysfunction
  private generateCostBreakdownPage() {
    this.addPage();
    let y = this.setPageTitle('Understanding Your Cost of Dysfunction');
    y += 5;
    
    // Step 1: Starting Point
    this.doc.setFillColor(245, 245, 245);
    this.doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 35, 3, 3, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('1. Your Starting Point', MARGIN + 5, y + 10);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Team Size: ${this.data.teamSize} people`, MARGIN + 5, y + 20);
    this.doc.text(`Average Salary: ${this.formatCurrency(this.data.avgSalary)}`, MARGIN + 80, y + 20);
    this.doc.text(`Total Annual Payroll: ${this.formatCurrency(this.data.teamSize * this.data.avgSalary)}`, MARGIN + 5, y + 30);
    y += 45;
    
    // Step 2: 6 Types of Waste
    this.doc.setFillColor(245, 245, 245);
    this.doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 70, 3, 3, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('2. We Measure 6 Types of Waste', MARGIN + 5, y + 10);
    
    const components = this.data.tcdCostComponents || {
      productivity: 0, rework: 0, turnover: 0, opportunity: 0, overhead: 0, disengagement: 0
    };
    
    const costItems = [
      { label: 'C1 Lost Productivity', value: components.productivity },
      { label: 'C2 Rework Costs', value: components.rework },
      { label: 'C3 Turnover Costs', value: components.turnover },
      { label: 'C4 Missed Opportunities', value: components.opportunity },
      { label: 'C5 Extra Overhead', value: components.overhead },
      { label: 'C6 Disengagement', value: components.disengagement }
    ];
    
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    let itemY = y + 20;
    const colWidth = (CONTENT_WIDTH - 10) / 2;
    
    costItems.forEach((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const itemX = MARGIN + 5 + (col * colWidth);
      const itemYPos = itemY + (row * 15);
      
      this.doc.text(item.label, itemX, itemYPos);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(this.formatCurrency(item.value), itemX + 55, itemYPos);
      this.doc.setFont('helvetica', 'normal');
    });
    y += 80;
    
    // Step 3: Final Result
    this.doc.setFillColor(254, 242, 242);
    this.doc.setDrawColor(220, 38, 38);
    this.doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 30, 3, 3, 'FD');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Your Total Annual Cost of Dysfunction', MARGIN + 5, y + 12);
    
    this.doc.setFontSize(20);
    this.doc.setTextColor(220, 38, 38);
    this.doc.text(this.formatCurrency(this.data.dysfunctionCost), MARGIN + 5, y + 25);
    this.doc.setTextColor(0, 0, 0);
    
    this.addFooter();
  }

  // Page 9: Training Focus Areas (conditional)
  private generateTrainingFocusPage() {
    if (this.data.trainingType === 'not-sure' || !this.data.recommendedAreas || this.data.recommendedAreas.length === 0) return;
    
    this.addPage();
    let y = this.setPageTitle('Your Training Focus Areas');
    y = this.setSubtitle(`Based on your selection of ${this.data.trainingOption?.name || 'training'}`, y);
    y += 10;
    
    for (let index = 0; index < this.data.recommendedAreas.length; index++) {
      const area = this.data.recommendedAreas[index];
      this.doc.setFillColor(245, 245, 245);
      this.doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 40, 3, 3, 'F');
      
      // Priority number
      this.doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
      this.doc.circle(MARGIN + 12, y + 15, 8, 'F');
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${index + 1}`, MARGIN + 10, y + 18);
      this.doc.setTextColor(0, 0, 0);
      
      // Area name and score
      this.doc.setFontSize(14);
      this.doc.text(area.name, MARGIN + 25, y + 12);
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(`Score: ${area.score.toFixed(1)}/7.0 (${Math.round((area.score / 7) * 100)}%)`, MARGIN + 25, y + 22);
      
      // Impact weight
      this.doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
      this.doc.text(`Impact Weight: ${Math.round(area.weight * 100)}%`, MARGIN + 120, y + 12);
      this.doc.setTextColor(0, 0, 0);
      
      // Description
      this.doc.setFontSize(9);
      const descLines = this.doc.splitTextToSize(area.description, CONTENT_WIDTH - 30);
      this.doc.text(descLines.slice(0, 2), MARGIN + 25, y + 32);
      
      y += 48;
      
      if (y > PAGE_HEIGHT - 60) break;
    }
    
    this.addFooter();
  }

  // Page 10: Driver Performance Summary
  private generateDriverSummaryPage() {
    this.addPage();
    let y = this.setPageTitle('Driver Performance Summary');
    y = this.setSubtitle('7 Research-Validated Effectiveness Drivers', y);
    y += 10;
    
    const barWidth = CONTENT_WIDTH - 50;
    const barHeight = 12;
    
    for (const driver of this.data.drivers) {
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
      const color = driver.value >= 5.5 ? [22, 163, 74] : driver.value >= 4 ? [234, 179, 8] : [239, 68, 68];
      this.doc.setFillColor(color[0], color[1], color[2]);
      this.doc.roundedRect(MARGIN, y, fillWidth, barHeight, 2, 2, 'F');
      
      y += barHeight + 12;
    }
    
    this.addFooter();
  }

  // Page 11: 4 C's Framework
  private generateFourCsPage() {
    if (!this.data.fourCsAnalysis) return;
    
    this.addPage();
    let y = this.setPageTitle("The 4 C's Framework");
    y = this.setSubtitle('Criteria, Commitment, Collaboration, Change', y);
    y += 10;
    
    const { scores, gaps, target } = this.data.fourCsAnalysis;
    const targetPercent = target * 100;
    
    const fourCs = [
      { name: 'Criteria', score: scores.criteria, gap: gaps.criteria, desc: 'Clear problem definition and shared language' },
      { name: 'Commitment', score: scores.commitment, gap: gaps.commitment, desc: 'Aligned goals and strategic clarity' },
      { name: 'Collaboration', score: scores.collaboration, gap: gaps.collaboration, desc: 'Trust, safety, and knowledge sharing' },
      { name: 'Change', score: scores.change, gap: gaps.change, desc: 'Adaptive coordination and execution' }
    ];
    
    const barWidth = CONTENT_WIDTH - 60;
    
    for (const c of fourCs) {
      const scorePercent = c.score * 100;
      const gapPercent = c.gap * 100;
      
      // C name and score
      this.doc.setFontSize(16);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(c.name, MARGIN, y);
      
      this.doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
      this.doc.text(`${scorePercent.toFixed(0)}%`, MARGIN + 50, y);
      this.doc.setTextColor(0, 0, 0);
      
      y += 6;
      
      // Description
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(100, 100, 100);
      this.doc.text(c.desc, MARGIN, y);
      this.doc.setTextColor(0, 0, 0);
      
      y += 8;
      
      // Progress bar
      this.doc.setFillColor(240, 240, 240);
      this.doc.roundedRect(MARGIN, y, barWidth, 10, 2, 2, 'F');
      
      const fillWidth = (scorePercent / 100) * barWidth;
      const color = scorePercent >= targetPercent ? [22, 163, 74] : scorePercent >= 70 ? [251, 191, 36] : [239, 68, 68];
      this.doc.setFillColor(color[0], color[1], color[2]);
      this.doc.roundedRect(MARGIN, y, fillWidth, 10, 2, 2, 'F');
      
      // Target line
      const targetX = MARGIN + (targetPercent / 100) * barWidth;
      this.doc.setDrawColor(100, 100, 100);
      this.doc.setLineWidth(0.5);
      this.doc.line(targetX, y - 2, targetX, y + 12);
      
      // Gap text
      this.doc.setFontSize(9);
      this.doc.setTextColor(100, 100, 100);
      this.doc.text(`Gap: ${gapPercent.toFixed(0)}%`, MARGIN + barWidth + 5, y + 7);
      this.doc.setTextColor(0, 0, 0);
      
      y += 25;
    }
    
    this.addFooter();
  }

  // Page 12: ProblemOps Principles
  private generatePrinciplesPage() {
    this.addPage();
    let y = this.setPageTitle('ProblemOps Principles');
    y = this.setSubtitle('A framework for continuous team improvement', y);
    y += 10;
    
    const principles = [
      { title: '1. Shared Language Creates Shared Understanding', text: 'Teams that develop common vocabulary and mental models can communicate more efficiently and make better collective decisions.' },
      { title: '2. Problems Are Opportunities for Alignment', text: 'Every challenge is a chance to clarify goals, surface assumptions, and build stronger team agreements.' },
      { title: '3. Process Follows People', text: 'Effective systems emerge from understanding how people actually work, not from imposing rigid frameworks.' },
      { title: '4. Continuous Learning Over Perfect Planning', text: 'Teams improve through rapid experimentation and reflection, not exhaustive upfront analysis.' },
      { title: '5. Transparency Builds Trust', text: 'Making work visible and sharing context openly creates psychological safety and enables better coordination.' }
    ];
    
    for (const p of principles) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(p.title, MARGIN, y);
      y += 8;
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      const lines = this.doc.splitTextToSize(p.text, CONTENT_WIDTH);
      this.doc.text(lines, MARGIN, y);
      y += (lines.length * 5) + 12;
    }
    
    this.addFooter();
  }

  // Page 13: Training Plan
  private generateTrainingPlanPage() {
    this.addPage();
    let y = this.setPageTitle('Your ProblemOps Training Plan');
    
    // Priority Focus Areas
    if (this.data.trainingPriorities && this.data.trainingPriorities.length > 0) {
      y += 5;
      this.doc.setFillColor(255, 251, 235);
      this.doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 60, 3, 3, 'F');
      
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Priority Focus Areas', MARGIN + 5, y + 12);
      
      let priorityY = y + 22;
      this.doc.setFontSize(9);
      
      for (const priority of this.data.trainingPriorities.slice(0, 4)) {
        const urgencyColor = priority.urgency === 'critical' ? [220, 38, 38] :
                             priority.urgency === 'high' ? [234, 88, 12] :
                             priority.urgency === 'medium' ? [202, 138, 4] : [22, 163, 74];
        
        this.doc.setTextColor(urgencyColor[0], urgencyColor[1], urgencyColor[2]);
        this.doc.setFont('helvetica', 'bold');
        const urgencyLabel = priority.urgency === 'critical' ? 'CRITICAL' : priority.urgency.toUpperCase();
        this.doc.text(urgencyLabel, MARGIN + 5, priorityY);
        
        this.doc.setTextColor(0, 0, 0);
        this.doc.setFont('helvetica', 'normal');
        this.doc.text(`${priority.area}: ${priority.reason}`, MARGIN + 30, priorityY);
        
        priorityY += 10;
      }
      
      y += 70;
    }
    
    // Training modules summary
    if (this.data.trainingPlan) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Training Modules', MARGIN, y);
      y += 10;
      
      const modules = ['criteria', 'commitment', 'collaboration', 'change'] as const;
      
      for (const key of modules) {
        const module = this.data.trainingPlan[key];
        if (!module) continue;
        
        this.doc.setFontSize(11);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(module.title, MARGIN, y);
        
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'normal');
        this.doc.text(`Duration: ${module.duration}`, MARGIN + 100, y);
        y += 6;
        
        const descLines = this.doc.splitTextToSize(module.description, CONTENT_WIDTH);
        this.doc.text(descLines.slice(0, 1), MARGIN, y);
        y += 12;
        
        if (y > PAGE_HEIGHT - 40) break;
      }
    }
    
    this.addFooter();
  }

  // Page 14: Recommended Deliverables
  private generateDeliverablesPage() {
    if (!this.data.recommendedDeliverables || Object.keys(this.data.recommendedDeliverables).length === 0) return;
    
    this.addPage();
    let y = this.setPageTitle('Recommended ProblemOps Deliverables');
    y = this.setSubtitle('Specific artifacts your team should focus on creating', y);
    y += 10;
    
    for (const [category, deliverables] of Object.entries(this.data.recommendedDeliverables)) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(category, MARGIN, y);
      y += 8;
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      
      for (const deliverable of (deliverables as string[]).slice(0, 4)) {
        this.doc.text(`• ${deliverable}`, MARGIN + 5, y);
        y += 6;
      }
      
      y += 8;
      
      if (y > PAGE_HEIGHT - 50) break;
    }
    
    this.addFooter();
  }

  // Page 15: Other Deliverables (if applicable)
  private generateOtherDeliverablesPage() {
    if (!this.data.otherDeliverables || Object.keys(this.data.otherDeliverables).length === 0) return;
    
    this.addPage();
    let y = this.setPageTitle('Additional ProblemOps Deliverables');
    y = this.setSubtitle('Other deliverables for continuous improvement', y);
    y += 10;
    
    for (const [category, deliverables] of Object.entries(this.data.otherDeliverables)) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(category, MARGIN, y);
      y += 8;
      
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      
      for (const deliverable of (deliverables as string[]).slice(0, 3)) {
        this.doc.text(`• ${deliverable}`, MARGIN + 5, y);
        y += 6;
      }
      
      y += 8;
      
      if (y > PAGE_HEIGHT - 50) break;
    }
    
    this.addFooter();
  }

  // Page 16: Next Steps
  private generateNextStepsPage() {
    this.addPage();
    let y = this.setPageTitle('Next Steps');
    y = this.setSubtitle('Your Path Forward', y);
    y += 10;
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Immediate Actions', MARGIN, y);
    y += 10;
    
    const actions = [
      'Download and share this report with team leadership and key stakeholders',
      'Prioritize interventions based on the lowest-scoring drivers with highest financial impact',
      'Schedule a team workshop to discuss findings and co-create an action plan',
      'Establish baseline metrics to track improvement over time'
    ];
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    
    for (let index = 0; index < actions.length; index++) {
      const action = actions[index];
      y = this.setBullet(`${index + 1}. ${action}`, y);
      y += 4;
    }
    
    y += 15;
    
    // Learn More section
    this.doc.setFillColor(245, 245, 245);
    this.doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 50, 3, 3, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Learn More About ProblemOps', MARGIN + 5, y + 12);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Visit problemops.com for articles, case studies, and practical frameworks', MARGIN + 5, y + 24);
    this.doc.text('to build shared language and understanding within your team.', MARGIN + 5, y + 34);
    
    y += 60;
    
    // Contact box
    this.doc.setFillColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
    this.doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 40, 3, 3, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Ready to Get Started?', MARGIN + 5, y + 12);
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Contact Morgan Denner, Founder and Head Trainer', MARGIN + 5, y + 24);
    this.doc.text('mdenner@problemops.com | problemops.com', MARGIN + 5, y + 34);
    
    this.doc.setTextColor(0, 0, 0);
    
    this.addFooter();
  }

  public generate(): jsPDF {
    // Page 1: Title Page
    this.generateTitlePage();
    
    // Page 2: Introduction
    this.generateIntroductionPage();
    
    // Page 3: Key Metrics
    this.generateKeyMetricsPage();
    
    // Page 4: ROI / Training Options
    this.generateROIPage();
    
    // Page 5: Team Narrative
    this.generateTeamNarrativePage();
    
    // Page 6: Where Your Team May Be Wasting Resources
    this.generateWasteAreasPage();
    
    // Page 7: Where Your Team Excels
    this.generateStrengthsPage();
    
    // Page 8: Understanding Your Cost of Dysfunction
    this.generateCostBreakdownPage();
    
    // Page 9: Training Focus Areas (conditional)
    this.generateTrainingFocusPage();
    
    // Page 10: Driver Performance Summary
    this.generateDriverSummaryPage();
    
    // Page 11: 4 C's Framework
    this.generateFourCsPage();
    
    // Page 12: ProblemOps Principles
    this.generatePrinciplesPage();
    
    // Page 13: Training Plan
    this.generateTrainingPlanPage();
    
    // Page 14: Recommended Deliverables
    this.generateDeliverablesPage();
    
    // Page 15: Other Deliverables
    this.generateOtherDeliverablesPage();
    
    // Page 16: Next Steps
    this.generateNextStepsPage();
    
    return this.doc;
  }

  public download(filename: string = 'team-readiness-assessment.pdf') {
    this.generate();
    this.doc.save(filename);
  }
}
