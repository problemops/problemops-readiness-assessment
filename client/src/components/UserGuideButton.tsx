import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import AccessibleModal from './AccessibleModal';
import UserGuideContent from './UserGuideContent';

interface UserGuideButtonProps {
  className?: string;
}

/**
 * UserGuideButton Component
 * 
 * A button that opens a modal with the complete ProblemOps user guide.
 * 
 * Features:
 * - Keyboard accessible (Tab, Enter, Space)
 * - WCAG 2.0 AA compliant
 * - Table of contents with smooth scrolling
 * - Visible focus indicator
 * - Proper ARIA labels
 */
export default function UserGuideButton({ className = '' }: UserGuideButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open User Guide"
        title="User Guide"
        className={`
          p-2 rounded-lg
          text-primary-foreground
          bg-white/10 hover:bg-white/20
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary
          ${className}
        `}
      >
        <BookOpen className="w-5 h-5" />
      </button>

      <AccessibleModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="ProblemOps Readiness Assessment User Guide"
        ariaLabel="User Guide"
      >
        <UserGuideContent />
      </AccessibleModal>
    </>
  );
}
