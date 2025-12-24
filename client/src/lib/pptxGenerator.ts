/**
 * PowerPoint Generator for Assessment Results
 * Generates a professional PPTX presentation from assessment data
 */

import pptxgen from "pptxgenjs";

// ProblemOps Brand Colors
const COLORS = {
  primary: "2563EB", // Professional blue
  secondary: "F59E0B", // Warm gold
  success: "10B981", // Green
  danger: "EF4444", // Red
  background: "FFFFFF",
  text: "1F2937",
  textLight: "6B7280",
  accent: "8B5CF6" // Purple accent
};

export interface PPTXGenerationData {
  companyInfo: {
    name: string;
    website?: string;
    teamName?: string;
  };
  drivers: Array<{
    id: string;
    name: string;
    value: number;
    weight: number;
    description: string;
  }>;
  readinessScore: number;
  teamSize: number;
  avgSalary: number;
  dysfunctionCost: number;
  roiData: {
    cost: number;
    savings: number;
    roi: number;
    paybackMonths: number;
  };
  fourCsAnalysis: {
    cohesion: number;
    communication: number;
    coordination: number;
    cognition: number;
  };
  trainingType: string;
  trainingOption: {
    label: string;
  };
  recommendedAreas: Array<{
    name: string;
    score: number;
    weight: number;
    description: string;
    priority: string;
  }>;
  priorityAreas: Array<{
    id: string;
    name: string;
    score: number;
  }>;
  assessmentId: string;
}

/**
 * Generate PowerPoint presentation from assessment data
 */
export function generatePowerPoint(data: PPTXGenerationData): pptxgen {
  const pptx = new pptxgen();
  
  // Set presentation properties
  pptx.author = "ProblemOps";
  pptx.company = "ProblemOps";
  pptx.subject = "Team Readiness Assessment Results";
  pptx.title = `${data.companyInfo.name} - Team Readiness Assessment`;
  
  // Define master slide layout
  pptx.layout = "LAYOUT_WIDE";
  
  // Slide 1: Title Slide
  addTitleSlide(pptx, data);
  
  // Slide 2: Executive Summary
  addExecutiveSummary(pptx, data);
  
  // Slide 3: Assessment Framework
  addFrameworkSlide(pptx, data);
  
  // Slide 4: 4Cs Analysis
  add4CsSlide(pptx, data);
  
  // Slide 5: Driver Scores
  addDriverScoresSlide(pptx, data);
  
  // Slide 6: Priority Areas
  addPriorityAreasSlide(pptx, data);
  
  // Slide 7: Cost of Dysfunction
  addCostSlide(pptx, data);
  
  // Slide 8: ROI Analysis
  addROISlide(pptx, data);
  
  // Slide 9: Training Recommendation
  addTrainingSlide(pptx, data);
  
  // Slide 10: Recommended Focus Areas
  addFocusAreasSlide(pptx, data);
  
  // Slide 11: Implementation Roadmap
  addRoadmapSlide(pptx, data);
  
  // Slide 12: Next Steps
  addNextStepsSlide(pptx, data);
  
  return pptx;
}

/**
 * Slide 1: Title Slide
 */
function addTitleSlide(pptx: pptxgen, data: PPTXGenerationData) {
  const slide = pptx.addSlide();
  
  // Background
  slide.background = { color: COLORS.primary };
  
  // Main Title
  slide.addText("Team Cross-Functional Efficiency\\nReadiness Assessment Results", {
    x: 0.5,
    y: 2.0,
    w: 12,
    h: 1.5,
    fontSize: 44,
    bold: true,
    color: COLORS.background,
    align: "center"
  });
  
  // Company Name
  slide.addText(data.companyInfo.name, {
    x: 0.5,
    y: 3.8,
    w: 12,
    h: 0.6,
    fontSize: 32,
    color: COLORS.secondary,
    align: "center"
  });
  
  // Date
  const date = new Date().toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });
  slide.addText(date, {
    x: 0.5,
    y: 4.6,
    w: 12,
    h: 0.4,
    fontSize: 18,
    color: COLORS.background,
    align: "center"
  });
  
  // ProblemOps branding
  slide.addText("Powered by ProblemOps", {
    x: 0.5,
    y: 6.8,
    w: 12,
    h: 0.3,
    fontSize: 14,
    color: COLORS.background,
    align: "center",
    italic: true
  });
  
  // PDF Link note
  slide.addText("📄 Download the detailed PDF report for complete analysis", {
    x: 0.5,
    y: 5.2,
    w: 12,
    h: 0.4,
    fontSize: 16,
    color: COLORS.background,
    align: "center"
  });
}

