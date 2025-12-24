import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, ShadingType } from "docx";
import { generateTeamStory, DriverImpactNarrative } from './driverImpactContent';

interface AssessmentData {
  id: string;
  companyName: string;
  teamSize: number;
  avgSalary: number;
  readinessScore: number;
  dysfunctionCost: number;
  driverScores: Record<string, number>;
  fourCsScores: Record<string, number>;
  priorityAreas: Array<{ driver: string; score: number; priority: string }>;
  trainingType: string;
  recommendedAreas: string[];
  teamStory?: {
    narrative: string;
    driverImpacts: DriverImpactNarrative[];
    strengths: DriverImpactNarrative[];
    overallSeverity: string;
  };
}

export async function generateWordDocument(data: AssessmentData): Promise<Blob> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Title Page
        new Paragraph({
          text: "Team Cross-Functional Efficiency",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Readiness Assessment Report",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          text: data.companyName,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: `Assessment Date: ${new Date().toLocaleDateString()}`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        
        // Page Break
        new Paragraph({ text: "", pageBreakBefore: true }),
        
        // Executive Summary
        new Paragraph({
          text: "Executive Summary",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Company: ", bold: true }),
            new TextRun({ text: data.companyName }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Team Size: ", bold: true }),
            new TextRun({ text: data.teamSize.toString() }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Average Salary: ", bold: true }),
            new TextRun({ text: `$${data.avgSalary.toLocaleString()}` }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Overall Readiness Score: ", bold: true }),
            new TextRun({ text: `${data.readinessScore.toFixed(1)}/7.0`, bold: true, size: 28 }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Annual Cost of Dysfunction: ", bold: true }),
            new TextRun({ text: `$${Math.round(data.dysfunctionCost).toLocaleString()}`, bold: true, size: 28 }),
          ],
          spacing: { after: 400 },
        }),
        
        // Page Break
        new Paragraph({ text: "", pageBreakBefore: true }),
        
        // Your Team's Current Story
        new Paragraph({
          text: "Your Team's Current Story",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: data.teamStory?.narrative || `Your team demonstrates a readiness score of ${data.readinessScore.toFixed(1)}/7.0, indicating areas for improvement in cross-functional effectiveness.`,
          spacing: { after: 300 },
        }),
        
        // Areas Causing Waste
        ...(data.teamStory?.driverImpacts && data.teamStory.driverImpacts.length > 0 ? [
          new Paragraph({
            text: "Where Your Team May Be Wasting Resources",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
          }),
          new Paragraph({
            text: "Based on your scores, these drivers are likely contributing to lost productivity, rework, and delays:",
            spacing: { after: 200 },
          }),
          ...data.teamStory.driverImpacts.flatMap((impact: DriverImpactNarrative) => [
            new Paragraph({
              children: [
                new TextRun({ text: `${impact.driverName} `, bold: true, size: 24 }),
                new TextRun({ text: `(Score: ${impact.score.toFixed(1)}/7.0) - `, size: 22 }),
                new TextRun({ text: impact.severityLabel, bold: true, color: impact.severityLevel === 'critical' ? 'DC2626' : impact.severityLevel === 'high' ? 'EA580C' : 'CA8A04' }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              text: impact.summaryStatement,
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Team Behaviors: ", bold: true }),
              ],
              spacing: { after: 50 },
            }),
            ...impact.behavioralConsequences.slice(0, 3).map((behavior: string) => 
              new Paragraph({
                text: `• ${behavior}`,
                spacing: { after: 50 },
              })
            ),
            new Paragraph({
              children: [
                new TextRun({ text: "Leads to Waste In: ", bold: true }),
                new TextRun({ text: impact.wasteOutcomes.map((w: any) => w.category).join(', ') }),
              ],
              spacing: { after: 50 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Research: ${impact.citation.finding} (${impact.citation.authors}, ${impact.citation.year})`, italics: true, size: 18 }),
              ],
              spacing: { after: 200 },
            }),
          ]),
        ] : []),
        
        // Team Strengths
        ...(data.teamStory?.strengths && data.teamStory.strengths.length > 0 ? [
          new Paragraph({
            text: "Where Your Team Excels",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
          }),
          new Paragraph({
            text: "These high-scoring drivers are contributing to your team's efficiency and productivity:",
            spacing: { after: 200 },
          }),
          ...data.teamStory.strengths.flatMap((strength: DriverImpactNarrative) => [
            new Paragraph({
              children: [
                new TextRun({ text: `${strength.driverName} `, bold: true, size: 24 }),
                new TextRun({ text: `(Score: ${strength.score.toFixed(1)}/7.0) - `, size: 22 }),
                new TextRun({ text: strength.severityLabel, bold: true, color: '16A34A' }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              text: strength.summaryStatement,
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Positive Team Behaviors: ", bold: true }),
              ],
              spacing: { after: 50 },
            }),
            ...strength.behavioralConsequences.slice(0, 3).map((behavior: string) => 
              new Paragraph({
                text: `✓ ${behavior}`,
                spacing: { after: 50 },
              })
            ),
            new Paragraph({
              children: [
                new TextRun({ text: "Drives Efficiency In: ", bold: true }),
                new TextRun({ text: strength.wasteOutcomes.map((w: any) => w.category).join(', ') }),
              ],
              spacing: { after: 50 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Research: ${strength.citation.finding} (${strength.citation.authors}, ${strength.citation.year})`, italics: true, size: 18 }),
              ],
              spacing: { after: 200 },
            }),
          ]),
        ] : []),
        
        // Page Break
        new Paragraph({ text: "", pageBreakBefore: true }),
        
        // Driver Scores
        new Paragraph({
          text: "Team Effectiveness Drivers",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: "Your team was assessed across 7 key drivers of cross-functional effectiveness:",
          spacing: { after: 200 },
        }),
        ...Object.entries(data.driverScores).map(([driver, score]) => 
          new Paragraph({
            children: [
              new TextRun({ text: `${formatDriverName(driver)}: `, bold: true }),
              new TextRun({ text: `${score.toFixed(1)}/7.0` }),
            ],
            spacing: { after: 100 },
          })
        ),
        
        // Page Break
        new Paragraph({ text: "", pageBreakBefore: true }),
        
        // 4Cs Analysis
        new Paragraph({
          text: "The 4Cs Framework Analysis",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: "Your drivers map to the 4Cs of team effectiveness:",
          spacing: { after: 200 },
        }),
        ...Object.entries(data.fourCsScores).map(([category, score]) => 
          new Paragraph({
            children: [
              new TextRun({ text: `${category}: `, bold: true }),
              new TextRun({ text: `${score.toFixed(1)}/7.0` }),
            ],
            spacing: { after: 100 },
          })
        ),
        
        // Page Break
        new Paragraph({ text: "", pageBreakBefore: true }),
        
        // Priority Areas
        new Paragraph({
          text: "Priority Areas for Improvement",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: "Based on your assessment, these areas require attention:",
          spacing: { after: 200 },
        }),
        ...data.priorityAreas.slice(0, 5).map((area, index) => 
          new Paragraph({
            children: [
              new TextRun({ text: `${index + 1}. ${formatDriverName(area.driver)}: `, bold: true }),
              new TextRun({ text: `${area.score.toFixed(1)}/7.0 ` }),
              new TextRun({ text: `(${area.priority} Priority)`, italics: true }),
            ],
            spacing: { after: 100 },
          })
        ),
        
        // Page Break
        new Paragraph({ text: "", pageBreakBefore: true }),
        
        // Training Recommendations
        new Paragraph({
          text: "Recommended Training Approach",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Selected Training Type: ", bold: true }),
            new TextRun({ text: formatTrainingType(data.trainingType) }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Focus Areas:",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        ...data.recommendedAreas.map(area => 
          new Paragraph({
            text: `• ${area}`,
            spacing: { after: 100 },
          })
        ),
        
        // Page Break
        new Paragraph({ text: "", pageBreakBefore: true }),
        
        // Next Steps
        new Paragraph({
          text: "Next Steps",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: "1. Review this report with your leadership team",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "2. Identify specific initiatives for each priority area",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "3. Schedule training sessions based on recommended approach",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "4. Establish metrics to track improvement over time",
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "5. Re-assess in 6-12 months to measure progress",
          spacing: { after: 400 },
        }),
        
        // Footer
        new Paragraph({
          text: "Generated by ProblemOps Team Readiness Assessment",
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
        }),
        new Paragraph({
          text: "https://problemops.com",
          alignment: AlignmentType.CENTER,
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}

function formatDriverName(driver: string): string {
  const names: Record<string, string> = {
    trust: "Trust",
    psych_safety: "Psychological Safety",
    tms: "Transactive Memory System",
    comm_quality: "Communication Quality",
    goal_clarity: "Goal Clarity",
    coordination: "Coordination",
    team_cognition: "Team Cognition",
  };
  return names[driver] || driver;
}

function formatTrainingType(type: string): string {
  const types: Record<string, string> = {
    "half-day": "Half-Day Workshop",
    "full-day": "Full-Day Workshop",
    "month-long": "Month-Long Program",
    "not-sure": "To Be Determined",
  };
  return types[type] || type;
}
