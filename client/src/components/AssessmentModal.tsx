import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Survey Data ---

type Question = {
  id: number;
  text: string;
  constructId: string;
};

const QUESTIONS: Question[] = [
  // Trust
  { id: 1, text: "I can rely on my teammates to complete their work on time and to the expected quality.", constructId: "trust" },
  { id: 2, text: "My teammates are open and honest about challenges and setbacks.", constructId: "trust" },
  { id: 3, text: "I feel comfortable being vulnerable with my teammates about my own mistakes or weaknesses.", constructId: "trust" },
  { id: 4, text: "We have a genuine concern for each other’s well-being, not just our work contributions.", constructId: "trust" },
  { id: 5, text: "I believe my teammates have my best interests at heart.", constructId: "trust" },

  // Psychological Safety
  { id: 6, text: "On this team, it is safe to take a risk or propose a new idea.", constructId: "psych_safety" },
  { id: 7, text: "No one on this team would deliberately act in a way that undermines my efforts.", constructId: "psych_safety" },
  { id: 8, text: "Members of this team are able to bring up problems and tough issues.", constructId: "psych_safety" },
  { id: 9, text: "It is not held against me if I make a mistake on this team.", constructId: "psych_safety" },
  { id: 10, text: "I feel accepted and respected by my teammates.", constructId: "psych_safety" },

  // TMS
  { id: 11, text: "I have a good understanding of \"who knows what\" on our team.", constructId: "tms" },
  { id: 12, text: "When I need information on a specific topic, I know who on the team to ask.", constructId: "tms" },
  { id: 13, text: "We are effective at using each member’s unique knowledge and skills.", constructId: "tms" },
  { id: 14, text: "Our team has a shared understanding of each other’s areas of expertise.", constructId: "tms" },
  { id: 15, text: "We trust the specialized knowledge of our teammates, even if we don’t understand it ourselves.", constructId: "tms" },

  // Communication Quality
  { id: 16, text: "The communication on our team is clear and easy to understand.", constructId: "comm_quality" },
  { id: 17, text: "We use a shared language and avoid jargon that others might not understand.", constructId: "comm_quality" },
  { id: 18, text: "When we communicate, we focus on achieving mutual understanding, not just transmitting information.", constructId: "comm_quality" },
  { id: 19, text: "Our team’s communication is timely and accurate.", constructId: "comm_quality" },
  { id: 20, text: "We are skilled at listening to each other’s perspectives.", constructId: "comm_quality" },

  // Goal Clarity
  { id: 21, text: "I have a clear understanding of our team’s primary goals and objectives.", constructId: "goal_clarity" },
  { id: 22, text: "Our team’s goals are well-defined and measurable.", constructId: "goal_clarity" },
  { id: 23, text: "We have a shared understanding of what success looks like for our team.", constructId: "goal_clarity" },
  { id: 24, text: "My individual work directly contributes to the team’s goals.", constructId: "goal_clarity" },
  { id: 25, text: "Our team’s priorities are clear and consistent.", constructId: "goal_clarity" },

  // Coordination
  { id: 26, text: "Our team has smooth and efficient workflows.", constructId: "coordination" },
  { id: 27, text: "We are effective at managing handoffs and dependencies between team members.", constructId: "coordination" },
  { id: 28, text: "We can adapt our plans and processes quickly when circumstances change.", constructId: "coordination" },
  { id: 29, text: "We have clear roles and responsibilities within the team.", constructId: "coordination" },
  { id: 30, text: "Our team effectively synchronizes our efforts to achieve our goals.", constructId: "coordination" },

  // Team Cognition
  { id: 31, text: "Our team is effective at identifying the root cause of complex problems.", constructId: "team_cognition" },
  { id: 32, text: "We are skilled at generating creative and viable solutions to challenges.", constructId: "team_cognition" },
  { id: 33, text: "Our team has a structured approach to making important decisions.", constructId: "team_cognition" },
  { id: 34, text: "We learn from our mistakes and rarely repeat them.", constructId: "team_cognition" },
  { id: 35, text: "We are good at anticipating future problems before they arise.", constructId: "team_cognition" },
];

const SCALE_LABELS = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Somewhat Disagree" },
  { value: 4, label: "Neutral" },
  { value: 5, label: "Somewhat Agree" },
  { value: 6, label: "Agree" },
  { value: 7, label: "Strongly Agree" },
];

// --- Component ---

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (scores: Record<string, number>) => void;
}