/**
 * Slide 2: Executive Summary
 */
function addExecutiveSummary(pptx: pptxgen, data: PPTXGenerationData) {
  const slide = pptx.addSlide();
  
  // Title
  addSlideTitle(slide, `Your Team's ${Math.round(data.readinessScore * 100)}% Readiness Score Reveals Significant Opportunity`);
  
  // Key Metrics Grid
  const metrics = [
    { label: "Overall Readiness", value: `${Math.round(data.readinessScore * 100)}%`, color: COLORS.primary },
    { label: "Annual Dysfunction Cost", value: formatCurrency(data.dysfunctionCost), color: COLORS.danger },
    { label: "Potential Annual Savings", value: formatCurrency(data.roiData.savings), color: COLORS.success },
    { label: "Training Investment", value: formatCurrency(data.roiData.cost), color: COLORS.secondary },
    { label: "Return on Investment", value: `${Math.round(data.roiData.roi * 100)}%`, color: COLORS.success },
    { label: "Payback Period", value: `${data.roiData.paybackMonths.toFixed(1)} months`, color: COLORS.accent }
  ];
  
  let yPos = 1.8;
  let xPos = 1.0;
  
  metrics.forEach((metric, index) => {
    // Create metric card
    slide.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: yPos,
      w: 3.5,
      h: 1.2,
      fill: { color: "F3F4F6" }
    });
    
    slide.addText(metric.label, {
      x: xPos + 0.2,
      y: yPos + 0.2,
      w: 3.1,
      h: 0.4,
      fontSize: 14,
      color: COLORS.textLight
    });
    
    slide.addText(metric.value, {
      x: xPos + 0.2,
      y: yPos + 0.6,
      w: 3.1,
      h: 0.5,
      fontSize: 28,
      bold: true,
      color: metric.color
    });
    
    xPos += 3.8;
    if ((index + 1) % 3 === 0) {
      xPos = 1.0;
      yPos += 1.5;
    }
  });
}

/**
 * Slide 3: Assessment Framework
 */
function addFrameworkSlide(pptx: pptxgen, data: PPTXGenerationData) {
  const slide = pptx.addSlide();
  
  addSlideTitle(slide, "Comprehensive Evaluation Across 7 Critical Team Effectiveness Drivers");
  
  // Framework description
  slide.addText("Evidence-based assessment methodology evaluating:", {
    x: 1.0,
    y: 1.8,
    w: 11,
    h: 0.4,
    fontSize: 16,
    color: COLORS.text
  });
  
  // 7 Drivers list
  const drivers = [
    "Trust - Foundation of team relationships",
    "Psychological Safety - Freedom to take risks",
    "Transactive Memory Systems - Shared knowledge",
    "Communication Quality - Clear information flow",
    "Goal Clarity - Aligned objectives",
    "Coordination - Efficient collaboration",
    "Team Cognition - Shared mental models"
  ];
  
  let yPos = 2.4;
  drivers.forEach((driver, index) => {
    slide.addShape(pptx.ShapeType.rect, {
      x: 1.5,
      y: yPos,
      w: 10,
      h: 0.6,
      fill: { color: index % 2 === 0 ? "F3F4F6" : COLORS.background }
    });
    
    slide.addText(`${index + 1}. ${driver}`, {
      x: 2.0,
      y: yPos + 0.1,
      w: 9,
      h: 0.4,
      fontSize: 14,
      color: COLORS.text
    });
    
    yPos += 0.65;
  });
}

/**
 * Slide 4: 4Cs Analysis
 */
