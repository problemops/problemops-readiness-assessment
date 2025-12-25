import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Home, TrendingUp, AlertTriangle, BarChart3, CheckCircle2, Target, FileText, Github } from "lucide-react";
import { motion } from "framer-motion";
import { SlidePDFGenerator } from "@/lib/pdfGenerator";
import { generateWordDocument } from "@/lib/docxGenerator";
import PriorityMatrix from "@/components/PriorityMatrix";
import { FourCsChart } from "@/components/FourCsChart";
import { ProblemOpsPrinciples } from "@/components/ProblemOpsPrinciples";
import HowItWorksButton from "@/components/HowItWorksButton";
import UserGuideButton from "@/components/UserGuideButton";
import { ProgressStepper } from "@/components/ProgressStepper";
import { ThemeToggle } from "@/components/ThemeToggle";
import { calculate4CsScores, getRecommendedDeliverables, getOtherDeliverables, getRecommendedDeliverablesByTraining, getOtherDeliverablesByTraining } from "@/lib/fourCsScoring";
import { generateTrainingPlan, getTrainingPriorities } from "@/lib/problemOpsTrainingPlan";
import { generateTeamNarrative as generateEnhancedNarrative, type CompanyContext } from "@/lib/companyAnalysis";
import { generateTeamStory, getSeverityColorClass, getSeverityBadgeClass, getSeverityTextClass, type DriverImpactNarrative } from "@/lib/driverImpactContent";
import { 
  TRAINING_OPTIONS, 
  getPriorityAreas, 
  getRecommendedAreas, 
  getMonthLongTimeline,
  getRecommendedDeliverables as getTrainingDeliverables,
  calculateTrainingROI,
  type TrainingType 
} from "@/lib/trainingRecommendations";
import { 
  DRIVER_WEIGHTS, 
  calculateAllDriverCostsFromTCD 
} from "@/lib/driverWeights";

const DRIVER_NAMES: Record<string, string> = {
  trust: "Trust",
  psych_safety: "Psychological Safety",
  tms: "Transactive Memory",
  comm_quality: "Communication Quality",
  goal_clarity: "Goal Clarity",
  coordination: "Coordination",
  team_cognition: "Team Cognition",
};