export default function AssessmentModal({ isOpen, onClose, onComplete }: AssessmentModalProps) {
  const [currentStep, setCurrentStep] = useState(-1); // Start at -1 for company info
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [companyInfo, setCompanyInfo] = useState({ name: '', website: '', team: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Group questions into pages of 5 (one construct per page)
  const questionsPerPage = 5;
  const totalPages = Math.ceil(QUESTIONS.length / questionsPerPage);
  const currentQuestions = currentStep >= 0 ? QUESTIONS.slice(currentStep * questionsPerPage, (currentStep + 1) * questionsPerPage) : [];

  const progress = currentStep < 0 ? 0 : ((Object.keys(answers).length) / QUESTIONS.length) * 100;

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < 0) {
      // Moving from company info to first question page
      setCurrentStep(0);
      window.scrollTo(0, 0);
    } else if (currentStep < totalPages - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep >= 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Calculate scores per construct
    const constructSums: Record<string, number> = {};
    const constructCounts: Record<string, number> = {};

    QUESTIONS.forEach(q => {
      const score = answers[q.id] || 4; // Default to neutral if missed (shouldn't happen with validation)
      constructSums[q.constructId] = (constructSums[q.constructId] || 0) + score;
      constructCounts[q.constructId] = (constructCounts[q.constructId] || 0) + 1;
    });

    const finalScores: Record<string, number> = {};
    Object.keys(constructSums).forEach(key => {
      finalScores[key] = constructSums[key] / constructCounts[key];
    });

    // Simulate network delay for effect
    setTimeout(() => {
      onComplete(finalScores);
      setIsSubmitting(false);
      
      // Store company info in sessionStorage for Results page
      sessionStorage.setItem('companyInfo', JSON.stringify(companyInfo));
      
      onClose();
      // Reset state for next time
      setCurrentStep(-1);
      setAnswers({});
      setCompanyInfo({ name: '', website: '', team: '' });
    }, 1000);
  };

  const isPageComplete = currentStep < 0 
    ? companyInfo.name.trim() !== '' 
    : currentQuestions.every(q => answers[q.id] !== undefined);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full h-full sm:h-auto sm:max-h-[90vh] md:w-[90vw] md:max-w-[90vw] overflow-y-auto flex flex-col p-0 gap-0 rounded-none sm:rounded-lg">
        
        {/* Header */}
        <div className="p-6 border-b border-border bg-background sticky top-0 z-10">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex justify-between items-center">
              <span>Team Readiness Assessment</span>
              <span className="text-sm font-normal text-muted-foreground font-mono">
                Page {currentStep + 1} of {totalPages}
              </span>
            </DialogTitle>
            <DialogDescription>
              Rate your agreement with the following statements based on your team's behavior.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-right text-muted-foreground">
              {Math.round(progress)}% Complete
            </p>
          </div>
        </div>

        {/* Questions Body */}
        <div className="p-6 space-y-8 flex-1">
          {currentStep < 0 ? (
            /* Company Information Form */
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Before We Begin</h3>
                <p className="text-muted-foreground">
                  Tell us about your company so we can provide personalized insights.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name" className="text-base font-medium">
                    Company Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="company-name"
                    placeholder="e.g., Acme Corporation"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="text-base"
                  />
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
                    className="text-base"
                  />
                  <p className="text-xs text-muted-foreground">
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
                    className="text-base"
                  />
                </div>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {currentQuestions.map((q) => (
                  <div key={q.id} className="space-y-4">
                    <Label className="text-base font-medium leading-relaxed">
                      {q.id}. {q.text}
                    </Label>
                    <RadioGroup
                      value={answers[q.id]?.toString()}
                      onValueChange={(val) => handleAnswer(q.id, parseInt(val))}
                      className="flex flex-wrap gap-2 sm:gap-4"
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
                              flex flex-col items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 cursor-pointer transition-all
                              ${answers[q.id] === scale.value 
                                ? "border-primary bg-primary text-primary-foreground scale-110 shadow-md" 
                                : "border-muted hover:border-primary/50 bg-secondary text-muted-foreground"}
                            `}
                          >
                            <span className="text-sm font-bold">{scale.value}</span>
                          </Label>
                          <span className="text-[10px] text-muted-foreground text-center max-w-[60px] hidden sm:block">
                            {scale.value === 1 || scale.value === 7 || scale.value === 4 ? scale.label : ""}
                          </span>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-background sticky bottom-0 z-10 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep < 0 || isSubmitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isPageComplete || isSubmitting}
            className={currentStep === totalPages - 1 ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isSubmitting ? (
              "Calculating..."
            ) : currentStep === totalPages - 1 ? (
              <>Complete Assessment <CheckCircle2 className="ml-2 h-4 w-4" /></>
            ) : (
              <>Next Page <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
