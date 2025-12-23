import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, ArrowLeft, TrendingUp, AlertTriangle, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

// Types
type AssessmentResults = {
  drivers: Record<string, { name: string; score: number; weight: number }>;
  answers: Record<number, number>;
  readinessScore: number;
  dysfunctionCost: number;
  projectedSavings: number;
  roi: number;
  paybackMonths: number;
  teamSize: number;
  avgSalary: number;
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
  const [, navigate] = useLocation();
  const [results, setResults] = useState<AssessmentResults | null>(null);

  useEffect(() => {
    // Retrieve results from sessionStorage
    const storedResults = sessionStorage.getItem('assessmentResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    } else {
      // Redirect to home if no results found
      navigate('/');
    }
  }, [navigate]);

  if (!results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    // TODO: Implement slide-style PDF generation
    console.log('Generating slide-style PDF...');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onOpenAssessment={() => {}} />
      
      <main className="container py-8 lg:py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
            <h1 className="text-4xl font-bold">Assessment Results</h1>
            <p className="text-muted-foreground mt-2">
              Your comprehensive team readiness analysis
            </p>
          </div>
          <Button onClick={handleDownloadPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>

        {/* Executive Metrics */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Executive Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-l-4 border-l-destructive">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Annual Cost of Dysfunction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-destructive">
                    {formatCurrency(results.dysfunctionCost)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Wasted payroll due to inefficiency
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
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Projected Annual Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(results.projectedSavings)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    If improved to 85% readiness
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-l-4 border-l-foreground">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Return on Investment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {formatPercent(results.roi)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Payback in {results.paybackMonths.toFixed(1)} months
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Driver Summary */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Driver Performance Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(results.drivers).map(([id, driver]) => (
              <Card key={id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{driver.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold font-mono">
                      {driver.score.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">/ 7.0</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(driver.score / 7) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* Detailed Reasoning - Placeholder */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Detailed Analysis</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                Detailed reasoning for each driver will be displayed here based on your assessment answers.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-12" />

        {/* Team Narrative - Placeholder */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Your Team's Story</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                A qualitative narrative summarizing your team's current state will be displayed here.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-12" />

        {/* Action Plan - Placeholder */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recommended Training Plan</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                Chunked training recommendations based on the ProblemOps 4 C's framework will be displayed here.
              </p>
            </CardContent>
          </Card>
        </section>

      </main>
    </div>
  );
}