// Driver weights imported from @/lib/driverWeights

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
  const [statusMessage, setStatusMessage] = useState("");

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
      
      // Use server-calculated TCD (v4.0 formula) if available, otherwise fallback
      const dysfunctionCost = parsed.dysfunctionCost || totalPayroll * (1 - readinessScore);
      
      // Get priority areas for recommendations
      const driverScoresForPriority: Record<string, number> = {};
      drivers.forEach(d => {
        driverScoresForPriority[d.id] = d.value;
      });
      const priorityAreas = getPriorityAreas(driverScoresForPriority, DRIVER_WEIGHTS);
      const recommendedAreas = getRecommendedAreas(trainingType, priorityAreas);
      
      // Calculate per-driver dysfunction costs based on TCD × weight
      // This ensures all driver costs sum to the total TCD
      const driverCosts = calculateAllDriverCostsFromTCD(dysfunctionCost);
      
      // Calculate ROI based on training type (using scoped driver costs)
      const trainingOption = TRAINING_OPTIONS[trainingType];
      let roiData;
      
      if (trainingType === 'not-sure') {
        // Calculate for all three options with scoped costs
        roiData = {
          halfDay: calculateTrainingROI(TRAINING_OPTIONS['half-day'].cost, priorityAreas, driverCosts, 1),
          fullDay: calculateTrainingROI(TRAINING_OPTIONS['full-day'].cost, priorityAreas, driverCosts, 2),
          monthLong: calculateTrainingROI(TRAINING_OPTIONS['month-long'].cost, priorityAreas, driverCosts, 7)
        };
      } else {
        roiData = calculateTrainingROI(
          trainingOption.cost,
          priorityAreas,
          driverCosts,
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
      
      // Get deliverables based on training type
      const recommendedDeliverables = getRecommendedDeliverablesByTraining(fourCsAnalysis, trainingType);
      const otherDeliverables = getOtherDeliverablesByTraining(fourCsAnalysis, trainingType);
      
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

      // Generate team story with driver impact analysis
      const driverScoresForStory: Record<string, number> = {};
      drivers.forEach(d => {
        driverScoresForStory[d.id] = d.value;
      });
      const teamStory = generateTeamStory(driverScoresForStory);
      
      // Get v4.0 TCD cost components from backend or calculate fallback
      const serverRoiData = parsed.roiData || null;
      let tcdCostComponents = serverRoiData?.tcd?.costComponents || null;
      
      // Fallback: Calculate C1-C6 if missing
      if (!tcdCostComponents) {
        const totalPayroll = teamSize * avgSalary;
        const gap = 1 - (readinessScore / 100);
        
        const c1 = totalPayroll * 0.25 * gap;
        const c2 = totalPayroll * 0.15 * gap;
        const c3 = totalPayroll * 0.12 * gap;
        const c4 = totalPayroll * 0.18 * gap;
        const c5 = totalPayroll * 0.10 * gap;
        const c6 = totalPayroll * 0.08 * gap;
        
        const subtotal = c1 + c2 + c3 + c4 + c5 + c6;
        const overlapDiscount = 0.88;
        
        tcdCostComponents = {
          productivity: c1,
          rework: c2,
          turnover: c3,
          opportunity: c4,
          overhead: c5,
          disengagement: c6,
          subtotal,
          subtotalWithDiscount: subtotal * overlapDiscount
        };
      }
      
      setResults({
        drivers,
        readinessScore,
        dysfunctionCost,
        driverCosts,
        teamSize,
        avgSalary,
        trainingType,
        trainingOption,
        roiData,
        serverRoiData,
        tcdCostComponents,
        priorityAreas,
        recommendedAreas,
        companyInfo: parsed.companyInfo,
        answers: parsed.answers,
        fourCsAnalysis,
        trainingPlan,
        trainingPriorities,
        recommendedDeliverables,
        otherDeliverables,
        enhancedNarrative,
        teamStory,
        detectedIndustry: parsed.detectedIndustry,
        priorityMatrixData: parsed.priorityMatrixData,
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
    if (isGenerating) return;
    
    setIsGenerating(true);
    setStatusMessage('Generating PDF report. Please wait...');
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
        teamStory: results.teamStory,
      };
      
      const generator = new SlidePDFGenerator(pdfData);
      generator.download(`${results.companyInfo.name || 'Team'}_Readiness_Assessment.pdf`.replace(/\s+/g, '_'));
      setStatusMessage('PDF report downloaded successfully.');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      setStatusMessage('Error: Failed to generate PDF report. Please try again.');
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadWord = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setStatusMessage('Generating Word document. Please wait...');
    try {
      // Prepare data for Word document
      console.log('Preparing Word document data...');
      console.log('results.drivers:', results.drivers);
      console.log('results.fourCsAnalysis:', results.fourCsAnalysis);
      console.log('results.priorityAreas:', results.priorityAreas);
      
      // Convert drivers array to object with driver names as keys
      const driverScores: Record<string, number> = {};
      results.drivers.forEach((d: any) => {
        driverScores[d.id] = d.value;
      });
      
      const wordData = {
        id: assessmentId || 'unknown',
        companyName: results.companyInfo.name || 'Unknown Company',
        teamSize: results.teamSize,
        avgSalary: results.avgSalary,
        readinessScore: results.readinessScore,
        dysfunctionCost: results.dysfunctionCost,
        driverScores: driverScores,
        fourCsScores: results.fourCsAnalysis || {},
        priorityAreas: results.priorityAreas || [],
        trainingType: results.trainingType,
        recommendedAreas: results.recommendedAreas || [],
        teamStory: results.teamStory,
      };
      
      console.log('Word data prepared:', wordData);
      console.log('teamStory.driverImpacts:', wordData.teamStory?.driverImpacts);
      console.log('teamStory.driverImpacts length:', wordData.teamStory?.driverImpacts?.length);
      
      const blob = await generateWordDocument(wordData);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = `${results.companyInfo.name || 'Team'}_Readiness_Assessment.docx`.replace(/\s+/g, '_');
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      
      setStatusMessage('Word document downloaded successfully.');
    } catch (error) {
      console.error('Failed to generate Word document:', error);
      setStatusMessage('Error: Failed to generate Word document. Please try again.');
      alert('Failed to generate Word document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center" role="status" aria-live="polite">
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
      {/* ARIA Live Region for status messages */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {statusMessage}
      </div>
      
      {/* Header */}
      <header role="banner" className="bg-primary text-primary-foreground sticky top-0 z-20 shadow-lg">
        {/* Top Banner Row */}
        <div className="container mx-auto max-w-6xl px-5 py-4">
          <div className="flex items-center justify-between md:justify-center md:gap-8">
            {/* Logo - Left on desktop, stacked on mobile */}
            <a 
              href="https://problemops.com" 
              aria-label="Return to ProblemOps homepage"
              className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#64563A] rounded md:absolute md:left-5"
            >
              <img 
                src="/problemops-logo.svg" 
                alt="ProblemOps" 
                className="h-8 md:h-10 hover:opacity-90 transition-opacity"
              />
            </a>
            
            {/* Progress Stepper - Center */}
            <ProgressStepper 
              currentStep="recommendations"
              completedSteps={['begin', 'assess']}
              className="hidden md:flex"
            />
            
            {/* Action Buttons - Right on desktop, hidden on mobile */}
            <div className="hidden md:flex items-center gap-2 md:absolute md:right-5">
              <a
                href="https://github.com/problemops/problemops-readiness-assessment"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-primary-foreground bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                aria-label="View source code on GitHub"
                title="View on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <UserGuideButton />
              <ThemeToggle />
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                aria-label="Download PDF Report"
                title="Download PDF"
                className="p-2 rounded-lg text-primary-foreground bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  navigate('/');
                  setTimeout(() => window.scrollTo(0, 0), 0);
                }}
                aria-label="Start new assessment"
                title="New Assessment"
                className="p-2 rounded-lg text-primary-foreground bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
              >
                <Home className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Mobile: Stacked Progress Stepper */}
          <div className="md:hidden mt-4 flex justify-center">
            <ProgressStepper 
              currentStep="recommendations"
              completedSteps={['begin', 'assess']}
            />
          </div>
        </div>
      </header>

      <main role="main" className="container mx-auto py-12 px-6 max-w-6xl space-y-12">
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-bold" id="page-title">Test Results</h1>
        
        {/* Company Info Subtitle */}
        <p className="text-xl text-muted-foreground -mt-6">
          {results.companyInfo.name}{results.companyInfo.team ? ` - ${results.companyInfo.team}` : ''}
        </p>
        
        {/* Introduction */}
        <section aria-labelledby="intro-heading" className="bg-card border rounded-lg p-8 shadow-sm">
          <h2 id="intro-heading" className="sr-only">Executive Summary Introduction</h2>
          <p className="text-lg leading-relaxed text-foreground">
            <span className="font-semibold text-primary">{results.companyInfo.name || 'Your organization'}</span>, 
            thank you for completing the ProblemOps Team Readiness Assessment. Your results reveal how your team performs across seven research-validated drivers of effectiveness—from trust and psychological safety to coordination and shared cognition. 
            These insights translate directly into financial impact, showing you both the current cost of team dysfunction and the potential savings from targeted improvement. 
            Most importantly, this report provides a concrete action plan based on the ProblemOps framework, with specific exercises, deliverables, and training priorities tailored to your team's unique needs. 
            Use these results to build the business case for investment in team development and to guide your improvement journey.
          </p>
        </section>

        {/* Executive Summary */}
        <section aria-labelledby="team-story-heading">
          <h2 id="team-story-heading" className="text-3xl font-bold mb-6">Your Team's Current Story</h2>
          
          {/* Training Type Indicator - Only show for specific training types */}
          {results.trainingType !== 'not-sure' && (
            <Card className="mb-6 bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">Selected Training Scope</h3>
                    <p className="text-sm text-muted-foreground">
                      {results.trainingOption.name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-l-4 border-l-destructive" role="region" aria-labelledby="dysfunction-cost-title">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle id="dysfunction-cost-title" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Annual Cost of Dysfunction
                    </CardTitle>
                    <HowItWorksButton section="dysfunction" />
                  </div>
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
              <Card className="border-l-4 border-l-primary" role="region" aria-labelledby="readiness-score-title">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle id="readiness-score-title" className="text-sm font-medium text-muted-foreground">
                      Team Readiness Score
                    </CardTitle>
                    <HowItWorksButton section="readiness" />
                  </div>
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
                    <caption className="sr-only">Comparison of three training options showing investment cost, focus areas, annual savings, return on investment, and payback period</caption>
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Option</th>
                        <th className="text-left py-3 px-4 font-semibold">Investment</th>
                        <th className="text-left py-3 px-4 font-semibold">Focus Areas</th>
                        <th className="text-left py-3 px-4 font-semibold">ROI If Fixed</th>
                        <th className="text-left py-3 px-4 font-semibold">Return</th>
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
                <Card className="border-l-4 border-l-primary" role="region" aria-labelledby="training-roi-title">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle id="training-roi-title" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Projected Annual Savings
                      </CardTitle>
                      <HowItWorksButton section="roi" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-primary mb-2">
                      {formatCurrency(displayROI!.savings)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      From {results.trainingOption?.name?.toLowerCase() || 'training'}
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

        {/* Your Team's Current Story - Enhanced with Driver Impact Analysis */}
        <section>
          <h2 id="team-story-heading" className="text-3xl font-bold mb-6">Your Team's Current Story</h2>
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Overview Narrative */}
              <div className="prose prose-lg max-w-none">
                <p 
                  className="text-foreground/90 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: (results.teamStory?.narrative || results.enhancedNarrative || '')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }}
                />
              </div>

              {/* Areas Causing Waste */}
              {results.teamStory?.driverImpacts && results.teamStory.driverImpacts.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold flex items-center gap-2 text-foreground">
                      <AlertTriangle className="h-7 w-6" />
                      Where Your Team May Be Wasting Resources
                    </h2>
                    <HowItWorksButton section="driverCosts" />
                  </div>
                  <p className="text-base text-muted-foreground">
                    Based on your scores, these drivers are likely contributing to lost productivity, rework, and delays:
                  </p>
                  
                  {/* Driver Cost Breakdown Summary */}
                  <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold">How We Calculate Each Driver's Cost</h3>
                    <p className="text-sm text-muted-foreground">
                      Your Total Cost of Dysfunction (<strong className="text-destructive">{formatCurrency(results.dysfunctionCost)}</strong>) is split across the 7 drivers based on research-backed weights:
                    </p>
                    <div className="bg-background p-4 rounded-lg">
                      <p className="font-mono text-center text-sm mb-3">
                        Driver Cost = Total Dysfunction Cost × Driver Weight
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="font-bold">Trust</div>
                          <div className="text-muted-foreground">18%</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="font-bold">Psych Safety</div>
                          <div className="text-muted-foreground">17%</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="font-bold">Communication</div>
                          <div className="text-muted-foreground">15%</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="font-bold">Goal Clarity</div>
                          <div className="text-muted-foreground">14%</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="font-bold">Coordination</div>
                          <div className="text-muted-foreground">13%</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="font-bold">Role Clarity</div>
                          <div className="text-muted-foreground">12%</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <div className="font-bold">Decision Making</div>
                          <div className="text-muted-foreground">11%</div>
                        </div>
                        <div className="text-center p-2 bg-primary/10 rounded border border-primary/20">
                          <div className="font-bold text-primary">Total</div>
                          <div className="text-primary">100%</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All driver costs add up to exactly {formatCurrency(results.dysfunctionCost)} (your total dysfunction cost).
                    </p>
                  </div>
                  <div className="space-y-6">
                    {results.teamStory.driverImpacts.map((impact: any, index: number) => {
                      // Get driver-specific cost using v4.0 formula: TCD × weight
                      // This ensures all driver costs sum exactly to the Total Cost of Dysfunction
                      const driver = results.drivers.find((d: any) => d.id === impact.dbKey);
                      const driverGap = driver ? (1 - (driver.value / 7)) : 0;
                      const driverCost = driver ? results.driverCosts[driver.id] || 0 : 0;
                      const gapPercent = Math.round(driverGap * 100);
                      const impactWeight = driver ? Math.round(driver.weight * 100) : 0;
                      
                      return (
                      <div key={impact.driverKey} className={`w-full p-6 rounded-lg border-l-4 ${
                        impact.severityLevel === 'critical' ? 'bg-red-50 dark:bg-red-950/20 border-l-red-500' :
                        impact.severityLevel === 'high' ? 'bg-orange-50 dark:bg-orange-950/20 border-l-orange-500' :
                        impact.severityLevel === 'medium' ? 'bg-yellow-50 dark:bg-yellow-950/20 border-l-yellow-500' :
                        'bg-green-50 dark:bg-green-950/20 border-l-green-500'
                      }`}>
                        {/* Driver Title and Badge */}
                        <div className="mb-4">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-foreground">{impact.driverName}</h3>
                            <span className={`px-3 py-1 rounded text-sm font-bold ${
                                impact.severityLevel === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                impact.severityLevel === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                impact.severityLevel === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                              {impact.severityLabel}
                            </span>
                          </div>
                          <p className="text-base text-muted-foreground mt-1">Score: {impact.score.toFixed(1)}/7.0</p>
                        </div>
                        
                        {/* Cost Callout */}
                        <div className="mb-4 pb-4 border-b border-border">
                          <div className="text-4xl font-bold text-orange-600 dark:text-orange-500 mb-1">
                            {formatCurrency(driverCost)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">Annual cost from this driver</p>
                          <p className="text-sm text-muted-foreground">
                            Gap: {gapPercent}% • Impact weight: {impactWeight}%
                          </p>
                        </div>
                        
                        {/* Narrative */}
                        <p className="text-sm text-foreground/90 mb-4 leading-relaxed">{impact.summaryStatement}</p>
                        
                        {/* Behavioral Consequences */}
                        <div className="mb-4">
                          <h4 className="text-base font-bold text-foreground mb-2">Team Behaviors You May See:</h4>
                          <ul className="text-sm space-y-2">
                            {impact.behavioralConsequences.slice(0, 3).map((behavior: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-foreground/80">
                                <span className="text-orange-600 dark:text-orange-500 font-bold">•</span>
                                <span>{behavior}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Waste Outcomes */}
                        <div className="mb-4">
                          <h4 className="text-base font-bold text-foreground mb-2">This Leads To Waste In:</h4>
                          <div className="flex flex-wrap gap-2">
                            {impact.wasteOutcomes.map((waste: any, i: number) => (
                              <span key={i} className="inline-flex items-center px-3 py-1.5 bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 text-sm rounded-full font-medium">
                                {waste.category}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Academic Citation */}
                        <p className="text-sm text-muted-foreground italic">
                          Research: {impact.citation.finding} ({impact.citation.authors}, {impact.citation.year})
                        </p>
                      </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Team Strengths */}
              {results.teamStory?.strengths && results.teamStory.strengths.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2 text-green-600 dark:text-green-500">
                    <CheckCircle2 className="h-5 w-5" />
                    Where Your Team Excels
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    These high-scoring drivers are contributing to your team's efficiency and productivity:
                  </p>
                  <div className="space-y-4">
                    {results.teamStory.strengths.map((strength: any, index: number) => (
                      <div key={strength.driverKey} className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border-l-4 border-l-green-500">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">{strength.driverName}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                {strength.severityLabel}
                              </span>
                              <span className="text-sm text-muted-foreground">Score: {strength.score.toFixed(1)}/7.0</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-foreground/80 mb-3">{strength.summaryStatement}</p>
                        
                        {/* Positive Behaviors */}
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Positive Team Behaviors:</p>
                          <ul className="text-sm space-y-1">
                            {strength.behavioralConsequences.slice(0, 3).map((behavior: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-green-600">✓</span>
                                <span>{behavior}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Efficiency Gains */}
                        <div className="bg-white/50 dark:bg-black/20 rounded p-3">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">This Drives Efficiency In:</p>
                          <div className="flex flex-wrap gap-2">
                            {strength.wasteOutcomes.map((outcome: any, i: number) => (
                              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded">
                                {outcome.category}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Academic Citation */}
                        <p className="text-xs text-muted-foreground mt-3 italic">
                          Research: {strength.citation.finding} ({strength.citation.authors}, {strength.citation.year})
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Cost of Dysfunction Breakdown */}
        <section aria-labelledby="cost-breakdown-heading">
          <div className="flex items-center justify-between mb-6">
            <h2 id="cost-breakdown-heading" className="text-3xl font-bold">Understanding Your Cost of Dysfunction</h2>
            <HowItWorksButton section="dysfunctionBreakdown" />
          </div>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground/90 leading-relaxed">
                  Think of your team's total payroll as an investment in getting work done. When your team works at full effectiveness, you get the maximum value from every dollar you spend on salaries. But when there are problems with trust, communication, or coordination, some of that money gets wasted on confusion, rework, and delays.
                </p>
              </div>

              {/* Step 1: Starting Point */}
              <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Your Starting Point
                </h3>
                <p className="text-sm text-muted-foreground">First, we look at how much you invest in your team each year:</p>
                
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

              {/* Step 2: The 6 Cost Components */}
              <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  We Measure 6 Types of Waste
                </h3>
                <p className="text-sm text-muted-foreground">Our v4.0 formula looks at 6 different ways teams lose money:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2 p-3 bg-background rounded-lg">
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded text-xs font-bold">C1</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <strong className="text-sm">Lost Productivity</strong>
                        <span className="font-mono font-bold text-sm">{formatCurrency(results.tcdCostComponents.productivity)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Waiting, searching, redoing work</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-background rounded-lg">
                    <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded text-xs font-bold">C2</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <strong className="text-sm">Rework Costs</strong>
                        <span className="font-mono font-bold text-sm">{formatCurrency(results.tcdCostComponents.rework)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Fixing mistakes from miscommunication</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-background rounded-lg">
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded text-xs font-bold">C3</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <strong className="text-sm">Turnover Costs</strong>
                        <span className="font-mono font-bold text-sm">{formatCurrency(results.tcdCostComponents.turnover)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Replacing people who leave</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-background rounded-lg">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded text-xs font-bold">C4</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <strong className="text-sm">Missed Opportunities</strong>
                        <span className="font-mono font-bold text-sm">{formatCurrency(results.tcdCostComponents.opportunity)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Business lost due to slow teams</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-background rounded-lg">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-bold">C5</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <strong className="text-sm">Extra Overhead</strong>
                        <span className="font-mono font-bold text-sm">{formatCurrency(results.tcdCostComponents.overhead)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Too many meetings & documentation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-background rounded-lg">
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded text-xs font-bold">C6</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <strong className="text-sm">Disengagement</strong>
                        <span className="font-mono font-bold text-sm">{formatCurrency(results.tcdCostComponents.disengagement)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">When people mentally check out</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Adjustments */}
              <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  We Apply Smart Adjustments
                </h3>
                <p className="text-sm text-muted-foreground">To make the number accurate for YOUR team, we adjust for:</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 bg-background rounded">
                    <span className="text-lg">× 0.88</span>
                    <span className="text-sm"><strong>Overlap Discount</strong> — Some costs overlap, so we reduce by 12%</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-background rounded">
                    <span className="text-lg">× φ</span>
                    <span className="text-sm"><strong>Industry Factor</strong> — {results.detectedIndustry ? `Adjusted for ${results.detectedIndustry}` : 'Adjusted for your industry'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-background rounded">
                    <span className="text-lg">× η</span>
                    <span className="text-sm"><strong>Team Size Factor</strong> — Larger teams have more coordination challenges</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-background rounded">
                    <span className="text-lg">× M</span>
                    <span className="text-sm"><strong>4 C's Multiplier</strong> — Based on your team's collaboration patterns</span>
                  </div>
                </div>
              </div>

              {/* Step 4: Your Team's Readiness */}
              <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  Your Team's Effectiveness
                </h3>
                <p className="text-foreground/90">
                  Your team's readiness score is <strong className="text-primary text-xl">{formatPercent(results.readinessScore)}</strong>.
                </p>
                <p className="text-sm text-muted-foreground">
                  This means your team is working at about {Math.round(results.readinessScore * 100)}% of its potential. 
                  The remaining <strong>{Math.round((1 - results.readinessScore) * 100)}%</strong> represents lost productivity—time spent on 
                  miscommunication, redoing work, waiting for information, or dealing with conflicts.
                </p>
              </div>

              {/* Final Result */}
              <div className="bg-destructive/5 border border-destructive/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <span className="bg-destructive text-destructive-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">=</span>
                  Your Total Annual Cost of Dysfunction
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-lg">Based on the v4.0 formula:</span>
                  <span className="font-bold text-destructive text-4xl">{formatCurrency(results.dysfunctionCost)}</span>
                </div>
              </div>

              <div className="prose prose-lg max-w-none mt-4">
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
                      Based on your selection of <strong>{results.trainingOption.name}</strong>, your training will focus on the following areas ranked by priority and impact:
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
        <section role="region" aria-labelledby="priority-matrix-heading">
          <div className="flex items-center justify-between mb-6">
            <h2 id="priority-matrix-heading" className="text-3xl font-bold">Where to Focus Your Efforts</h2>
            <HowItWorksButton section="priorityMatrix" />
          </div>
          <PriorityMatrix 
            drivers={results.drivers} 
            detectedIndustry={results.detectedIndustry}
            priorityMatrixData={results.priorityMatrixData}
          />
        </section>

        <Separator />

        {/* Driver Performance Summary */}
        <section role="region" aria-labelledby="driver-scores-heading">
          <div className="flex items-center justify-between mb-6">
            <h2 id="driver-scores-heading" className="text-3xl font-bold">Driver Performance Summary</h2>
            <HowItWorksButton section="drivers" />
          </div>
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
        <section role="region" aria-labelledby="four-cs-heading">
          <div className="flex items-center justify-between mb-6">
            <h2 id="four-cs-heading" className="text-3xl font-bold">The 4 C's Framework</h2>
            <HowItWorksButton section="fourCs" />
          </div>
          <FourCsChart analysis={results.fourCsAnalysis} />
        </section>

        <Separator />

        {/* ProblemOps Principles */}
        <section>
          <ProblemOpsPrinciples />
        </section>

        <Separator />

        {/* Training Plan - Filtered based on training type */}
        <section>
          <h2 id="training-plan-heading" className="text-3xl font-bold mb-6">Your ProblemOps Training Plan</h2>
          
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
                      const recommendedAreaNames = results.recommendedAreas?.map((a: any) => a?.name?.toLowerCase()).filter(Boolean) || [];
                      return recommendedAreaNames.some((name: string) => 
                        priority.area?.toLowerCase()?.includes(name) || name?.includes(priority.area?.toLowerCase())
                      );
                    })
                    .map((priority: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`px-2 py-1 rounded text-xs font-bold ${
                          priority.urgency === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          priority.urgency === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                          priority.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {priority.urgency === 'critical' ? 'CRITICAL RISK' : 
                           priority.urgency === 'high' ? 'HIGH RISK' : 
                           priority.urgency === 'medium' ? 'MEDIUM RISK' : 'LOW RISK'}
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
              <h2 id="deliverables-heading" className="text-3xl font-bold mb-6">Recommended ProblemOps Deliverables</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-6">
                    Based on your 4 C's scores, these are the specific ProblemOps artifacts your team should focus on creating during your training:
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

        {/* Other Deliverables */}
        {results.otherDeliverables && Object.keys(results.otherDeliverables).length > 0 && (
          <>
            <section>
              <h2 id="other-deliverables-heading" className="text-3xl font-bold mb-6">The Other Deliverables For the 4 C's of ProblemOps</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-6">
                    {Object.keys(results.recommendedDeliverables).length > 0
                      ? `For your reference, here are the other ProblemOps deliverables you may consider after addressing your top ${results.trainingType === 'half-day' ? 'priority' : 'priorities'}:`
                      : "Your team is performing well across all 4 C's. For your reference, here are the ProblemOps deliverables you may consider for continuous improvement:"}
                  </p>
                  <div className="space-y-6">
                    {Object.entries(results.otherDeliverables).map(([category, deliverables]: [string, any]) => (
                      <div key={category}>
                        <h3 className="text-lg font-semibold mb-3">{category}</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {deliverables.map((deliverable: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
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
          <h2 id="next-steps-heading" className="text-3xl font-bold mb-6">Next Steps</h2>
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

        {/* Bottom Action Buttons */}
        <section className="flex gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={() => {
              navigate('/');
              setTimeout(() => window.scrollTo(0, 0), 0);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-background text-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <Home className="w-5 h-5" />
            <span>New Assessment</span>
          </button>
        </section>
      </main>
    </div>
  );
}
