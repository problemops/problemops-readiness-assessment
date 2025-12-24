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
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg
          text-sm font-medium
          text-white dark:text-white
          bg-[#64563A] dark:bg-[#64563A]
          hover:bg-[#53482F] dark:hover:bg-[#53482F]
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-[#64563A] focus:ring-offset-2
          ${className}
        `}
      >
        <BookOpen className="w-4 h-4" />
        <span>User Guide</span>
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
