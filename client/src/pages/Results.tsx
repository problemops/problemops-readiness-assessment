import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Home, TrendingUp, AlertTriangle, BarChart3, CheckCircle2, Target } from "lucide-react";
import { motion } from "framer-motion";
import { SlidePDFGenerator } from "@/lib/pdfGenerator";
import PriorityMatrix from "@/components/PriorityMatrix";
import { FourCsChart } from "@/components/FourCsChart";
import { ProblemOpsPrinciples } from "@/components/ProblemOpsPrinciples";
import { calculate4CsScores, getRecommendedDeliverables } from "@/lib/fourCsScoring";
import { generateTrainingPlan, getTrainingPriorities } from "@/lib/problemOpsTrainingPlan";
import { generateTeamNarrative as generateEnhancedNarrative, type CompanyContext } from "@/lib/companyAnalysis";
import { 
  TRAINING_OPTIONS, 
  getPriorityAreas, 
  getRecommendedAreas, 
  getMonthLongTimeline,
  getRecommendedDeliverables as getTrainingDeliverables,
  calculateTrainingROI,
  type TrainingType 
} from "@/lib/trainingRecommendations";

const DRIVER_NAMES: Record<string, string> = {
  trust: "Trust",
  psych_safety: "Psychological Safety",
  tms: "Transactive Memory",
  comm_quality: "Communication Quality",
  goal_clarity: "Goal Clarity",
  coordination: "Coordination",
  team_cognition: "Team Cognition",
};

const DRIVER_WEIGHTS: Record<string, number> = {
  trust: 0.18,
  psych_safety: 0.16,
  tms: 0.14,
  comm_quality: 0.15,
  goal_clarity: 0.13,
  coordination: 0.12,
  team_cognition: 0.12,
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercent = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(value);
};