function add4CsSlide(pptx: pptxgen, data: PPTXGenerationData) {
  const slide = pptx.addSlide();
  
  addSlideTitle(slide, "Your Team's Performance Across Four Critical Dimensions");
  
  const fourCs = [
    { name: "Cohesion", value: data.fourCsAnalysis.cohesion, desc: "Trust + Psychological Safety" },
    { name: "Communication", value: data.fourCsAnalysis.communication, desc: "Information flow + Shared knowledge" },
    { name: "Coordination", value: data.fourCsAnalysis.coordination, desc: "Goal alignment + Process efficiency" },
    { name: "Cognition", value: data.fourCsAnalysis.cognition, desc: "Shared mental models + Strategic thinking" }
  ];
  
  let yPos = 2.0;
  fourCs.forEach((c) => {
    const percentage = Math.round(c.value * 100);
    const target = 85;
    const color = percentage >= target ? COLORS.success : percentage >= 70 ? COLORS.secondary : COLORS.danger;
    
    // C name and description
    slide.addText(c.name, {
      x: 1.0,
      y: yPos,
      w: 3.0,
      h: 0.4,
      fontSize: 18,
      bold: true,
      color: COLORS.text
    });
    
    slide.addText(c.desc, {
      x: 1.0,
      y: yPos + 0.4,
      w: 3.0,
      h: 0.3,
      fontSize: 12,
      color: COLORS.textLight
    });
    
    // Progress bar background
    slide.addShape(pptx.ShapeType.rect, {
      x: 4.5,
      y: yPos + 0.15,
      w: 6.0,
      h: 0.4,
      fill: { color: "E5E7EB" }
    });
    
    // Progress bar fill
    slide.addShape(pptx.ShapeType.rect, {
      x: 4.5,
      y: yPos + 0.15,
      w: (percentage / 100) * 6.0,
      h: 0.4,
      fill: { color }
    });
    
    // Percentage
    slide.addText(`${percentage}%`, {
      x: 10.8,
      y: yPos + 0.05,
      w: 1.0,
      h: 0.5,
      fontSize: 16,
      bold: true,
      color,
      align: "right"
    });
    
    // Target line
    slide.addShape(pptx.ShapeType.line, {
      x: 4.5 + (target / 100) * 6.0,
      y: yPos,
      w: 0,
      h: 0.7,
      line: { color: COLORS.text, width: 2, dashType: "dash" }
    });
    
    yPos += 1.2;
  });
  
  // Target note
  slide.addText("Target: 85% (dashed line)", {
    x: 1.0,
    y: 6.5,
    w: 11,
    h: 0.3,
    fontSize: 12,
    color: COLORS.textLight,
    italic: true
  });
}

/**
 * Slide 5: Driver Scores
 */
function addDriverScoresSlide(pptx: pptxgen, data: PPTXGenerationData) {
  const slide = pptx.addSlide();
  
  addSlideTitle(slide, "Detailed Performance Analysis Identifies Specific Improvement Areas");
  
  let yPos = 1.8;
  const sortedDrivers = [...data.drivers].sort((a, b) => a.value - b.value);
  
  sortedDrivers.forEach((driver) => {
    const percentage = Math.round((driver.value / 7) * 100);
    const target = 85;
    const color = percentage >= target ? COLORS.success : percentage >= 60 ? COLORS.secondary : COLORS.danger;
    
    // Driver name
    slide.addText(driver.name, {
      x: 1.0,
      y: yPos,
      w: 3.0,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: COLORS.text
    });
    
    // Score
    slide.addText(`${driver.value.toFixed(1)}/7.0`, {
      x: 4.0,
      y: yPos,
      w: 1.5,
      h: 0.4,
      fontSize: 14,
      color: COLORS.text,
      align: "right"
    });
    
    // Progress bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 5.8,
      y: yPos + 0.05,
      w: 5.0,
      h: 0.3,
      fill: { color: "E5E7EB" }
    });
    
    slide.addShape(pptx.ShapeType.rect, {
      x: 5.8,
      y: yPos + 0.05,
      w: (percentage / 100) * 5.0,
      h: 0.3,
      fill: { color }
    });
    
    // Percentage
    slide.addText(`${percentage}%`, {
      x: 11.0,
      y: yPos,
      w: 0.8,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color,
      align: "right"
    });
    
    yPos += 0.7;
  });
}

/**
 * Slide 6: Priority Areas
 */
