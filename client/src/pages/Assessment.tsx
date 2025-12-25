import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LoadingScreen, type LoadingStatus } from "@/components/LoadingScreen";
import { trpc } from "@/lib/trpc";
import { TRAINING_OPTIONS } from "@/lib/trainingRecommendations";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Circle, Loader2, Keyboard, Github } from "lucide-react";
import { motion } from "framer-motion";
import { SkipLink } from "@/components/SkipLink";
import { KeyboardShortcutsDialog } from "@/components/KeyboardShortcutsDialog";
import { ProgressStepper } from "@/components/ProgressStepper";
import { ThemeToggle } from "@/components/ThemeToggle";
import UserGuideButton from "@/components/UserGuideButton";

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

// Get all question IDs in order
const ALL_QUESTION_IDS = DRIVER_SECTIONS.flatMap(s => s.questions.map(q => q.id));

export default function Assessment() {
  const navigate = useNavigate();
  const createAssessment = trpc.assessment.create.useMutation({
    onSuccess: (data) => {
      console.log('!!! MUTATION ON SUCCESS !!!', data);
    },
    onError: (error) => {
      console.error('!!! MUTATION ON ERROR !!!', error);
    },
  });
  
  const [currentStep, setCurrentStep] = useState(0); // 0 = company info, 1 = assessment
  const [openSections, setOpenSections] = useState<string[]>(["trust"]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [focusedQuestionId, setFocusedQuestionId] = useState<number | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<{
    name: string;
    website: string;
    team: string;
    teamSize: string;
    avgSalary: string;
    trainingType: 'half-day' | 'full-day' | 'month-long' | 'not-sure';
  }>({
    name: '', 
    website: '', 
    team: '',
    teamSize: '10',
    avgSalary: '100000',
    trainingType: 'not-sure'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus | null>(null);
  const [loadingError, setLoadingError] = useState<string | undefined>(undefined);
  const [pendingSubmitData, setPendingSubmitData] = useState<{
    companyInfo: typeof companyInfo;
    driverScores: Record<string, number>;
    answers: Record<number, number>;
  } | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Refs for focus management
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const mainContentRef = useRef<HTMLElement>(null);
  const companyNameRef = useRef<HTMLInputElement>(null);
  
  // Aria live region for announcements
  const [announcement, setAnnouncement] = useState("");
  const [errorAnnouncement, setErrorAnnouncement] = useState("");

  const totalQuestions = 35;
  const progress = (Object.keys(answers).length / totalQuestions) * 100;

  // Scroll to top and focus on "Tell us about your team" text
  useEffect(() => {
    // Scroll to absolute top first
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Then focus on the "Tell us about your team" description
    setTimeout(() => {
      const descElement = document.getElementById('tell-us-about-team');
      if (descElement) {
        descElement.focus();
      }
    }, 100);
  }, []);

  // Announce progress changes
  useEffect(() => {
    const answered = Object.keys(answers).length;
    if (answered > 0 && answered % 5 === 0) {
      setAnnouncement(`${answered} of ${totalQuestions} questions completed`);
    }
  }, [answers]);

  const handleAnswer = useCallback((questionId: number, value: number, autoAdvance = true) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    if (autoAdvance) {
      // Find next unanswered question
      const currentIndex = ALL_QUESTION_IDS.indexOf(questionId);
      const nextQuestionId = ALL_QUESTION_IDS[currentIndex + 1];
      
      if (nextQuestionId) {
        // Find which section this question belongs to
        const nextSection = DRIVER_SECTIONS.find(s => 
          s.questions.some(q => q.id === nextQuestionId)
        );
        
        if (nextSection && !openSections.includes(nextSection.id)) {
          setOpenSections(prev => [...prev, nextSection.id]);
        }
        
        // Focus next question after a brief delay for DOM update
        setTimeout(() => {
          setFocusedQuestionId(nextQuestionId);
          const nextRef = questionRefs.current[nextQuestionId];
          if (nextRef) {
            nextRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const firstButton = nextRef.querySelector('button[role="radio"]') as HTMLElement;
            firstButton?.focus();
          }
        }, 100);
      } else {
        // All questions answered, focus submit button
        setTimeout(() => {
          submitButtonRef.current?.focus();
          setAnnouncement("Assessment complete! Press Enter to view results.");
        }, 100);
      }
    }
  }, [openSections]);

  // Check if a section is complete
  const isSectionComplete = (section: typeof DRIVER_SECTIONS[0]) => {
    return section.questions.every(q => answers[q.id] !== undefined);
  };

  // Helper: Find which section a question belongs to
  const findQuestionSection = (questionId: number) => {
    return DRIVER_SECTIONS.find(s => s.questions.some(q => q.id === questionId));
  };

  // Helper: Scroll to section with banner offset
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(`section-${sectionId}`);
    const banner = document.querySelector('header');
    const bannerHeight = banner?.offsetHeight || 80;
    
    if (section) {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrollPosition = sectionTop - bannerHeight - 16; // 16px extra padding
      
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  // Helper: Navigate to a specific rating option
  const focusRatingOption = (questionId: number, ratingValue: number) => {
    const element = document.getElementById(`q${questionId}-${ratingValue}`);
    if (element) {
      element.focus();
      // Don't use scrollIntoView here - let scrollToSection handle it
    }
  };

  // Handle TAB/SHIFT+TAB navigation for rating options
  const handleRatingKeyDown = (e: React.KeyboardEvent, questionId: number, ratingValue: number) => {
    // Handle ENTER key to select rating
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAnswer(questionId, ratingValue, true);
      return;
    }

    // Handle TAB navigation
    if (e.key === 'Tab') {
      const isShiftTab = e.shiftKey;
      
      if (isShiftTab) {
        // SHIFT+TAB: Navigate backward
        if (ratingValue === 1) {
          // Jump to rating 7 of previous question
          e.preventDefault();
          const currentIndex = ALL_QUESTION_IDS.indexOf(questionId);
          const prevQuestionId = ALL_QUESTION_IDS[currentIndex - 1];
          
          if (prevQuestionId) {
            const prevSection = findQuestionSection(prevQuestionId);
            if (prevSection && !openSections.includes(prevSection.id)) {
              setOpenSections(prev => [...prev, prevSection.id]);
              // Scroll to previous section with banner offset
              setTimeout(() => {
                scrollToSection(prevSection.id);
                setTimeout(() => focusRatingOption(prevQuestionId, 7), 100);
              }, 100);
            } else {
              // Same section, just focus previous question
              setTimeout(() => focusRatingOption(prevQuestionId, 7), 100);
            }
          }
        }
        // Otherwise, let native TAB handle navigation to previous rating
      } else {
        // TAB: Navigate forward
        if (ratingValue === 7) {
          // Jump to rating 1 of next question
          e.preventDefault();
          const currentIndex = ALL_QUESTION_IDS.indexOf(questionId);
          const nextQuestionId = ALL_QUESTION_IDS[currentIndex + 1];
          
          if (nextQuestionId) {
            const nextSection = findQuestionSection(nextQuestionId);
            if (nextSection && !openSections.includes(nextSection.id)) {
              setOpenSections(prev => [...prev, nextSection.id]);
              // Scroll to new section with banner offset
              setTimeout(() => {
                scrollToSection(nextSection.id);
                setTimeout(() => focusRatingOption(nextQuestionId, 1), 100);
              }, 100);
            } else {
              // Same section, just focus next question
              setTimeout(() => focusRatingOption(nextQuestionId, 1), 100);
            }
          } else {
            // Last question, last rating - focus submit button
            setTimeout(() => submitButtonRef.current?.focus(), 100);
          }
        }
        // Otherwise, let native TAB handle navigation to next rating
      }
    }
  };

  // Auto-advance to next section when current is complete
  useEffect(() => {
    if (currentStep > 0) {
      const currentSectionIndex = DRIVER_SECTIONS.findIndex(s => openSections.includes(s.id));
      const currentSection = DRIVER_SECTIONS[currentSectionIndex];
      
      if (currentSection && isSectionComplete(currentSection)) {
        const nextSection = DRIVER_SECTIONS[currentSectionIndex + 1];
        if (nextSection) {
          setTimeout(() => {
            setOpenSections(prev => [...prev, nextSection.id]);
          }, 300);
        }
      }
    }
  }, [answers, openSections, currentStep]);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Enter key for form submission (works from any input)
      if (e.key === 'Enter' && currentStep === 0) {
        const target = e.target as HTMLElement;
        // Don't interfere with buttons or radio buttons
        if (target.tagName !== 'BUTTON' && target.getAttribute('role') !== 'radio') {
          e.preventDefault();
          handleStartAssessment();
          return;
        }
      }
      
      // Don't handle other shortcuts when typing in text inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' && target.getAttribute('type') !== 'radio') {
        return;
      }

      // ? - Show keyboard shortcuts
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowShortcuts(true);
        return;
      }

      // Escape - Close dialogs
      if (e.key === 'Escape') {
        setShowShortcuts(false);
        return;
      }

      // Assessment-specific shortcuts (only when in assessment mode)
      if (currentStep === 1) {
        // Number keys 1-7 for rating
        if (/^[1-7]$/.test(e.key) && focusedQuestionId) {
          e.preventDefault();
          const rating = parseInt(e.key);
          handleAnswer(focusedQuestionId, rating, true);
          return;
        }

        // N or J - Next question
        if ((e.key === 'n' || e.key === 'j') && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          navigateQuestion('next');
          return;
        }

        // P or K - Previous question
        if ((e.key === 'p' || e.key === 'k') && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          navigateQuestion('prev');
          return;
        }

        // Ctrl+Enter - Submit
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          if (allSectionsComplete) {
            handleSubmit();
          }
          return;
        }

        // Ctrl+Shift+R - Jump to Results button
        if (e.key === 'r' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
          e.preventDefault();
          submitButtonRef.current?.focus();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, focusedQuestionId, answers]);

  const navigateQuestion = (direction: 'next' | 'prev') => {
    const currentIndex = focusedQuestionId 
      ? ALL_QUESTION_IDS.indexOf(focusedQuestionId)
      : -1;
    
    let targetIndex: number;
    if (direction === 'next') {
      targetIndex = currentIndex < ALL_QUESTION_IDS.length - 1 ? currentIndex + 1 : currentIndex;
    } else {
      targetIndex = currentIndex > 0 ? currentIndex - 1 : 0;
    }
    
    const targetQuestionId = ALL_QUESTION_IDS[targetIndex];
    
    // Find which section this question belongs to
    const targetSection = DRIVER_SECTIONS.find(s => 
      s.questions.some(q => q.id === targetQuestionId)
    );
    
    if (targetSection && !openSections.includes(targetSection.id)) {
      setOpenSections(prev => [...prev, targetSection.id]);
    }
    
    setTimeout(() => {
      setFocusedQuestionId(targetQuestionId);
      const targetRef = questionRefs.current[targetQuestionId];
      if (targetRef) {
        targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstButton = targetRef.querySelector('button[role="radio"]') as HTMLElement;
        firstButton?.focus();
      }
    }, 100);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!companyInfo.name.trim()) {
      newErrors.companyName = "Company Name is required. Please enter your company name.";
    }
    
    if (!companyInfo.teamSize.trim() || parseInt(companyInfo.teamSize) < 1) {
      newErrors.teamSize = "Team Size is required. Please enter the number of team members (minimum 1).";
    }
    
    if (!companyInfo.avgSalary.trim() || parseInt(companyInfo.avgSalary) < 1) {
      newErrors.avgSalary = "Average Salary is required. Please enter the average annual salary.";
    }
    
    setFormErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      const errorCount = Object.keys(newErrors).length;
      const errorMessages = Object.values(newErrors).join('. ');
      setErrorAnnouncement(`Form has ${errorCount} error${errorCount > 1 ? 's' : ''}. ${errorMessages}`);
      return false;
    }
    
    return true;
  };
  
  const handleStartAssessment = () => {
    if (validateForm()) {
      setCurrentStep(1);
      setFormErrors({});
      setErrorAnnouncement('');
      // Announce assessment start without auto-focus
      setTimeout(() => {
        setAnnouncement("Assessment started. Use number keys 1-7 to rate each question. Press N for next, P for previous.");
      }, 500);
    }
  };

  // Minimum time to show loading screen (in ms) for better UX
  const MINIMUM_LOADING_TIME = 2000;

  // Perform the actual API submission
  const performSubmission = useCallback(async (submitData: {
    companyInfo: typeof companyInfo;
    driverScores: Record<string, number>;
    answers: Record<number, number>;
  }) => {
    const startTime = Date.now();
    
    try {
      console.log('=== SUBMITTING ASSESSMENT ===');
      console.log('Company Info:', submitData.companyInfo);
      console.log('Driver Scores:', submitData.driverScores);
      console.log('Answers count:', Object.keys(submitData.answers).length);
      
      const result = await Promise.race([
        createAssessment.mutateAsync({
          companyInfo: submitData.companyInfo,
          scores: submitData.driverScores,
          answers: submitData.answers,
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout after 60 seconds')), 60000)
        )
      ]);
      
      console.log('API Response:', result);
      
      if (!result) {
        throw new Error('No response from server');
      }
      
      if (result.redirectUrl) {
        console.log('Navigating to:', result.redirectUrl);
        
        // Ensure minimum loading time for better UX
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MINIMUM_LOADING_TIME - elapsedTime);
        
        await new Promise(resolve => setTimeout(resolve, remainingTime));
        
        setLoadingStatus('success');
        // Brief delay to show success state before navigation
        setTimeout(() => {
          navigate(result.redirectUrl);
        }, 500);
      } else {
        throw new Error('Invalid API response: missing redirectUrl');
      }
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Ensure minimum loading time even for errors
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MINIMUM_LOADING_TIME - elapsedTime);
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      setLoadingError(errorMessage);
      setLoadingStatus('error');
      setAnnouncement(`Error: ${errorMessage}`);
    }
  }, [createAssessment, navigate, setAnnouncement]);

  // Handle retry from loading screen
  const handleRetry = useCallback(() => {
    if (pendingSubmitData) {
      setLoadingStatus('loading');
      setLoadingError(undefined);
      performSubmission(pendingSubmitData);
    }
  }, [pendingSubmitData, performSubmission]);

  const handleSubmit = async () => {
    console.log('!!! HANDLE SUBMIT CALLED !!!');
    console.log('Current URL:', window.location.href);
    const allAnswered = DRIVER_SECTIONS.every(section => isSectionComplete(section));
    
    if (!allAnswered) {
      setAnnouncement('Please answer all questions before submitting.');
      return;
    }
    
    // Calculate driver scores
    const driverScores: Record<string, number> = {};
    DRIVER_SECTIONS.forEach(section => {
      const sectionQuestions = section.questions.map(q => q.id);
      const sectionAnswers = sectionQuestions.map(qId => answers[qId]).filter(Boolean);
      const avgScore = sectionAnswers.reduce((sum, score) => sum + score, 0) / sectionAnswers.length;
      driverScores[section.id] = avgScore;
    });
    
    // Store data for potential retry
    const submitData = { companyInfo, driverScores, answers };
    setPendingSubmitData(submitData);
    
    // Show loading screen
    console.log('=== SHOWING LOADING SCREEN ===');
    setIsSubmitting(true);
    setLoadingStatus('loading');
    setLoadingError(undefined);
    setAnnouncement('Generating your results...');
    
    // Wait for React to render the loading screen before starting submission
    // This ensures the user sees the loading animation
    console.log('Waiting 100ms for loading screen to render...');
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Starting submission...');
    
    // Perform submission
    performSubmission(submitData);
  };

  const allSectionsComplete = DRIVER_SECTIONS.every(section => isSectionComplete(section));

  // Handle question focus for keyboard navigation
  const handleQuestionFocus = (questionId: number) => {
    setFocusedQuestionId(questionId);
  };

  return (
    <>
      {/* Loading Screen Overlay */}
      {console.log('Rendering check - loadingStatus:', loadingStatus)}
      <AnimatePresence>
        {loadingStatus && (
          <LoadingScreen
            status={loadingStatus}
            onRetry={handleRetry}
            errorMessage={loadingError}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Skip Link for accessibility */}
        <SkipLink targetId="main-content" />
      
      {/* Aria Live Region for announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
      
      {/* Aria Live Region for errors */}
      <div 
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
        className="sr-only"
      >
        {errorAnnouncement}
      </div>

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog 
        open={showShortcuts} 
        onOpenChange={setShowShortcuts}
        context={currentStep === 0 ? 'form' : 'assessment'}
      />

      {/* Header */}
      <header role="banner" className="bg-primary text-primary-foreground sticky top-0 z-20 shadow-lg">
        {/* Top Banner Row */}
        <div className="container mx-auto max-w-5xl px-5 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Left */}
            <a 
              href="https://problemops.com" 
              aria-label="Return to ProblemOps homepage"
              className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#64563A] rounded"
            >
              <img 
                src="/problemops-logo.svg" 
                alt="ProblemOps" 
                className="h-8 md:h-10 hover:opacity-90 transition-opacity"
              />
            </a>
            
            {/* Progress Stepper - Center (hidden on mobile) */}
            <ProgressStepper 
              currentStep={currentStep === 0 ? 'begin' : 'assess'}
              completedSteps={currentStep > 0 ? ['begin'] : []}
              className="hidden md:flex"
            />
            
            {/* Action Buttons - Right (always visible) */}
            <div className="flex items-center gap-1 md:gap-2">
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
                onClick={() => setShowShortcuts(true)}
                className="p-2 rounded-lg text-primary-foreground bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                aria-label="Show keyboard shortcuts (press ? key)"
                title="Keyboard shortcuts (?)"
              >
                <Keyboard className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Mobile: Stacked Progress Stepper */}
          <div className="md:hidden mt-4 flex justify-center">
            <ProgressStepper 
              currentStep={currentStep === 0 ? 'begin' : 'assess'}
              completedSteps={currentStep > 0 ? ['begin'] : []}
            />
          </div>
        </div>
        
        {/* Question-Level Progress Bar (only on Assess page) */}
        {currentStep > 0 && (
          <div className="bg-primary/80 py-3">
            <div className="container mx-auto max-w-5xl px-5">
              <Progress 
                value={progress} 
                className="h-2 bg-primary-foreground/20" 
                indicatorClassName="bg-white"
                aria-label={`Progress: ${Object.keys(answers).length} of ${totalQuestions} questions completed`}
              />
              <div className="text-center text-white text-sm mt-2">
                {Object.keys(answers).length} of {totalQuestions} questions completed
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <main 
        role="main"
        id="main-content" 
        ref={mainContentRef}
        className="container mx-auto py-12 px-6 max-w-5xl"
        tabIndex={-1}
      >
        {currentStep === 0 ? (
          /* Company Information Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Common Region: Header section */}
            <div className="mb-12 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold" id="page-title">Team Cross-Functional Efficiency Readiness Assessment</h1>
              <p className="text-muted-foreground text-lg" id="tell-us-about-team" tabIndex={-1}>
                Tell us about your company and team so we can provide personalized insights and calculate the financial impact of team effectiveness.
              </p>
              <p className="text-sm text-muted-foreground">
                Press <kbd className="px-1.5 py-0.5 text-xs bg-muted border border-border rounded">?</kbd> for keyboard shortcuts
              </p>
            </div>
            
            {/* Common Region: Form container with visual grouping */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleStartAssessment(); }}
              className="bg-card p-8 md:p-12 rounded-xl border border-border shadow-lg space-y-8"
            >
              {/* Proximity: Company details grouped together */}
              <fieldset className="space-y-6">
                <legend className="sr-only">Company Information</legend>
                <h2 className="text-2xl font-semibold border-b border-border pb-3 w-full">Company Information</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="company-name" className="text-base font-medium text-foreground">
                    Company Name <span className="text-destructive" aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                  </Label>
                  <Input
                    ref={companyNameRef}
                    id="company-name"
                    placeholder="e.g., Acme Corporation"
                    value={companyInfo.name}
                    onChange={(e) => {
                      setCompanyInfo(prev => ({ ...prev, name: e.target.value }));
                      if (formErrors.companyName) {
                        setFormErrors(prev => ({ ...prev, companyName: '' }));
                      }
                    }}
                    className={`text-base h-12 focus:ring-2 focus:ring-ring focus:ring-offset-2 ${formErrors.companyName ? 'border-red-600 border-2' : ''}`}
                    required
                    aria-required="true"
                    aria-invalid={!!formErrors.companyName}
                    aria-describedby={formErrors.companyName ? "company-name-error" : undefined}
                  />
                  {formErrors.companyName && (
                    <p className="text-sm text-red-600 flex items-center gap-1" id="company-name-error">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formErrors.companyName}
                    </p>
                  )}
                </div>
                

                <div className="space-y-2">
                  <Label htmlFor="company-website" className="text-base font-medium text-foreground">
                    Company Website
                  </Label>
                  <Input
                    id="company-website"
                    type="url"
                    placeholder="e.g., https://acme.com"
                    value={companyInfo.website}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, website: e.target.value }))}
                    className="text-base h-12 focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    We'll analyze your website to provide more relevant insights
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="team-name" className="text-base font-medium text-foreground">
                    Team/Department Name
                  </Label>
                  <Input
                    id="team-name"
                    placeholder="e.g., Product Engineering, Marketing"
                    value={companyInfo.team}
                    onChange={(e) => setCompanyInfo(prev => ({ ...prev, team: e.target.value }))}
                    className="text-base h-12 focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>
              </fieldset>

              {/* Proximity: Financial parameters grouped together */}
              <fieldset className="space-y-6 pt-4">
                <legend className="sr-only">Team Parameters</legend>
                <h2 className="text-2xl font-semibold border-b border-border pb-3 w-full">Team Parameters</h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="team-size" className="text-base font-medium text-foreground">
                      Team Size <span className="text-destructive" aria-hidden="true">*</span>
                      <span className="sr-only">(required)</span>
                    </Label>
                    <Input
                      id="team-size"
                      type="number"
                      placeholder="10"
                      value={companyInfo.teamSize}
                      onChange={(e) => {
                        setCompanyInfo(prev => ({ ...prev, teamSize: e.target.value }));
                        if (formErrors.teamSize) {
                          setFormErrors(prev => ({ ...prev, teamSize: '' }));
                        }
                      }}
                      className={`text-base h-12 focus:ring-2 focus:ring-ring focus:ring-offset-2 ${formErrors.teamSize ? 'border-red-600 border-2' : ''}`}
                      required
                      aria-required="true"
                      aria-invalid={!!formErrors.teamSize}
                      aria-describedby={formErrors.teamSize ? "team-size-error" : undefined}
                      min="1"
                    />
                    {formErrors.teamSize && (
                      <p className="text-sm text-red-600 flex items-center gap-1" id="team-size-error">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formErrors.teamSize}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="avg-salary" className="text-base font-medium text-foreground">
                      Avg. Annual Salary <span className="text-destructive" aria-hidden="true">*</span>
                      <span className="sr-only">(required)</span>
                    </Label>
                    <Input
                      id="avg-salary"
                      type="number"
                      placeholder="100000"
                      value={companyInfo.avgSalary}
                      onChange={(e) => {
                        setCompanyInfo(prev => ({ ...prev, avgSalary: e.target.value }));
                        if (formErrors.avgSalary) {
                          setFormErrors(prev => ({ ...prev, avgSalary: '' }));
                        }
                      }}
                      className={`text-base h-12 focus:ring-2 focus:ring-ring focus:ring-offset-2 ${formErrors.avgSalary ? 'border-red-600 border-2' : ''}`}
                      required
                      aria-required="true"
                      aria-invalid={!!formErrors.avgSalary}
                      aria-describedby={formErrors.avgSalary ? "avg-salary-error" : undefined}
                      min="0"
                    />
                    {formErrors.avgSalary && (
                      <p className="text-sm text-red-600 flex items-center gap-1" id="avg-salary-error">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formErrors.avgSalary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label id="training-type-label" className="text-base font-medium text-foreground">
                    What Kind of Corporate Training Do You Want? <span className="text-destructive" aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                  </Label>
                  <RadioGroup 
                    value={companyInfo.trainingType}
                    onValueChange={(value) => setCompanyInfo(prev => ({ ...prev, trainingType: value as 'half-day' | 'full-day' | 'month-long' | 'not-sure' }))}
                    className="space-y-3"
                    aria-labelledby="training-type-label"
                  >
                    {/* Not Sure Yet - First */}
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-accent/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-colors cursor-pointer">
                      <RadioGroupItem value="not-sure" id="not-sure" />
                      <Label htmlFor="not-sure" className="flex-1 cursor-pointer flex flex-col gap-1 text-left items-start">
                        <div className="font-semibold text-black">I'm Not Sure Yet</div>
                        <div className="text-sm text-muted-foreground font-normal">See all options with comparative ROI analysis</div>
                      </Label>
                    </div>
                    {/* Half Day */}
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-accent/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-colors cursor-pointer">
                      <RadioGroupItem value="half-day" id="half-day" />
                      <Label htmlFor="half-day" className="flex-1 cursor-pointer flex flex-col gap-1 text-left items-start">
                        <div className="font-semibold text-black">Half Day Workshop</div>
                        <div className="text-sm text-muted-foreground font-normal">${TRAINING_OPTIONS['half-day'].cost.toLocaleString()} ({TRAINING_OPTIONS['half-day'].duration}) - Focus on your #1 critical area</div>
                      </Label>
                    </div>
                    {/* Full Day */}
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-accent/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-colors cursor-pointer">
                      <RadioGroupItem value="full-day" id="full-day" />
                      <Label htmlFor="full-day" className="flex-1 cursor-pointer flex flex-col gap-1 text-left items-start">
                        <div className="font-semibold text-black">Full Day Workshop</div>
                        <div className="text-sm text-muted-foreground font-normal">${TRAINING_OPTIONS['full-day'].cost.toLocaleString()} ({TRAINING_OPTIONS['full-day'].duration}) - Focus on your top 2 critical areas</div>
                      </Label>
                    </div>
                    {/* Month-Long */}
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-accent/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-colors cursor-pointer">
                      <RadioGroupItem value="month-long" id="month-long" />
                      <Label htmlFor="month-long" className="flex-1 cursor-pointer flex flex-col gap-1 text-left items-start">
                        <div className="font-semibold text-black">Month-Long Engagement</div>
                        <div className="text-sm text-muted-foreground font-normal">${TRAINING_OPTIONS['month-long'].cost.toLocaleString()} ({TRAINING_OPTIONS['month-long'].duration}) - Comprehensive training across all areas</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </fieldset>

              {/* Continuity: Clear call-to-action */}
              <div className="pt-6">
                <Button
                  type="submit"
                  size="lg"
                  disabled={!companyInfo.name.trim() || !companyInfo.teamSize.trim() || !companyInfo.avgSalary.trim()}
                  className="w-full h-14 text-lg focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  Start Assessment →
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Press <kbd className="px-1.5 py-0.5 text-xs bg-muted border border-border rounded">Enter</kbd> to continue
                </p>
              </div>
            </form>
          </motion.div>
        ) : (
          /* Assessment Accordions */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Page title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-8" id="page-title">Tell Us About Your Team</h1>
            
            {/* Keyboard navigation hint */}
            <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                <strong>Quick tip:</strong> Press number keys <kbd className="px-1.5 py-0.5 text-xs bg-background border border-border rounded">1</kbd>-<kbd className="px-1.5 py-0.5 text-xs bg-background border border-border rounded">7</kbd> to rate questions instantly. 
                Use <kbd className="px-1.5 py-0.5 text-xs bg-background border border-border rounded">N</kbd>/<kbd className="px-1.5 py-0.5 text-xs bg-background border border-border rounded">P</kbd> to navigate. 
                Press <kbd className="px-1.5 py-0.5 text-xs bg-background border border-border rounded">?</kbd> for all shortcuts.
              </p>
            </div>

            {/* Common Region: Accordion container */}
            <Accordion 
              type="multiple" 
              value={openSections} 
              onValueChange={setOpenSections}
              className="space-y-4"
            >
              {DRIVER_SECTIONS.map((section, index) => {
                const isComplete = isSectionComplete(section);
                
                return (
                  <AccordionItem 
                    key={section.id} 
                    value={section.id}
                    id={`section-${section.id}`}
                    className="bg-card border border-border rounded-lg shadow-sm overflow-hidden"
                  >
                    <AccordionTrigger 
                      className="px-6 py-5 hover:bg-accent/50 transition-colors [&[data-state=open]]:bg-accent/30 focus:ring-2 focus:ring-ring focus:ring-inset"
                      aria-label={`${section.title} section, ${isComplete ? 'complete' : 'incomplete'}, ${section.questions.filter(q => answers[q.id] !== undefined).length} of ${section.questions.length} questions answered`}
                    >
                      <div className="flex items-center gap-4 w-full">
                        {/* Status Icon - subtle, secondary visual element */}
                        {isComplete ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" aria-hidden="true" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground/40 flex-shrink-0" aria-hidden="true" />
                        )}
                        
                        {/* Title - primary focus with strong hierarchy */}
                        <div className="flex items-center gap-3 flex-1 text-left">
                          <span className="text-sm font-medium text-muted-foreground">
                            {index + 1}
                          </span>
                          <h3 className="text-lg font-bold m-0">
                            {section.title}
                          </h3>
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
                      <div className="space-y-6" role="list" aria-label={`${section.title} questions`}>
                        {section.questions.map((q) => (
                          <div 
                            key={q.id} 
                            ref={(el) => { questionRefs.current[q.id] = el; }}
                            className={`space-y-4 p-5 bg-background rounded-lg border transition-all ${
                              focusedQuestionId === q.id 
                                ? 'border-primary ring-2 ring-primary/20' 
                                : 'border-border/50'
                            }`}
                            role="listitem"
                            onFocus={() => handleQuestionFocus(q.id)}
                          >
                            {/* Hierarchy: Question number and text */}
                            <Label 
                              id={`question-${q.id}-label`}
                              className="text-base font-medium leading-relaxed block"
                            >
                              <span className="text-muted-foreground mr-2">{q.id}.</span>
                              {q.text}
                            </Label>
                            
                            {/* Grouping: Scale buttons unified as single control */}
                            <RadioGroup
                              value={answers[q.id]?.toString() ?? ""}
                              onValueChange={(val) => handleAnswer(q.id, parseInt(val), true)}
                              className="flex flex-wrap gap-2 sm:gap-3 justify-center pt-2"
                              aria-labelledby={`question-${q.id}-label`}
                              onFocus={() => handleQuestionFocus(q.id)}
                            >
                              {SCALE_LABELS.map((scale) => (
                                <div key={scale.value} className="flex flex-col items-center gap-2">
                                  <RadioGroupItem
                                    value={scale.value.toString()}
                                    id={`q${q.id}-${scale.value}`}
                                    className="peer sr-only"
                                    aria-label={`${scale.value}${scale.label ? `, ${scale.label}` : ''}`}
                                  />
                                  <Label
                                    htmlFor={`q${q.id}-${scale.value}`}
                                    id={`q${q.id}-${scale.value}`}
                                    tabIndex={0}
                                    role="radio"
                                    aria-checked={answers[q.id] === scale.value}
                                    aria-label={`Question ${q.id}: Rating ${scale.value} of 7${scale.label ? `, ${scale.label}` : ''}`}
                                    onKeyDown={(e) => handleRatingKeyDown(e, q.id, scale.value)}
                                    className={`
                                      flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 cursor-pointer transition-all
                                      focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none
                                      ${answers[q.id] === scale.value 
                                        ? "border-primary bg-primary text-primary-foreground scale-110 shadow-lg font-bold" 
                                        : "border-muted-foreground/30 hover:border-primary/50 bg-card text-muted-foreground hover:scale-105"}
                                    `}
                                  >
                                    <span className="text-base font-semibold">{scale.value}</span>
                                  </Label>
                                  {(scale.value === 1 || scale.value === 4 || scale.value === 7) && (
                                    <span className="text-[10px] text-muted-foreground text-center max-w-[70px] hidden sm:block" aria-hidden="true">
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
                role="region"
                aria-label="Assessment complete"
              >
                <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" aria-hidden="true" />
                <h3 className="text-2xl font-bold">Assessment Complete!</h3>
                <p className="text-muted-foreground">
                  You've answered all 35 questions. Click below to view your personalized results and ROI analysis.
                </p>
                <Button
                  ref={submitButtonRef}
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="h-14 px-8 text-lg bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-describedby="submit-hint"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                      Generating Results...
                    </>
                  ) : (
                    <>
                      View Results →
                    </>
                  )}
                </Button>
                <p id="submit-hint" className="text-sm text-muted-foreground">
                  Press <kbd className="px-1.5 py-0.5 text-xs bg-muted border border-border rounded">Ctrl</kbd>+<kbd className="px-1.5 py-0.5 text-xs bg-muted border border-border rounded">Enter</kbd> to submit
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
    </div>
    </>
  );
}
