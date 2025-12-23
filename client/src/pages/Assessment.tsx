import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const SCALE_LABELS = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "" },
  { value: 3, label: "" },
  { value: 4, label: "Neutral" },
  { value: 5, label: "" },
  { value: 6, label: "" },
  { value: 7, label: "Strongly Agree" },
];

const DRIVER_SECTIONS = [
  {
    id: "trust",
    title: "Trust",
    description: "Trust means team members can rely on each other to follow through on commitments and believe others have good intentions. When trust is strong, people feel safe depending on one another and working together becomes easier.",
    questions: [
      { id: 1, text: "Team members can rely on each other to complete their work." },
      { id: 2, text: "People on this team are comfortable being vulnerable with one another." },
      { id: 3, text: "Team members believe others have good intentions." },
      { id: 4, text: "We trust each other to follow through on commitments." },
      { id: 5, text: "Team members feel safe depending on one another." },
    ]
  },
  {
    id: "psych_safety",
    title: "Psychological Safety",
    description: "Psychological safety is about feeling comfortable taking risks and speaking up without fear of embarrassment or punishment. Teams with high psychological safety can discuss problems openly and learn from mistakes together.",
    questions: [
      { id: 6, text: "It is safe to take risks on this team." },
      { id: 7, text: "Team members feel comfortable speaking up about problems." },
      { id: 8, text: "No one on the team would deliberately undermine my efforts." },
      { id: 9, text: "People feel free to disagree without fear of negative consequences." },
      { id: 10, text: "Team members can bring up difficult issues without being shut down." },
    ]
  },
  {
    id: "tms",
    title: "Transactive Memory",
    description: "Transactive memory means knowing who on the team has specific knowledge or skills and where to find information. When this is strong, teams work more efficiently because everyone knows who to ask for help on different topics.",
    questions: [
      { id: 11, text: "Team members know who has specialized knowledge." },
      { id: 12, text: "We have a good understanding of each other's expertise." },
      { id: 13, text: "Team members know where to go for specific information." },
      { id: 14, text: "We effectively leverage distributed knowledge across the team." },
      { id: 15, text: "People know who to ask for help on different topics." },
    ]
  },
  {
    id: "comm_quality",
    title: "Communication Quality",
    description: "Communication quality is about how clear, timely, and effective information sharing is within the team. Good communication means the right people get the right information at the right time, not just lots of messages.",
    questions: [
      { id: 16, text: "Communication on this team is clear and easy to understand." },
      { id: 17, text: "Team members share information in a timely manner." },
      { id: 18, text: "We have shared understanding when we communicate." },
      { id: 19, text: "Important information reaches the right people quickly." },
      { id: 20, text: "Team communication is effective, not just frequent." },
    ]
  },
  {
    id: "goal_clarity",
    title: "Goal Clarity",
    description: "Goal clarity means everyone on the team understands what they're working toward and how their work contributes to team success. Clear goals help teams stay focused and make better decisions about how to spend their time.",
    questions: [
      { id: 21, text: "Team members have a clear understanding of our objectives." },
      { id: 22, text: "We all know what success looks like for this team." },
      { id: 23, text: "Our goals and priorities are well-defined." },
      { id: 24, text: "Everyone understands how their work contributes to team goals." },
      { id: 25, text: "We have shared clarity on what we're trying to achieve." },
    ]
  },
  {
    id: "coordination",
    title: "Coordination",
    description: "Coordination is how smoothly work flows between team members and how well the team manages handoffs and dependencies. Strong coordination means less wasted time waiting on others and fewer bottlenecks in the workflow.",
    questions: [
      { id: 26, text: "Work flows smoothly between team members." },
      { id: 27, text: "We effectively manage dependencies and handoffs." },
      { id: 28, text: "Team members coordinate their activities well." },
      { id: 29, text: "We handle workflow bottlenecks effectively." },
      { id: 30, text: "The team synchronizes work without excessive overhead." },
    ]
  },
  {
    id: "team_cognition",
    title: "Team Cognition",
    description: "Team cognition is the ability to think and solve problems effectively as a group, not just as individuals. Teams with strong cognition make better collective decisions and their combined problem-solving is stronger than any single member working alone.",
    questions: [
      { id: 31, text: "The team makes good collective decisions." },
      { id: 32, text: "We solve problems effectively as a group." },
      { id: 33, text: "Team members think well together." },
      { id: 34, text: "Our collective problem-solving is stronger than individual efforts." },
      { id: 35, text: "The team has strong shared mental models for our work." },
    ]
  },
];