function addPriorityAreasSlide(pptx: pptxgen, data: PPTXGenerationData) {
  const slide = pptx.addSlide();
  
  const highPriority = data.recommendedAreas.filter(a => a.priority === "HIGH");
  addSlideTitle(slide, `${highPriority.length} High-Priority Areas Demand Immediate Attention`);
  
  // High Priority
  slide.addText("HIGH PRIORITY", {
    x: 1.0,
    y: 1.8,
    w: 11,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: COLORS.danger
  });
  
  let yPos = 2.3;
  highPriority.forEach((area) => {
    slide.addShape(pptx.ShapeType.rect, {
      x: 1.0,
      y: yPos,
      w: 11,
      h: 0.8,
      fill: { color: "FEE2E2" }
    });
    
    slide.addText(area.name, {
      x: 1.3,
      y: yPos + 0.1,
      w: 10.4,
      h: 0.3,
      fontSize: 16,
      bold: true,
      color: COLORS.text
    });
    
    slide.addText(`Gap: ${Math.round((1 - area.score / 7) * 100)}% | Impact Weight: ${Math.round(area.weight * 100)}%`, {
      x: 1.3,
      y: yPos + 0.45,
      w: 10.4,
      h: 0.25,
      fontSize: 12,
      color: COLORS.textLight
    });
    
    yPos += 0.95;
  });
  
  // Medium Priority
  const mediumPriority = data.recommendedAreas.filter(a => a.priority === "MEDIUM");
  if (mediumPriority.length > 0) {
    yPos += 0.3;
    slide.addText("MEDIUM PRIORITY", {
      x: 1.0,
      y: yPos,
      w: 11,
      h: 0.3,
      fontSize: 14,
      bold: true,
      color: COLORS.secondary
    });
    
    yPos += 0.4;
    slide.addText(mediumPriority.map(a => a.name).join(", "), {
      x: 1.3,
      y: yPos,
      w: 10.4,
      h: 0.4,
      fontSize: 12,
      color: COLORS.text
    });
  }
}

/**
 * Slide 7: Cost of Dysfunction
 */
function addCostSlide(pptx: pptxgen, data: PPTXGenerationData) {
  const slide = pptx.addSlide();
  
  addSlideTitle(slide, `Team Inefficiency Currently Costs ${formatCurrency(data.dysfunctionCost)} Annually`);
  
  const annualCost = data.teamSize * data.avgSalary;
  const dysfunctionPercent = Math.round((1 - data.readinessScore) * 100);
  
  // Cost breakdown
  const breakdown = [
    { label: "Team Size", value: `${data.teamSize} people` },
    { label: "Average Salary", value: formatCurrency(data.avgSalary) },
    { label: "Total Annual Payroll", value: formatCurrency(annualCost) },
    { label: "Dysfunction Level", value: `${dysfunctionPercent}%` },
    { label: "Annual Waste", value: formatCurrency(data.dysfunctionCost) }
  ];
  
  let yPos = 2.0;
  breakdown.forEach((item, index) => {
    const isTotal = index === breakdown.length - 1;
    
    slide.addText(item.label, {
      x: 2.0,
      y: yPos,
      w: 6.0,
      h: 0.5,
      fontSize: isTotal ? 18 : 16,
      bold: isTotal,
      color: isTotal ? COLORS.danger : COLORS.text
    });
    
    slide.addText(item.value, {
      x: 8.0,
      y: yPos,
      w: 3.0,
      h: 0.5,
      fontSize: isTotal ? 20 : 16,
      bold: isTotal,
      color: isTotal ? COLORS.danger : COLORS.text,
      align: "right"
    });
    
    if (index === 2 || index === 3) {
      yPos += 0.7;
      slide.addShape(pptx.ShapeType.line, {
        x: 2.0,
        y: yPos - 0.1,
        w: 9.0,
        h: 0,
        line: { color: "D1D5DB", width: 1 }
      });
    } else {
      yPos += 0.6;
    }
  });
  
  // Explanation
  slide.addText(
    "This represents lost productivity from miscommunication, rework, waiting for information, and dealing with conflicts.",
    {
      x: 1.5,
      y: 5.8,
      w: 10,
      h: 0.8,
      fontSize: 14,
      color: COLORS.textLight,
      italic: true
    }
  );
}

/**
 * Slide 8: ROI Analysis
 */