export default function Results() {
  const params = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const assessmentId = params.id;
  const { data: assessmentData, isLoading: isQueryLoading, error: queryError } = trpc.assessment.getById.useQuery(
    { id: assessmentId! },
    { enabled: !!assessmentId }
  );

  useEffect(() => {
    if (!assessmentId) {
      setError('No assessment ID provided');
      setIsLoading(false);
      return;
    }

    if (queryError) {
      setError('Failed to load assessment');
      setIsLoading(false);
      return;
    }

    if (assessmentData) {
      const parsed = assessmentData;
      
      // Calculate metrics
      const drivers = Object.entries(parsed.scores).map(([id, score]: [string, any]) => ({
        id,
        name: DRIVER_NAMES[id],
        description: getDriverDescription(id),
        weight: DRIVER_WEIGHTS[id],
        value: score as number,
      }));

      const readinessScore = drivers.reduce((sum, d) => sum + (d.value / 7) * d.weight, 0);
      const teamSize = parseInt(parsed.companyInfo.teamSize);
      const avgSalary = parseInt(parsed.companyInfo.avgSalary);
      const trainingType = (parsed.companyInfo.trainingType || 'not-sure') as TrainingType;
      
      const totalPayroll = teamSize * avgSalary;
      const dysfunctionCost = totalPayroll * (1 - readinessScore);
      
      // Get priority areas for recommendations
      const driverScoresForPriority: Record<string, number> = {};
      drivers.forEach(d => {
        driverScoresForPriority[d.id] = d.value;
      });
      const priorityAreas = getPriorityAreas(driverScoresForPriority, DRIVER_WEIGHTS);
      const recommendedAreas = getRecommendedAreas(trainingType, priorityAreas);
      
      // Calculate ROI based on training type
      const trainingOption = TRAINING_OPTIONS[trainingType];
      let roiData;
      
      if (trainingType === 'not-sure') {
        // Calculate for all three options
        roiData = {
          halfDay: calculateTrainingROI(2000, dysfunctionCost, readinessScore, 1),
          fullDay: calculateTrainingROI(3500, dysfunctionCost, readinessScore, 2),
          monthLong: calculateTrainingROI(25000, dysfunctionCost, readinessScore, 7)
        };
      } else {
        roiData = calculateTrainingROI(
          trainingOption.cost,
          dysfunctionCost,
          readinessScore,
          trainingOption.focusAreas
        );
      }

      // Calculate 4 C's scores
      const driverScoresMap: Record<string, number> = {};
      drivers.forEach(d => {
        driverScoresMap[d.name] = d.value;
      });
      const fourCsAnalysis = calculate4CsScores(driverScoresMap);
      const trainingPlan = generateTrainingPlan(fourCsAnalysis);
      const trainingPriorities = getTrainingPriorities(fourCsAnalysis);
      const recommendedDeliverables = getRecommendedDeliverables(fourCsAnalysis);
      
      // Generate enhanced narrative
      const companyContext: CompanyContext = {
        name: parsed.companyInfo.name || '',
        website: parsed.companyInfo.website || '',
        team: parsed.companyInfo.team || '',
      };
      const enhancedNarrative = generateEnhancedNarrative(
        driverScoresMap,
        companyContext,
        fourCsAnalysis.scores
      );
      
      setResults({
        drivers,
        readinessScore,
        dysfunctionCost,
        teamSize,
        avgSalary,
        trainingType,
        trainingOption,
        roiData,
        priorityAreas,
        recommendedAreas,
        companyInfo: parsed.companyInfo,
        answers: parsed.answers,
        fourCsAnalysis,
        trainingPlan,
        trainingPriorities,
        recommendedDeliverables,
        enhancedNarrative,
      });
      setIsLoading(false);
    }
  }, [assessmentData, assessmentId, queryError, navigate]);

  const getDriverDescription = (id: string): string => {
    const descriptions: Record<string, string> = {
      trust: "The degree to which team members can rely on each other to follow through on commitments and believe others have good intentions.",
      psych_safety: "The extent to which team members feel comfortable taking risks and speaking up without fear of embarrassment or punishment.",
      tms: "The team's shared understanding of who knows what and where to find specific information or expertise.",
      comm_quality: "The clarity, timeliness, and effectiveness of information sharing within the team.",
      goal_clarity: "The degree to which team members understand objectives and how their work contributes to team success.",
      coordination: "How smoothly work flows between team members and how well the team manages handoffs and dependencies.",
      team_cognition: "The team's ability to think and solve problems effectively as a collective unit.",
    };
    return descriptions[id] || "";
  };

  // Show loading state
  if (isLoading || isQueryLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your assessment results...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold">Assessment Not Found</h2>
          <p className="text-muted-foreground">{error || 'Unable to load assessment results'}</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    if (!results) return;
    
    setIsGenerating(true);
    try {
      // Prepare data for PDF - use appropriate ROI data based on training type
      let pdfROIData;
      if (results.trainingType === 'not-sure') {
        // For "not sure", use the month-long option for the PDF
        pdfROIData = results.roiData.monthLong;
      } else {
        pdfROIData = results.roiData;
      }

      const pdfData = {
        drivers: results.drivers,
        teamSize: results.teamSize,
        avgSalary: results.avgSalary,
        interventionCost: pdfROIData.cost,
        readinessScore: results.readinessScore,
        dysfunctionCost: results.dysfunctionCost,
        projectedSavings: pdfROIData.savings,
        roi: pdfROIData.roi,
        paybackMonths: pdfROIData.paybackMonths,
        companyInfo: results.companyInfo,
        assessmentAnswers: results.answers,
        fourCsAnalysis: results.fourCsAnalysis,
        trainingPlan: results.trainingPlan,
        trainingPriorities: results.trainingPriorities,
        recommendedDeliverables: results.recommendedDeliverables,
        enhancedNarrative: results.enhancedNarrative,
        trainingType: results.trainingType,
        recommendedAreas: results.recommendedAreas,
      };
      
      const generator = new SlidePDFGenerator(pdfData);
      generator.download(`${results.companyInfo.name || 'Team'}_Readiness_Assessment.pdf`.replace(/\s+/g, '_'));
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  // Helper to get the appropriate ROI data for display
  const getDisplayROI = () => {
    if (results.trainingType === 'not-sure') {
      return null; // We'll show comparison table instead
    }
    return results.roiData;
  };

  const displayROI = getDisplayROI();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-lg">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/problemops-icon.svg" 
                alt="ProblemOps" 
                className="h-10 md:h-12 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => navigate('/')}
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Assessment Results</h1>
                <p className="text-sm opacity-90 mt-1">
                  {results.companyInfo.name}{results.companyInfo.team ? ` - ${results.companyInfo.team}` : ''}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                New Assessment
              </Button>
              <Button 
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="gap-2 bg-white text-primary hover:bg-white/90"
              >
                <Download className="h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Download PDF Report'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12 px-6 max-w-6xl space-y-12">
        {/* Introduction */}
        <section className="bg-card border rounded-lg p-8 shadow-sm">
          <p className="text-lg leading-relaxed text-foreground">
            <span className="font-semibold text-primary">{results.companyInfo.name || 'Your organization'}</span>, 
            thank you for completing the ProblemOps Team Readiness Assessment. Your results reveal how your team performs across seven research-validated drivers of effectiveness—from trust and psychological safety to coordination and shared cognition. 
            These insights translate directly into financial impact, showing you both the current cost of team dysfunction and the potential savings from targeted improvement. 
            Most importantly, this report provides a concrete action plan based on the ProblemOps framework, with specific exercises, deliverables, and training priorities tailored to your team's unique needs. 
            Use these results to build the business case for investment in team development and to guide your improvement journey.
          </p>
        </section>

        {/* Executive Summary */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Executive Summary</h2>
          
          {/* Training Type Indicator */}
          <Card className="mb-6 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg">Selected Training Scope</h3>
                  <p className="text-sm text-muted-foreground">
                    {results.trainingOption.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-l-4 border-l-destructive">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Annual Cost of Dysfunction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-destructive mb-2">
                    {formatCurrency(results.dysfunctionCost)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Wasted payroll due to team inefficiency
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Team Readiness Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {formatPercent(results.readinessScore)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Overall effectiveness across all 7 drivers
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ROI Display - Conditional based on training type */}
          {results.trainingType === 'not-sure' ? (
            /* Comparative ROI Table for "I'm Not Sure Yet" */
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Training Options Comparison</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Compare the ROI and scope of each training option to help you decide which approach fits your needs and budget.
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Option</th>
                        <th className="text-left py-3 px-4 font-semibold">Investment</th>
                        <th className="text-left py-3 px-4 font-semibold">Focus Areas</th>
                        <th className="text-left py-3 px-4 font-semibold">Annual Savings</th>
                        <th className="text-left py-3 px-4 font-semibold">ROI</th>
                        <th className="text-left py-3 px-4 font-semibold">Payback</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-4 px-4">
                          <div className="font-semibold">Half Day Workshop</div>
                          <div className="text-xs text-muted-foreground">Quick-start intervention</div>
                        </td>
                        <td className="py-4 px-4 font-mono font-semibold">
                          {formatCurrency(results.roiData.halfDay.cost)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">Top priority only</div>
                          <div className="text-xs text-muted-foreground">
                            {results.priorityAreas[0]?.name || 'N/A'}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono text-primary font-semibold">
                          {formatCurrency(results.roiData.halfDay.savings)}
                        </td>
                        <td className="py-4 px-4 font-mono font-semibold text-green-600">
                          {formatPercent(results.roiData.halfDay.roi)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold">{results.roiData.halfDay.paybackMonths.toFixed(1)} mo</div>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-4 px-4">
                          <div className="font-semibold">Full Day Workshop</div>
                          <div className="text-xs text-muted-foreground">Focused deep-dive</div>
                        </td>
                        <td className="py-4 px-4 font-mono font-semibold">
                          {formatCurrency(results.roiData.fullDay.cost)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">Top 2 priorities</div>
                          <div className="text-xs text-muted-foreground">
                            {results.priorityAreas.slice(0, 2).map((a: any) => a.name).join(', ')}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono text-primary font-semibold">
                          {formatCurrency(results.roiData.fullDay.savings)}
                        </td>
                        <td className="py-4 px-4 font-mono font-semibold text-green-600">
                          {formatPercent(results.roiData.fullDay.roi)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold">{results.roiData.fullDay.paybackMonths.toFixed(1)} mo</div>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50 bg-primary/5">
                        <td className="py-4 px-4">
                          <div className="font-semibold flex items-center gap-2">
                            Month-Long Engagement
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">RECOMMENDED</span>
                          </div>
                          <div className="text-xs text-muted-foreground">Comprehensive transformation</div>
                        </td>
                        <td className="py-4 px-4 font-mono font-semibold">
                          {formatCurrency(results.roiData.monthLong.cost)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">All 7 drivers</div>
                          <div className="text-xs text-muted-foreground">Ranked by priority</div>
                        </td>
                        <td className="py-4 px-4 font-mono text-primary font-semibold">
                          {formatCurrency(results.roiData.monthLong.savings)}
                        </td>
                        <td className="py-4 px-4 font-mono font-semibold text-green-600">
                          {formatPercent(results.roiData.monthLong.roi)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold">{results.roiData.monthLong.paybackMonths.toFixed(1)} mo</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-foreground">
                    <strong>Recommendation:</strong> The Month-Long Engagement offers the best long-term value by addressing all drivers systematically. However, if budget is a constraint, starting with a Full Day Workshop on your top 2 priorities can deliver meaningful improvements while you build the business case for a more comprehensive program.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Single ROI Card for specific training types */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Projected Annual Savings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-primary mb-2">
                      {formatCurrency(displayROI!.savings)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      From {results.trainingOption.label.toLowerCase()}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-l-4 border-l-green-600">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Return on Investment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {formatPercent(displayROI!.roi)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Investment: {formatCurrency(displayROI!.cost)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="border-l-4 border-l-amber-600">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Payback Period
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-amber-600 mb-2">
                      {displayROI!.paybackMonths.toFixed(1)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      months to recover investment
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </section>

        <Separator />

        {/* Cost of Dysfunction Breakdown */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Understanding Your Cost of Dysfunction</h2>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground/90 leading-relaxed">
                  Think of your team's total payroll as an investment in getting work done. When your team works at full effectiveness, you get the maximum value from every dollar you spend on salaries. But when there are problems with trust, communication, or coordination, some of that money gets wasted on confusion, rework, and delays.
                </p>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                <h3 className="text-xl font-semibold">Here's How We Calculate It:</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Your Team Size:</span>
                    <span className="font-semibold">{results.teamSize} people</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Average Salary:</span>
                    <span className="font-semibold">{formatCurrency(results.avgSalary)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium">Total Annual Payroll Investment:</span>
                    <span className="font-bold">{formatCurrency(results.teamSize * results.avgSalary)}</span>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-foreground/90 leading-relaxed">
                  Your team's readiness score is <strong>{formatPercent(results.readinessScore)}</strong>. This means your team is working at about {Math.round(results.readinessScore * 100)}% of its potential effectiveness. The remaining {Math.round((1 - results.readinessScore) * 100)}% represents lost productivity—time spent on miscommunication, redoing work, waiting for information, or dealing with conflicts.
                </p>
              </div>

              <div className="bg-destructive/5 border border-destructive/20 p-6 rounded-lg space-y-4">
                <h3 className="text-xl font-semibold">Where the Waste Comes From:</h3>
                <p className="text-sm text-muted-foreground">Each driver contributes differently to your total dysfunction cost based on research showing which factors matter most for team performance.</p>
                
                <div className="space-y-3">
                  {results.drivers.map((driver: any) => {
                    const driverGap = (1 - (driver.value / 7));
                    const driverCost = (results.teamSize * results.avgSalary) * driver.weight * driverGap;
                    
                    return (
                      <div key={driver.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{driver.name}</span>
                          <span className="font-semibold text-destructive">{formatCurrency(driverCost)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>Score: {driver.value.toFixed(1)}/7.0</span>
                          <span>•</span>
                          <span>Gap: {Math.round(driverGap * 100)}%</span>
                          <span>•</span>
                          <span>Impact weight: {Math.round(driver.weight * 100)}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-destructive rounded-full"
                            style={{ width: `${(driverCost / results.dysfunctionCost) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator />
                <div className="flex justify-between items-center text-xl pt-2">
                  <span className="font-bold">Total Annual Cost of Dysfunction:</span>
                  <span className="font-bold text-destructive text-2xl">{formatCurrency(results.dysfunctionCost)}</span>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-foreground/90 leading-relaxed">
                  This is how much money you're essentially leaving on the table each year because your team isn't working as effectively as it could. It's not that people aren't trying—it's that the system has friction that slows everyone down.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Training Scope & Focus Areas */}
        {results.trainingType !== 'not-sure' && (
          <>
            <section>
              <h2 className="text-3xl font-bold mb-6">Your Training Focus Areas</h2>
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="prose prose-lg max-w-none">
                    <p className="text-foreground/90 leading-relaxed">
                      Based on your selection of <strong>{results.trainingOption.label}</strong>, your training will focus on the following areas ranked by priority and impact:
                    </p>
                  </div>

                  <div className="space-y-4">
                    {results.recommendedAreas.map((area: any, index: number) => (
                      <div key={area.id} className="bg-muted/50 p-5 rounded-lg border-l-4 border-l-primary">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">{area.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Current Score: {area.score.toFixed(1)}/7.0 ({Math.round((area.score / 7) * 100)}%)
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Impact Weight</div>
                            <div className="text-lg font-bold text-primary">{Math.round(area.weight * 100)}%</div>
                          </div>
                        </div>
                        <p className="text-sm text-foreground/80 mt-3">{area.description}</p>
                      </div>
                    ))}
                  </div>

                  {results.trainingType === 'month-long' && (
                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3">Month-Long Timeline</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your comprehensive engagement will address all 7 drivers in a prioritized sequence:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {results.priorityAreas.map((area: any, index: number) => (
                          <div key={area.id} className="flex items-center gap-2 text-sm">
                            <span className="bg-primary/20 text-primary px-2 py-1 rounded font-semibold text-xs">
                              Week {Math.floor(index / 2) + 1}
                            </span>
                            <span>{area.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
            <Separator />
          </>
        )}

        {/* Priority Matrix */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Where to Focus Your Efforts</h2>
          <PriorityMatrix drivers={results.drivers} />
        </section>

        <Separator />

        {/* Driver Performance Summary */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Driver Performance Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.drivers.map((driver: any, index: number) => (
              <motion.div
                key={driver.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {driver.value >= 5.5 ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : driver.value >= 4 ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      )}
                      {driver.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-4xl font-bold font-mono">
                        {driver.value.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground text-lg">/ 7.0</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden mb-3">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          driver.value >= 5.5 ? 'bg-green-600' :
                          driver.value >= 4 ? 'bg-yellow-600' :
                          'bg-destructive'
                        }`}
                        style={{ width: `${(driver.value / 7) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {driver.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <Separator />

        {/* 4 C's Framework Analysis */}
        <section>
          <FourCsChart analysis={results.fourCsAnalysis} />
        </section>

        <Separator />

        {/* Team Narrative */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Your Team's Story</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground/90 leading-relaxed">
                  {results.enhancedNarrative}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* ProblemOps Principles */}
        <section>
          <ProblemOpsPrinciples />
        </section>

        <Separator />

        {/* Training Plan - Filtered based on training type */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Your ProblemOps Training Plan</h2>
          
          {/* Training Priorities */}
          {results.trainingPriorities.length > 0 && (
            <Card className="mb-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Priority Focus Areas
                </h3>
                <div className="space-y-3">
                  {results.trainingPriorities
                    .filter((priority: any) => {
                      // Filter priorities based on training type
                      if (results.trainingType === 'not-sure' || results.trainingType === 'month-long') {
                        return true; // Show all
                      }
                      // For half-day and full-day, only show priorities that match recommended areas
                      const recommendedAreaNames = results.recommendedAreas.map((a: any) => a.name.toLowerCase());
                      return recommendedAreaNames.some((name: string) => 
                        priority.area.toLowerCase().includes(name) || name.includes(priority.area.toLowerCase())
                      );
                    })
                    .map((priority: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`px-2 py-1 rounded text-xs font-bold ${
                          priority.urgency === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          priority.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {priority.urgency.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold">{priority.area}</div>
                          <div className="text-sm text-muted-foreground">{priority.reason}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Training Modules */}
          <div className="grid gap-6">
            {Object.entries(results.trainingPlan)
              .filter(([key]) => key !== 'priorities')
              .map(([key, module]: [string, any]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">{module.description}</p>
                    <div className="text-sm font-medium text-primary mt-2">Duration: {module.duration}</div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Exercises</h4>
                      <ul className="space-y-2">
                        {module.exercises.map((exercise: string, index: number) => (
                          <li key={index} className="flex items-start gap-3 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{exercise}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Deliverables</h4>
                      <div className="flex flex-wrap gap-2">
                        {module.deliverables.map((deliverable: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                            {deliverable}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>

        <Separator />

        {/* Recommended Deliverables */}
        {Object.keys(results.recommendedDeliverables).length > 0 && (
          <>
            <section>
              <h2 className="text-3xl font-bold mb-6">Recommended ProblemOps Deliverables</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-6">
                    Based on your 4 C's scores, these are the specific ProblemOps artifacts your team should focus on creating:
                  </p>
                  <div className="space-y-6">
                    {Object.entries(results.recommendedDeliverables).map(([category, deliverables]: [string, any]) => (
                      <div key={category}>
                        <h3 className="text-lg font-semibold mb-3">{category}</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {deliverables.map((deliverable: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{deliverable}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
            <Separator />
          </>
        )}

        {/* Next Steps */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Next Steps</h2>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Immediate Actions</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Download and share this report with team leadership and key stakeholders</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Prioritize interventions based on the lowest-scoring drivers with highest financial impact</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Schedule a team workshop to discuss findings and co-create an action plan</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Establish baseline metrics to track improvement over time</span>
                  </li>
                </ul>
              </div>

              <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                <h3 className="text-xl font-semibold mb-3">Learn More About ProblemOps</h3>
                <p className="text-muted-foreground mb-4">
                  Visit <a href="https://problemops.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">problemops.com</a> for articles, case studies, and practical frameworks to build shared language and understanding within your team.
                </p>
                <p className="text-sm text-muted-foreground">
                  The full PDF report includes detailed training recommendations based on the ProblemOps 4 C's framework, tailored to your team's specific needs.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
