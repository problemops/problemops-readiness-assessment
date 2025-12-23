import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Info, TrendingUp, AlertTriangle, DollarSign, Users, BarChart3, ArrowRight, Download, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

// --- Types & Constants ---

type Driver = {
  id: string;
  name: string;
  description: string;
  weight: number; // Relative weight based on correlation (e.g., Trust = 0.48)
  value: number; // 1-7 scale
};

const INITIAL_DRIVERS: Driver[] = [
  { 
    id: "trust", 
    name: "Trust", 
    description: "Reliability, vulnerability, and benevolent intent among members.", 
    weight: 0.48, 
    value: 4 
  },
  { 
    id: "psych_safety", 
    name: "Psychological Safety", 
    description: "Safety to take risks and speak up without fear of punishment.", 
    weight: 0.42, 
    value: 4 
  },
  { 
    id: "tms", 
    name: "Transactive Memory", 
    description: "Knowing who knows what; distributed expertise.", 
    weight: 0.38, 
    value: 4 
  },
  { 
    id: "comm_quality", 
    name: "Communication Quality", 
    description: "Clarity, timeliness, and shared understanding (not just frequency).", 
    weight: 0.35, 
    value: 4 
  },
  { 
    id: "goal_clarity", 
    name: "Goal Clarity", 
    description: "Shared understanding of objectives and success metrics.", 
    weight: 0.32, 
    value: 4 
  },
  { 
    id: "coordination", 
    name: "Coordination", 
    description: "Smooth workflows and management of dependencies.", 
    weight: 0.30, 
    value: 4 
  },
  { 
    id: "team_cognition", 
    name: "Team Cognition", 
    description: "Collective problem solving and decision making.", 
    weight: 0.28, 
    value: 4 
  },
];

// --- Helper Functions ---

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

// --- Components ---

const DriverSlider = ({ driver, onChange }: { driver: Driver; onChange: (val: number) => void }) => (
  <div className="space-y-3 mb-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Label className="text-base font-semibold">{driver.name}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{driver.description}</p>
              <p className="text-xs text-muted-foreground mt-1">Impact Weight: {driver.weight}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <span className="font-mono text-sm font-medium bg-secondary px-2 py-1 rounded">
        {driver.value.toFixed(1)} / 7.0
      </span>
    </div>
    <Slider
      value={[driver.value]}
      min={1}
      max={7}
      step={0.1}
      onValueChange={(vals) => onChange(vals[0])}
      className="[&>.relative>.absolute]:bg-primary"
    />
    <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider">
      <span>Critical</span>
      <span>Functional</span>
      <span>Optimized</span>
    </div>
  </div>
);