export default function Assessment() {
  const [, setLocation] = useLocation();
  const createAssessment = trpc.assessment.create.useMutation();
  
  const [currentStep, setCurrentStep] = useState(0); // 0 = company info, 1-7 = driver sections
  const [openSection, setOpenSection] = useState<string>("trust");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [companyInfo, setCompanyInfo] = useState<{
    name: string;
    email: string;
    website: string;
    team: string;
    teamSize: string;
    avgSalary: string;
    trainingType: 'half-day' | 'full-day' | 'month-long' | 'not-sure';
  }>({ 
    name: '', 
    email: '',
    website: '', 
    team: '',
    teamSize: '10',
    avgSalary: '100000',
    trainingType: 'not-sure'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuestions = 35;
  const progress = (Object.keys(answers).length / totalQuestions) * 100;

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // Check if a section is complete
  const isSectionComplete = (section: typeof DRIVER_SECTIONS[0]) => {
    return section.questions.every(q => answers[q.id] !== undefined);
  };

  // Auto-advance to next section when current is complete
  useEffect(() => {
    if (currentStep > 0) {
      const currentSectionIndex = DRIVER_SECTIONS.findIndex(s => s.id === openSection);
      const currentSection = DRIVER_SECTIONS[currentSectionIndex];
      
      if (currentSection && isSectionComplete(currentSection)) {
        // Wait a moment, then open next section
        const nextSection = DRIVER_SECTIONS[currentSectionIndex + 1];
        if (nextSection) {
          setTimeout(() => {
            setOpenSection(nextSection.id);
          }, 300);
        }
      }
    }
  }, [answers, openSection, currentStep]);

  const handleStartAssessment = () => {
    if (companyInfo.name.trim() && companyInfo.teamSize.trim() && companyInfo.avgSalary.trim()) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async () => {
    const allAnswered = DRIVER_SECTIONS.every(section => isSectionComplete(section));
    
    if (!allAnswered) {
      alert('Please answer all questions before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const driverScores: Record<string, number> = {};
      DRIVER_SECTIONS.forEach(section => {
        const sectionQuestions = section.questions.map(q => q.id);
        const sectionAnswers = sectionQuestions.map(qId => answers[qId]).filter(Boolean);
        const avgScore = sectionAnswers.reduce((sum, score) => sum + score, 0) / sectionAnswers.length;
        driverScores[section.id] = avgScore;
      });
      
      const result = await createAssessment.mutateAsync({
        companyInfo,
        scores: driverScores,
        answers,
      });
      
      setLocation(result.redirectUrl);
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      alert('Failed to submit assessment. Please try again.');
      setIsSubmitting(false);
    }
  };

  const allSectionsComplete = DRIVER_SECTIONS.every(section => isSectionComplete(section));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 px-6 sticky top-0 z-20 shadow-lg">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">ProblemOps Team Readiness Assessment</h1>
              <p className="text-sm opacity-90 mt-1">
                {currentStep === 0 
                  ? "Tell us about your team" 
                  : "Evaluate your team across 7 key drivers"}
              </p>
            </div>
            {currentStep > 0 && (
              <div className="text-right">
                <div className="text-3xl font-bold">{Object.keys(answers).length}/{totalQuestions}</div>
                <div className="text-xs opacity-90">Completed</div>
              </div>
            )}
          </div>
          {currentStep > 0 && (
            <Progress value={progress} className="h-2 bg-primary-foreground/20" />
          )}
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto py-12 px-6 max-w-5xl">
        {currentStep === 0 ? (
          /* Company Information Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Common Region: Header section */}
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-4xl font-bold">Before We Begin</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Tell us about your company and team so we can provide personalized insights and calculate the financial impact of team effectiveness.
              </p>
            </div>
            
            {/* Common Region: Form container with visual grouping */}
            <div className="bg-card p-8 md:p-12 rounded-xl border border-border shadow-lg space-y-8">
              {/* Proximity: Company details grouped together */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold border-b border-border pb-2">Company Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="company-name" className="text-base font-medium">
                    Company Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="company-name"
                    placeholder="e.g., Acme Corporation"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="text-base h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-email" className="text-base font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="company-email"
                    type="email"
                    placeholder="e.g., john@acme.com"
                    value={companyInfo.email}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="text-base h-12"
                  />
                  <p className="text-sm text-muted-foreground">
                    We'll email you the results link and PDF report
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-website" className="text-base font-medium">
                    Company Website
                  </Label>
                  <Input
                    id="company-website"
                    type="url"
                    placeholder="e.g., https://acme.com"
                    value={companyInfo.website}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, website: e.target.value }))}
                    className="text-base h-12"
                  />
                  <p className="text-sm text-muted-foreground">
                    We'll analyze your website to provide more relevant insights
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="team-name" className="text-base font-medium">
                    Team/Department Name
                  </Label>
                  <Input
                    id="team-name"
                    placeholder="e.g., Product Engineering, Marketing"
                    value={companyInfo.team}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, team: e.target.value }))}
                    className="text-base h-12"
                  />
                </div>
              </div>

              {/* Proximity: Financial parameters grouped together */}
              <div className="space-y-6 pt-4">
                <h3 className="text-xl font-semibold border-b border-border pb-2">Team Parameters</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="team-size" className="text-base font-medium">
                      Team Size <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="team-size"
                      type="number"
                      placeholder="10"
                      value={companyInfo.teamSize}
                      onChange={(e) => setCompanyInfo(prev => ({ ...prev, teamSize: e.target.value }))}
                      className="text-base h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="avg-salary" className="text-base font-medium">
                      Avg. Annual Salary <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="avg-salary"
                      type="number"
                      placeholder="100000"
                      value={companyInfo.avgSalary}
                      onChange={(e) => setCompanyInfo(prev => ({ ...prev, avgSalary: e.target.value }))}
                      className="text-base h-12"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    What Kind of Corporate Training Do You Want? <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup 
                    value={companyInfo.trainingType}
                    onValueChange={(value) => setCompanyInfo(prev => ({ ...prev, trainingType: value as 'half-day' | 'full-day' | 'month-long' | 'not-sure' }))}
                    className="space-y-3"
                  >
                    <div className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="half-day" id="half-day" className="mt-1" />
                      <Label htmlFor="half-day" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Half Day Workshop</div>
                        <div className="text-sm text-muted-foreground">$2,000 - Focus on your #1 critical area</div>
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="full-day" id="full-day" className="mt-1" />
                      <Label htmlFor="full-day" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Full Day Workshop</div>
                        <div className="text-sm text-muted-foreground">$3,500 - Focus on your top 2 critical areas</div>
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="month-long" id="month-long" className="mt-1" />
                      <Label htmlFor="month-long" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Month-Long Engagement</div>
                        <div className="text-sm text-muted-foreground">$25,000 - Comprehensive training across all areas</div>
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="not-sure" id="not-sure" className="mt-1" />
                      <Label htmlFor="not-sure" className="flex-1 cursor-pointer">
                        <div className="font-semibold">I'm Not Sure Yet</div>
                        <div className="text-sm text-muted-foreground">See all options with comparative ROI analysis</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Continuity: Clear call-to-action */}
              <div className="pt-6">
                <Button
                  size="lg"
                  onClick={handleStartAssessment}
                  disabled={!companyInfo.name.trim() || !companyInfo.teamSize.trim() || !companyInfo.avgSalary.trim()}
                  className="w-full h-14 text-lg"
                >
                  Start Assessment →
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Assessment Accordions */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Common Region: Accordion container */}
            <Accordion 
              type="single" 
              value={openSection} 
              onValueChange={setOpenSection}
              className="space-y-4"
            >
              {DRIVER_SECTIONS.map((section, index) => {
                const isComplete = isSectionComplete(section);
                
                return (
                  <AccordionItem 
                    key={section.id} 
                    value={section.id}
                    className="bg-card border border-border rounded-lg shadow-sm overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-5 hover:bg-accent/50 transition-colors [&[data-state=open]]:bg-accent/30">
                      <div className="flex items-center gap-4 w-full">
                        {/* Status Icon - subtle, secondary visual element */}
                        {isComplete ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground/40 flex-shrink-0" />
                        )}
                        
                        {/* Title - primary focus with strong hierarchy */}
                        <div className="flex items-center gap-3 flex-1 text-left">
                          <span className="text-sm font-medium text-muted-foreground">
                            {index + 1}
                          </span>
                          <span className="text-lg font-bold">
                            {section.title}
                          </span>
                        </div>
                        
                        {/* Progress indicator */}
                        <span className="text-sm text-muted-foreground">
                          {section.questions.filter(q => answers[q.id] !== undefined).length}/{section.questions.length}
                        </span>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="px-6 pb-6 pt-2">
                      {/* Proximity: Context box close to questions it describes */}
                      <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg mb-8">
                        <p className="text-sm leading-relaxed text-foreground/90">
                          {section.description}
                        </p>
                      </div>
                      
                      {/* Grouping: Questions visually separated but clearly related */}
                      <div className="space-y-6">
                        {section.questions.map((q) => (
                          <div key={q.id} className="space-y-4 p-5 bg-background rounded-lg border border-border/50">
                            {/* Hierarchy: Question number and text */}
                            <Label className="text-base font-medium leading-relaxed block">
                              <span className="text-muted-foreground mr-2">{q.id}.</span>
                              {q.text}
                            </Label>
                            
                            {/* Grouping: Scale buttons unified as single control */}
                            <RadioGroup
                              value={answers[q.id]?.toString()}
                              onValueChange={(val) => handleAnswer(q.id, parseInt(val))}
                              className="flex flex-wrap gap-2 sm:gap-3 justify-center pt-2"
                            >
                              {SCALE_LABELS.map((scale) => (
                                <div key={scale.value} className="flex flex-col items-center gap-2">
                                  <RadioGroupItem
                                    value={scale.value.toString()}
                                    id={`q${q.id}-${scale.value}`}
                                    className="peer sr-only"
                                  />
                                  <Label
                                    htmlFor={`q${q.id}-${scale.value}`}
                                    className={`
                                      flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 cursor-pointer transition-all
                                      ${answers[q.id] === scale.value 
                                        ? "border-primary bg-primary text-primary-foreground scale-110 shadow-lg font-bold" 
                                        : "border-muted-foreground/30 hover:border-primary/50 bg-card text-muted-foreground hover:scale-105"}
                                    `}
                                  >
                                    <span className="text-base font-semibold">{scale.value}</span>
                                  </Label>
                                  {(scale.value === 1 || scale.value === 4 || scale.value === 7) && (
                                    <span className="text-[10px] text-muted-foreground text-center max-w-[70px] hidden sm:block">
                                      {scale.label}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>

            {/* Continuity: Clear completion action */}
            {allSectionsComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 dark:bg-green-950/20 border-2 border-green-600 rounded-lg p-8 text-center space-y-4"
              >
                <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
                <h3 className="text-2xl font-bold">Assessment Complete!</h3>
                <p className="text-muted-foreground">
                  You've answered all 35 questions. Click below to view your personalized results and ROI analysis.
                </p>
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="h-14 px-8 text-lg bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Results...
                    </>
                  ) : (
                    <>
                      View Results →
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
