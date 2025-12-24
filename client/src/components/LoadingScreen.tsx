/**
 * LoadingScreen Component
 * 
 * Full-screen animated loading experience shown during assessment submission.
 * Features:
 * - Animated ProblemOps logo with pulse and float effects
 * - Rotating progress messages
 * - Animated loading dots
 * - Accessible (respects prefers-reduced-motion, ARIA live regions)
 * - Fully responsive (mobile, tablet, desktop, landscape)
 * - Smooth fade transition when complete
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Progress messages that rotate during loading
const PROGRESS_MESSAGES = [
  "Analyzing your team's dynamics...",
  "Calculating impact on performance...",
  "Identifying priority areas...",
  "Generating personalized recommendations...",
  "Almost there...",
];

// Loading states
export type LoadingStatus = 'loading' | 'success' | 'error';

interface LoadingScreenProps {
  status: LoadingStatus;
  onRetry?: () => void;
  errorMessage?: string;
}

export function LoadingScreen({ status, onRetry, errorMessage }: LoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Rotate messages every 3 seconds
  useEffect(() => {
    if (status !== 'loading') return;
    
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % PROGRESS_MESSAGES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [status]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: prefersReducedMotion ? 0 : 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.4 }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { duration: prefersReducedMotion ? 0 : 0.2 }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#3D3D3D]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="status"
      aria-live="polite"
      aria-label="Loading your results"
    >
      {/* Centered content container */}
      <div className="flex flex-col items-center justify-center px-6 text-center max-w-[600px] w-full">
        
        {/* Animated Logo */}
        <div 
          className={`mb-8 sm:mb-10 ${!prefersReducedMotion ? 'animate-float' : ''}`}
          aria-hidden="true"
        >
          <div className={`relative ${!prefersReducedMotion ? 'animate-pulse-gentle' : ''}`}>
            <img
              src="/problemops-logo.svg"
              alt=""
              className="w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] lg:w-[200px] lg:h-[200px] max-w-[60vw] max-h-[40vh]"
            />
            {/* Glow effect */}
            {!prefersReducedMotion && (
              <div className="absolute inset-0 animate-glow rounded-full bg-[#D4A574]/20 blur-xl -z-10" />
            )}
          </div>
        </div>

        {/* Progress Message */}
        {status === 'loading' && (
          <div className="min-h-[60px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-[#F5F0E8] text-lg sm:text-xl lg:text-2xl font-medium"
              >
                {PROGRESS_MESSAGES[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        )}

        {/* Error Message */}
        {status === 'error' && (
          <div className="min-h-[60px] flex flex-col items-center justify-center gap-4">
            <p className="text-[#E07A5F] text-lg sm:text-xl font-medium">
              {errorMessage || "Something went wrong. Please try again."}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-6 py-3 bg-[#D4A574] text-[#2D2D2D] rounded-lg font-medium 
                         hover:bg-[#C49664] transition-colors min-w-[120px] min-h-[44px]
                         focus:outline-none focus:ring-2 focus:ring-[#F5F0E8] focus:ring-offset-2 focus:ring-offset-[#3D3D3D]"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {/* Animated Dots */}
        {status === 'loading' && (
          <div className="flex items-center justify-center gap-2 mt-6" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#D4A574] ${
                  !prefersReducedMotion ? 'animate-dot-pulse' : ''
                }`}
                style={{
                  animationDelay: prefersReducedMotion ? '0ms' : `${i * 200}ms`,
                }}
              />
            ))}
          </div>
        )}

        {/* Secondary Reassurance Text */}
        {status === 'loading' && (
          <p className="text-[#9A9A9A] text-sm mt-6 sm:mt-8">
            This usually takes 10-30 seconds.
            <br />
            Please don't refresh the page.
          </p>
        )}
      </div>
    </motion.div>
  );
}

// CSS animations (add to index.css or as a style tag)
export const loadingScreenStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes pulse-gentle {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
  }

  @keyframes glow {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.1); }
  }

  @keyframes dot-pulse {
    0%, 100% { opacity: 0.4; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1); }
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-pulse-gentle {
    animation: pulse-gentle 2s ease-in-out infinite;
  }

  .animate-glow {
    animation: glow 2.5s ease-in-out infinite;
  }

  .animate-dot-pulse {
    animation: dot-pulse 1.4s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-float,
    .animate-pulse-gentle,
    .animate-glow,
    .animate-dot-pulse {
      animation: none;
    }
  }
`;

export default LoadingScreen;