function addROISlide(pptx: pptxgen, data: PPTXGenerationData) {
  const slide = pptx.addSlide();
  
  const roiMultiple = Math.round(data.roiData.roi);
  addSlideTitle(slide, `Recommended Training Delivers ${roiMultiple}x Return on Investment`);
  
  // ROI Metrics
  const metrics = [
    { label: "Training Investment", value: formatCurrency(data.roiData.cost), color: COLORS.secondary },
    { label: "Projected Annual Savings", value: formatCurrency(data.roiData.savings), color: COLORS.success },
    { label: "Return on Investment", value: `${Math.round(data.roiData.roi * 100)}%`, color: COLORS.success },
    { label: "Payback Period", value: `${data.roiData.paybackMonths.toFixed(1)} months`, color: COLORS.accent }
  ];
  
  let yPos = 2.0;
  metrics.forEach((metric) => {
    slide.addShape(pptx.ShapeType.rect, {
      x: 2.0,
      y: yPos,
      w: 9.0,
      h: 1.0,
      fill: { color: "F9FAFB" }
    });
    
    slide.addText(metric.label, {
      x: 2.3,
      y: yPos + 0.2,
      w: 8.4,
      h: 0.3,
      fontSize: 14,
      color: COLORS.textLight
    });
    
    slide.addText(metric.value, {
      x: 2.3,
      y: yPos + 0.5,
      w: 8.4,
      h: 0.4,
      fontSize: 24,
      bold: true,
      color: metric.color
    });
    
    yPos += 1.2;
  });
}

/**
 * Slide 9: Training Recommendation
 */
function addTrainingSlide(pptx: pptxgen, data: PPTXGenerationData) {
  const slide = pptx.addSlide();
  
  addSlideTitle(slide, `${data.trainingOption.label}: Targeted Training for Maximum Impact`);
  
  slide.addText("Your Recommended Training Option", {
    x: 1.5,
    y: 2.0,
    w: 10,
    h: 0.4,
    fontSize: 16,
    color: COLORS.textLight
  });
  
  slide.addShape(pptx.ShapeType.rect, {
    x: 1.5,
    y: 2.5,
    w: 10,
    h: 3.0,
    fill: { color: "EFF6FF" }
  });
  
  slide.addText(data.trainingOption.label, {
    x: 2.0,
    y: 2.8,
    w: 9,
    h: 0.6,
    fontSize: 28,
    bold: true,
    color: COLORS.primary
  });
  
  const focusCount = data.recommendedAreas.length;
  const focusText = focusCount === 1 ? "#1 priority area" : 
                   focusCount === 2 ? "Top 2 priority areas" : 
                   "All 7 drivers";
  
  slide.addText(`Focus: ${focusText}`, {
    x: 2.0,
    y: 3.6,
    w: 9,
    h: 0.4,
    fontSize: 16,
    color: COLORS.text
  });
  
  slide.addText(`Investment: ${formatCurrency(data.roiData.cost)}`, {
    x: 2.0,
    y: 4.1,
    w: 9,
    h: 0.4,
    fontSize: 16,
    color: COLORS.text
  });
  
  slide.addText(`Expected ROI: ${Math.round(data.roiData.roi * 100)}%`, {
    x: 2.0,
    y: 4.6,
    w: 9,
    h: 0.4,
    fontSize: 16,
    color: COLORS.success,
    bold: true
  });
}

/**
 * Slide 10: Recommended Focus Areas
 */
function addFocusAreasSlide(pptx: pptxgen, data: PPTXGenerationData) {
  const slide = pptx.addSlide();
  
  addSlideTitle(slide, "Targeted Training Will Address Your Most Critical Gaps");
  
  let yPos = 1.8;
  data.recommendedAreas.slice(0, 5).forEach((area, index) => {
    const currentPercent = Math.round((area.score / 7) * 100);
    const targetPercent = 85;
    
    slide.addText(`${index + 1}. ${area.name}`, {
      x: 1.0,
      y: yPos,
      w: 11,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: COLORS.text
    });
    
    slide.addText(`Current: ${currentPercent}% → Target: ${targetPercent}%`, {
      x: 1.3,
      y: yPos + 0.4,
      w: 10.4,
      h: 0.3,
      fontSize: 12,
      color: COLORS.textLight
    });
    
    yPos += 0.9;
  });
}