const MetricCard = ({ 
  label, 
  value, 
  subtext, 
  icon: Icon, 
  variant = "default",
  delay = 0
}: { 
  label: string; 
  value: string; 
  subtext?: string; 
  icon: any; 
  variant?: "default" | "destructive" | "success";
  delay?: number;
}) => {
  const colors = {
    default: "text-foreground",
    destructive: "text-destructive",
    success: "text-primary", // Using primary (blue) for success in this theme
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full border-l-4 border-l-transparent hover:border-l-primary transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <Icon className={`h-5 w-5 ${colors[variant]}`} />
          </div>
          <div className={`text-3xl font-bold font-mono mb-1 ${colors[variant]}`}>
            {value}
          </div>
          {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function Home() {
  // State
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [teamSize, setTeamSize] = useState<number>(10);
  const [avgSalary, setAvgSalary] = useState<number>(100000);
  const [interventionCost, setInterventionCost] = useState<number>(25000);
  
  // Derived Metrics
  const [readinessScore, setReadinessScore] = useState(0);
  const [dysfunctionCost, setDysfunctionCost] = useState(0);
  const [projectedSavings, setProjectedSavings] = useState(0);
  const [roi, setRoi] = useState(0);
  const [paybackMonths, setPaybackMonths] = useState(0);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Calculation Effect
  useEffect(() => {
    // 1. Calculate Weighted Readiness Score (0-100%)
    // Formula: Sum(Value * Weight) / Sum(Max_Value * Weight)
    const totalWeight = drivers.reduce((sum, d) => sum + d.weight, 0);
    const weightedSum = drivers.reduce((sum, d) => sum + (d.value * d.weight), 0);
    const maxWeightedSum = drivers.reduce((sum, d) => sum + (7 * d.weight), 0);
    
    const score = weightedSum / maxWeightedSum;
    setReadinessScore(score);

    // 2. Calculate Cost of Dysfunction
    // Formula: (1 - Readiness Score) * Total Salary
    const totalSalary = teamSize * avgSalary;
    const dysfunction = (1 - score) * totalSalary;
    setDysfunctionCost(dysfunction);

    // 3. Project ROI
    // Assumption: Intervention brings score to 85% (0.85) baseline
    const targetScore = 0.85;
    const currentScore = score;
    
    // Only calculate savings if current score is below target
    const savings = currentScore < targetScore 
      ? (targetScore - currentScore) * totalSalary 
      : 0;
    
    setProjectedSavings(savings);

    // ROI = (Savings - Cost) / Cost
    const roiValue = interventionCost > 0 ? ((savings - interventionCost) / interventionCost) : 0;
    setRoi(roiValue);

    // Payback = (Cost / Savings) * 12
    const payback = savings > 0 ? (interventionCost / savings) * 12 : 0;
    setPaybackMonths(payback);

  }, [drivers, teamSize, avgSalary, interventionCost]);

  const handleDriverChange = (id: string, newValue: number) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, value: newValue } : d));
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);
    try {
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add branding and title
      doc.setFillColor(37, 99, 235); // Electric Blue
      doc.rect(0, 0, 210, 20, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("ProblemOps ROI Diagnostic Report", 15, 13);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(new Date().toLocaleDateString(), 180, 13);

      // Add Executive Summary Section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Executive Summary", 15, 35);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Based on the assessment of ${teamSize} team members with an average salary of ${formatCurrency(avgSalary)},`, 15, 42);
      doc.text(`your team is currently operating at a ${formatPercent(readinessScore)} readiness level.`, 15, 47);

      // Add Key Metrics Grid
      const startY = 60;
      const boxWidth = 85;
      const boxHeight = 30;
      const gap = 10;

      // Box 1: Cost of Dysfunction
      doc.setDrawColor(249, 115, 22); // Orange border
      doc.setLineWidth(0.5);
      doc.rect(15, startY, boxWidth, boxHeight);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(249, 115, 22); // Orange text
      doc.setFontSize(16);
      doc.text(formatCurrency(dysfunctionCost), 20, startY + 12);
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Annual Cost of Dysfunction", 20, startY + 22);

      // Box 2: Projected Savings
      doc.setDrawColor(37, 99, 235); // Blue border
      doc.rect(15 + boxWidth + gap, startY, boxWidth, boxHeight);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235); // Blue text
      doc.setFontSize(16);
      doc.text(formatCurrency(projectedSavings), 20 + boxWidth + gap + 5, startY + 12);
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Projected Annual Savings", 20 + boxWidth + gap + 5, startY + 22);

      // Box 3: ROI
      doc.setDrawColor(200, 200, 200); // Grey border
      doc.rect(15, startY + boxHeight + gap, boxWidth, boxHeight);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text(formatPercent(roi), 20, startY + boxHeight + gap + 12);
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`ROI (Payback: ${paybackMonths.toFixed(1)} months)`, 20, startY + boxHeight + gap + 22);

      // Box 4: Readiness Score
      doc.setDrawColor(200, 200, 200);
      doc.rect(15 + boxWidth + gap, startY + boxHeight + gap, boxWidth, boxHeight);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text(formatPercent(readinessScore), 20 + boxWidth + gap + 5, startY + boxHeight + gap + 12);
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Team Readiness Score", 20 + boxWidth + gap + 5, startY + boxHeight + gap + 22);

      // Add Driver Breakdown
      const driverStartY = 150;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Driver Breakdown", 15, driverStartY);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      let currentY = driverStartY + 10;

      drivers.forEach((driver) => {
        // Driver Name
        doc.text(driver.name, 15, currentY);
        
        // Score Bar Background
        doc.setFillColor(240, 240, 240);
        doc.rect(60, currentY - 4, 100, 5, "F");
        
        // Score Bar Fill
        const fillWidth = (driver.value / 7) * 100;
        doc.setFillColor(37, 99, 235);
        doc.rect(60, currentY - 4, fillWidth, 5, "F");
        
        // Score Value
        doc.text(`${driver.value.toFixed(1)}/7.0`, 170, currentY);
        
        currentY += 10;
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Generated by ProblemOps ROI Calculator. Based on validated research from 23 peer-reviewed studies.", 15, 280);

      // Save PDF
      doc.save("ProblemOps_ROI_Report.pdf");

    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Chart Data
  const chartData = [
    { name: 'Current Cost', value: dysfunctionCost, fill: 'var(--destructive)' },
    { name: 'Projected Savings', value: projectedSavings, fill: 'var(--primary)' },
    { name: 'Investment', value: interventionCost, fill: 'var(--foreground)' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-primary flex items-center justify-center text-primary-foreground font-bold rounded-sm">
              P
            </div>
            <h1 className="text-xl font-bold tracking-tight">ProblemOps <span className="font-normal text-muted-foreground">ROI Calculator</span></h1>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex gap-2"
            onClick={generateReport}
            disabled={isGeneratingReport}
          >
            {isGeneratingReport ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isGeneratingReport ? "Generating..." : "Download Report"}
          </Button>
        </div>
      </header>

      <main className="container py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold mb-2">Team Parameters</h2>
              <p className="text-muted-foreground mb-6">Define the scale and investment of your team.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="team-size">Team Size</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="team-size" 
                      type="number" 
                      value={teamSize} 
                      onChange={(e) => setTeamSize(Number(e.target.value))}
                      className="pl-9 font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avg-salary">Avg. Annual Salary</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="avg-salary" 
                      type="number" 
                      value={avgSalary} 
                      onChange={(e) => setAvgSalary(Number(e.target.value))}
                      className="pl-9 font-mono"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="intervention-cost">Est. Intervention Cost</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="intervention-cost" 
                    type="number" 
                    value={interventionCost} 
                    onChange={(e) => setInterventionCost(Number(e.target.value))}
                    className="pl-9 font-mono"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Cost of workshops, consulting, or tooling.</p>
              </div>
            </section>

            <Separator />

            <section>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">The 7 Drivers</h2>
                  <p className="text-muted-foreground">Rate your team on the validated performance drivers.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setDrivers(INITIAL_DRIVERS)}
                  className="text-xs"
                >
                  Reset to Baseline
                </Button>
              </div>

              <div className="space-y-1">
                {drivers.map((driver) => (
                  <DriverSlider 
                    key={driver.id} 
                    driver={driver} 
                    onChange={(val) => handleDriverChange(driver.id, val)} 
                  />
                ))}
              </div>
            </section>

          </div>

          {/* Right Column: Results (Sticky) */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 space-y-6">
              
              {/* Primary Score Card */}
              <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative">
                <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium opacity-90">Team Readiness Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-4">
                    <span className="text-6xl md:text-7xl font-bold font-mono tracking-tighter">
                      {formatPercent(readinessScore)}
                    </span>
                    <div className="text-sm md:text-base opacity-90 max-w-[200px]">
                      {readinessScore >= 0.85 ? "Optimized Performance" : 
                       readinessScore >= 0.70 ? "Functional but Gapped" : 
                       readinessScore >= 0.50 ? "Dysfunctional State" : "Critical Crisis"}
                    </div>
                  </div>
                  <div className="mt-6 h-2 bg-black/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-white"
                      initial={{ width: 0 }}
                      animate={{ width: `${readinessScore * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard 
                  label="Annual Cost of Dysfunction" 
                  value={formatCurrency(dysfunctionCost)} 
                  subtext="Wasted payroll due to inefficiency"
                  icon={AlertTriangle}
                  variant="destructive"
                  delay={0.1}
                />
                <MetricCard 
                  label="Projected Annual Savings" 
                  value={formatCurrency(projectedSavings)} 
                  subtext="If improved to 85% readiness"
                  icon={TrendingUp}
                  variant="success"
                  delay={0.2}
                />
                <MetricCard 
                  label="Return on Investment" 
                  value={formatPercent(roi)} 
                  subtext={`Payback in ${paybackMonths.toFixed(1)} months`}
                  icon={BarChart3}
                  variant="default"
                  delay={0.3}
                />
                <MetricCard 
                  label="Total Team Investment" 
                  value={formatCurrency(teamSize * avgSalary)} 
                  subtext="Annual payroll burden"
                  icon={Users}
                  variant="default"
                  delay={0.4}
                />
              </div>

              {/* Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Impact Analysis</CardTitle>
                  <CardDescription>Comparing current waste vs. potential value recovery.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" width={120} tick={{fontSize: 12}} />
                      <RechartsTooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ borderRadius: '0px', border: '1px solid var(--border)', boxShadow: 'none' }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Call to Action */}
              <div className="bg-secondary p-6 rounded-lg border border-border flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="font-bold text-lg">Ready to fix this?</h3>
                  <p className="text-muted-foreground text-sm">Get the full diagnostic report and action plan.</p>
                </div>
                <Button size="lg" className="w-full md:w-auto gap-2">
                  Start Assessment <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
