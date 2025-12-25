import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import AccessibleModal from './AccessibleModal';
import { methodologySections } from './CalculationMethodology';

interface HowItWorksButtonProps {
  section: 'readiness' | 'dysfunction' | 'drivers' | 'priorityMatrix' | 'fourCs' | 'roi' | 'dysfunctionBreakdown' | 'driverCosts';
  className?: string;
}

/**
 * HowItWorksButton Component
 * 
 * A button that opens a modal with detailed calculation methodology
 * for a specific section of the results page.
 * 
 * Features:
 * - Keyboard accessible (Tab, Enter, Space)
 * - WCAG 2.0 AA compliant
 * - Context-specific content based on section
 * - Visible focus indicator
 * - Proper ARIA labels
 */
export default function HowItWorksButton({ section, className = '' }: HowItWorksButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const methodology = methodologySections[section];

  if (!methodology) {
    console.error(`No methodology found for section: ${section}`);
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label={`How ${methodology.title} works`}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg
          text-sm font-medium
          text-[#64563A] dark:text-[#D4C5A0]
          bg-[#64563A]/10 dark:bg-[#64563A]/20
          hover:bg-[#64563A]/20 dark:hover:bg-[#64563A]/30
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-[#64563A] focus:ring-offset-2
          ${className}
        `}
      >
        <HelpCircle className="w-4 h-4" />
        <span>How It Works</span>
      </button>

      <AccessibleModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={methodology.title}
        ariaLabel={methodology.title}
      >
        {methodology.content}
      </AccessibleModal>
    </>
  );
}