/**
 * Slide 11: Implementation Roadmap
 */
function addRoadmapSlide(pptx: pptxgen, data: PPTXGenerationData) {
  const slide = pptx.addSlide();
  
  addSlideTitle(slide, "Clear Path to Measurable Team Performance Improvement");
  
  const phases = [
    { phase: "Phase 1: Training Delivery", duration: "1-4 weeks", activities: ["Workshop sessions", "Skill-building exercises", "Team activities"] },
    { phase: "Phase 2: Practice & Integration", duration: "2-4 weeks", activities: ["Apply new practices", "Team coaching", "Progress check-ins"] },
    { phase: "Phase 3: Measurement", duration: "Month 3", activities: ["Re-assessment", "ROI validation", "Continuous improvement plan"] }
  ];
  
  let yPos = 2.0;
  phases.forEach((p, index) => {
    slide.addShape(pptx.ShapeType.rect, {
      x: 1.5,
      y: yPos,
      w: 10,
      h: 1.4,
      fill: { color: index % 2 === 0 ? "F3F4F6" : COLORS.background }
    });
    
    slide.addText(p.phase, {
      x: 2.0,
      y: yPos + 0.15,
      w: 9,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: COLORS.primary
    });
    
    slide.addText(`Duration: ${p.duration}`, {
      x: 2.0,
      y: yPos + 0.55,
      w: 9,
      h: 0.3,
      fontSize: 12,
      color: COLORS.textLight,
      italic: true
    });
    
    slide.addText(`• ${p.activities.join("  • ")}`, {
      x: 2.0,
      y: yPos + 0.9,
      w: 9,
      h: 0.4,
      fontSize: 12,
      color: COLORS.text
    });
    
    yPos += 1.6;
  });
}

/**
 * Slide 12: Next Steps
 */
function addNextStepsSlide(pptx: pptxgen, data: PPTXGenerationData) {
  const slide = pptx.addSlide();
  
  addSlideTitle(slide, "Take Action to Transform Your Team's Effectiveness");
  
  const steps = [
    "Review & Discuss these findings with your leadership team",
    "Select Training Option that aligns with your goals and budget",
    "Schedule Kickoff to begin your team transformation journey",
    "Measure Results with follow-up assessment in 3 months"
  ];
  
  let yPos = 2.2;
  steps.forEach((step, index) => {
    slide.addShape(pptx.ShapeType.rect, {
      x: 2.0,
      y: yPos,
      w: 0.6,
      h: 0.6,
      fill: { color: COLORS.primary }
    });
    
    slide.addText(`${index + 1}`, {
      x: 2.0,
      y: yPos,
      w: 0.6,
      h: 0.6,
      fontSize: 20,
      bold: true,
      color: COLORS.background,
      align: "center",
      valign: "middle"
    });
    
    slide.addText(step, {
      x: 2.8,
      y: yPos + 0.1,
      w: 8.7,
      h: 0.5,
      fontSize: 16,
      color: COLORS.text
    });
    
    yPos += 1.0;
  });
  
  // Contact info
  slide.addShape(pptx.ShapeType.rect, {
    x: 1.5,
    y: 6.2,
    w: 10,
    h: 0.8,
    fill: { color: "EFF6FF" }
  });
  
  slide.addText("Visit problemops.com for more information", {
    x: 1.5,
    y: 6.4,
    w: 10,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: COLORS.primary,
    align: "center"
  });
}

/**
 * Helper: Add slide title
 */
function addSlideTitle(slide: any, title: string) {
  slide.addText(title, {
    x: 0.5,
    y: 0.5,
    w: 12,
    h: 0.8,
    fontSize: 28,
    bold: true,
    color: COLORS.primary
  });
  
  // Title underline
  slide.addShape(slide.pptx.ShapeType.rect, {
    x: 0.5,
    y: 1.4,
    w: 12,
    h: 0.05,
    fill: { color: COLORS.secondary }
  });
}

/**
 * Helper: Format currency
 */
function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

/**
 * Download the generated PowerPoint
 */
export function downloadPowerPoint(data: PPTXGenerationData, filename: string) {
  const pptx = generatePowerPoint(data);
  pptx.writeFile({ fileName: filename });
}
