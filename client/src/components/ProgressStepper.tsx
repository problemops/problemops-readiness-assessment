import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type StepId = 'begin' | 'assess' | 'recommendations';

interface Step {
  id: StepId;
  label: string;
  number: number;
}

interface ProgressStepperProps {
  currentStep: StepId;
  completedSteps: StepId[];
  className?: string;
}

const steps: Step[] = [
  { id: 'begin', label: 'Begin', number: 1 },
  { id: 'assess', label: 'Assess', number: 2 },
  { id: 'recommendations', label: 'Recommendations', number: 3 },
];

export function ProgressStepper({ currentStep, completedSteps, className }: ProgressStepperProps) {
  const getStepStatus = (stepId: StepId): 'completed' | 'active' | 'inactive' => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'inactive';
  };

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div 
      className={cn("flex items-center justify-center gap-2 md:gap-3", className)}
      role="progressbar"
      aria-valuenow={currentStepIndex + 1}
      aria-valuemin={1}
      aria-valuemax={steps.length}
      aria-label={`Overall progress: Step ${currentStepIndex + 1} of ${steps.length}, ${steps[currentStepIndex].label}`}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(step.id);
        const isLast = index === steps.length - 1;
        const nextStepStatus = !isLast ? getStepStatus(steps[index + 1].id) : null;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                  status === 'active' && "bg-[#FCD08B] text-white",
                  status === 'completed' && "bg-gray-400 text-white",
                  status === 'inactive' && "border-2 border-gray-400 text-gray-400"
                )}
                aria-label={`Step ${step.number}: ${step.label}, ${status}`}
              >
                {status === 'completed' ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              {/* Step Label */}
              <span className={cn(
                "text-[11px] mt-1 whitespace-nowrap",
                status === 'active' ? "text-white font-medium" : "text-white/80"
              )}>
                {step.label}
              </span>
            </div>

            {/* Connecting Line */}
            {!isLast && (
              <div
                className={cn(
                  "h-0.5 mx-1 md:mx-2 transition-colors",
                  "w-12 md:w-16",
                  status === 'completed' ? "bg-gray-400" : "border-t-2 border-dotted border-gray-400"
                )}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
