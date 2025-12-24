# BDD Specification: Animated Loading Screen

## Feature Overview

When a user submits their assessment, instead of seeing a static loading spinner, they are taken to a full-screen animated loading experience that reassures them the system is working. The loading screen features the animated ProblemOps logo, rotating progress messages, and brand-consistent visuals. Upon completion, the screen smoothly transitions to the Results page.

---

## Feature: Assessment Submission Loading Screen

### Background
```gherkin
Given the user has completed all 35 assessment questions
And the user has filled in required company information
And the user clicks "View Results"
```

---

## Scenario 1: Loading Screen Appears on Submission

```gherkin
Scenario: User sees loading screen when submitting assessment
  Given I have completed all assessment questions
  When I click the "View Results" button
  Then I should see a full-screen loading screen
  And the loading screen should have a dark overlay background
  And the ProblemOps logo should be visible and animated
  And I should see a reassuring message like "Analyzing your team's dynamics..."
```

**Acceptance Criteria:**
- Loading screen covers the entire viewport
- Background uses ProblemOps brand colors (dark brown/charcoal #3D3D3D or similar)
- Logo is centered vertically and horizontally
- Initial message appears within 100ms of submission

---

## Scenario 2: Logo Animation

```gherkin
Scenario: ProblemOps logo animates smoothly
  Given the loading screen is displayed
  Then the ProblemOps target/arrow logo should animate
  And the animation should include a gentle pulsing effect
  And the arrow should have a subtle rotation or drawing animation
  And the animation should loop continuously
  And the animation should respect reduced-motion preferences
```

**Animation Specifications:**
| Element | Animation Type | Duration | Easing |
|---------|---------------|----------|--------|
| Outer rings | Gentle pulse (scale 1.0 → 1.05 → 1.0) | 2 seconds | ease-in-out |
| Arrow | Subtle rotation or draw-in effect | 1.5 seconds | ease-out |
| Center target | Soft glow pulse | 2.5 seconds | ease-in-out |
| Overall logo | Gentle float (translateY) | 3 seconds | ease-in-out |

**Accessibility:**
- Animation pauses when `prefers-reduced-motion: reduce` is detected
- Static logo displayed as fallback

---

## Scenario 3: Rotating Progress Messages

```gherkin
Scenario: Progress messages rotate to keep user informed
  Given the loading screen is displayed
  Then I should see progress messages that change over time
  And each message should fade in smoothly
  And messages should rotate every 3-4 seconds
  And messages should be reassuring and informative
```

**Message Sequence:**
| Order | Message | Display Duration |
|-------|---------|-----------------|
| 1 | "Analyzing your team's dynamics..." | 3 seconds |
| 2 | "Calculating impact on performance..." | 3 seconds |
| 3 | "Identifying priority areas..." | 3 seconds |
| 4 | "Generating personalized recommendations..." | 3 seconds |
| 5 | "Almost there..." | Until complete |

**Visual Specifications:**
- Font: Same as brand (system font or specified)
- Color: Light text on dark background (#F5F5F5 or cream/tan accent)
- Size: 1.25rem (20px)
- Animation: Fade in/out with 300ms transition

---

## Scenario 4: Secondary Reassurance Text

```gherkin
Scenario: User sees reassurance that system is working
  Given the loading screen is displayed
  Then I should see secondary text below the main message
  And the text should say something like "This usually takes 10-30 seconds"
  And the text should be smaller and more subtle than the main message
```

**Visual Specifications:**
- Font size: 0.875rem (14px)
- Color: Muted/secondary text color (#A0A0A0)
- Position: Below rotating messages
- Content: "This usually takes 10-30 seconds. Please don't refresh the page."

---

## Scenario 5: Progress Indicator

```gherkin
Scenario: Visual progress indicator shows activity
  Given the loading screen is displayed
  Then I should see a visual indicator that the system is working
  And the indicator could be animated dots, a progress bar, or spinning element
  And the indicator should use brand accent colors (tan/cream #D4A574 or coral #E07A5F)
```

**Options (choose one):**
1. **Animated dots**: Three dots that pulse in sequence
2. **Indeterminate progress bar**: Thin bar that animates left-to-right
3. **Circular spinner**: Matches logo aesthetic

---

## Scenario 6: Transition to Results Page

```gherkin
Scenario: Smooth transition when results are ready
  Given the loading screen is displayed
  And the API call has completed successfully
  Then the loading screen should fade out smoothly
  And the Results page should fade in
  And the transition should take approximately 500-800ms
  And the transition should not cause flashing or jarring effects
```

**Transition Specifications:**
| Phase | Duration | Effect |
|-------|----------|--------|
| Loading screen fade out | 400ms | Opacity 1 → 0 |
| Brief pause | 100ms | Both screens at 0 opacity |
| Results page fade in | 400ms | Opacity 0 → 1 |

**Accessibility:**
- No flashing effects (WCAG 2.3.1)
- Transition respects `prefers-reduced-motion`
- If reduced motion preferred: instant transition (no animation)

---

## Scenario 7: Error Handling

```gherkin
Scenario: Error message appears if submission fails
  Given the loading screen is displayed
  And the API call fails or times out
  Then the loading screen should show an error state
  And I should see a message like "Something went wrong"
  And I should see a "Try Again" button
  And the animated logo should stop animating
```

**Error State Specifications:**
- Logo animation stops (static display)
- Message changes to error text in a distinct color (not red - use muted coral)
- "Try Again" button appears below message
- Button returns user to assessment form with data preserved

---

## Scenario 8: Accessibility - Screen Reader Support

```gherkin
Scenario: Screen readers announce loading state
  Given I am using a screen reader
  When the loading screen appears
  Then the screen reader should announce "Loading your results"
  And the loading screen should have role="status" or aria-live="polite"
  And progress message changes should be announced
```

**ARIA Specifications:**
- Container: `role="status"` and `aria-live="polite"`
- Logo: `aria-hidden="true"` (decorative)
- Messages: Announced when changed
- Focus: Trapped within loading screen while active

---

## Scenario 9: Keyboard Accessibility

```gherkin
Scenario: Loading screen is keyboard accessible
  Given the loading screen is displayed
  Then pressing Tab should not move focus outside the loading screen
  And pressing Escape should NOT close the loading screen (no cancel option)
  And focus should be managed appropriately
```

---

## Scenario 10: Centered Content Layout

```gherkin
Scenario: All content is perfectly centered on the loading screen
  Given the loading screen is displayed
  Then all content should be centered both vertically and horizontally
  And the logo should be centered in the viewport
  And the progress messages should be centered below the logo
  And the animated dots should be centered below the messages
  And the secondary reassurance text should be centered at the bottom
  And centering should use flexbox for reliable cross-browser support
```

**Centering Specifications:**
| Element | Horizontal | Vertical | Method |
|---------|------------|----------|--------|
| Container | Center | Center | `display: flex; justify-content: center; align-items: center; min-height: 100vh` |
| Logo | Center | - | `margin: 0 auto` or flex child |
| Messages | Center | - | `text-align: center` |
| Dots | Center | - | `justify-content: center` on flex container |
| Secondary text | Center | - | `text-align: center` |

**Layout Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│                     min-height: 100vh                       │
│                     display: flex                           │
│                     justify-content: center                 │
│                     align-items: center                     │
│                                                             │
│              ┌─────────────────────────────┐                │
│              │     flex-direction: column   │                │
│              │     align-items: center      │                │
│              │                             │                │
│              │        [LOGO]               │                │
│              │                             │                │
│              │   "Progress message..."     │                │
│              │                             │                │
│              │        ● ● ●                │                │
│              │                             │                │
│              │   "Secondary text..."       │                │
│              │                             │                │
│              └─────────────────────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Scenario 11: Responsive Design - Mobile

```gherkin
Scenario: Loading screen displays correctly on mobile devices
  Given I am viewing the loading screen on a mobile device (< 640px)
  Then the logo should scale down appropriately
  And the logo should be no larger than 80% of viewport width
  And text should remain readable (minimum 16px)
  And all content should fit within the viewport without scrolling
  And touch targets should be at least 44x44px (for error retry button)
```

**Mobile Breakpoint Specifications (< 640px):**
| Element | Desktop Size | Mobile Size |
|---------|-------------|-------------|
| Logo | 200px × 200px | 150px × 150px (or 60vw max) |
| Main message | 1.5rem (24px) | 1.25rem (20px) |
| Secondary text | 0.875rem (14px) | 0.875rem (14px) |
| Animated dots | 12px | 10px |
| Spacing (logo to text) | 2rem | 1.5rem |

---

## Scenario 12: Responsive Design - Tablet

```gherkin
Scenario: Loading screen displays correctly on tablet devices
  Given I am viewing the loading screen on a tablet (640px - 1024px)
  Then the logo should be appropriately sized for the viewport
  And spacing should be comfortable but not excessive
  And the layout should remain centered
```

**Tablet Breakpoint Specifications (640px - 1024px):**
| Element | Size |
|---------|------|
| Logo | 180px × 180px |
| Main message | 1.5rem (24px) |
| Spacing | 1.75rem |

---

## Scenario 13: Responsive Design - Large Screens

```gherkin
Scenario: Loading screen displays correctly on large screens
  Given I am viewing the loading screen on a large monitor (> 1440px)
  Then the content should not stretch to fill the entire width
  And the logo should have a maximum size (e.g., 250px)
  And content should remain comfortably centered
  And there should be appropriate negative space around content
```

**Large Screen Specifications (> 1440px):**
| Element | Max Size |
|---------|----------|
| Logo | 250px × 250px max |
| Content container | 600px max-width |
| Main message | 1.75rem (28px) max |

---

## Scenario 14: Responsive Design - Landscape Mobile

```gherkin
Scenario: Loading screen displays correctly in landscape orientation
  Given I am viewing the loading screen on a mobile device in landscape
  Then content should still be visible without scrolling
  And the logo may be smaller to fit the reduced height
  And layout should adapt to the wider, shorter viewport
```

**Landscape Mobile Specifications:**
- Use `min-height: 100dvh` (dynamic viewport height) to handle mobile browser chrome
- Logo size: `min(150px, 40vh)` to ensure it fits in reduced height
- Reduce vertical spacing between elements

---

## Scenario 15: Reduced Motion Preference

```gherkin
Scenario: Animations respect user preferences
  Given I have set "prefers-reduced-motion: reduce" in my system settings
  When the loading screen appears
  Then the logo should be static (no animation)
  And message transitions should be instant (no fade)
  And the page transition should be instant
  And I should still see all content and messages
```

---

## Visual Design Specifications

### Color Palette (ProblemOps Brand)

| Element | Color | Hex Code |
|---------|-------|----------|
| Background | Dark charcoal/brown | #3D3D3D or #2D2D2D |
| Primary text | Off-white/cream | #F5F0E8 |
| Secondary text | Muted gray | #9A9A9A |
| Accent (logo center, highlights) | Warm tan/gold | #D4A574 |
| Accent 2 (arrow tips) | Coral/salmon | #E07A5F |
| Logo rings | Dark gray | #4A4A4A |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Main message | System/Brand font | 1.5rem (24px) | 500 (medium) |
| Secondary message | System/Brand font | 0.875rem (14px) | 400 (normal) |
| Error message | System/Brand font | 1.25rem (20px) | 500 (medium) |

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                                                             │
│                    ┌─────────────────┐                      │
│                    │                 │                      │
│                    │   [ANIMATED     │                      │
│                    │    LOGO]        │                      │
│                    │                 │                      │
│                    └─────────────────┘                      │
│                                                             │
│              "Analyzing your team's dynamics..."            │
│                                                             │
│                         ● ● ●                               │
│                                                             │
│         This usually takes 10-30 seconds.                   │
│              Please don't refresh the page.                 │
│                                                             │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation Notes

### Lottie Animation
- Use `lottie-react` or `@lottiefiles/react-lottie-player` package
- Convert SVG logo to Lottie JSON format, OR
- Use CSS animations on the SVG directly (simpler, no extra dependency)

### CSS Animation Alternative
If Lottie is too complex, use CSS keyframes:
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@media (prefers-reduced-motion: reduce) {
  .animated-logo {
    animation: none;
  }
}
```

### State Management
```typescript
type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading'; messageIndex: number }
  | { status: 'success'; redirectUrl: string }
  | { status: 'error'; message: string };
```

---

## Test Cases Summary

| Test ID | Description | Priority |
|---------|-------------|----------|
| LS-001 | Loading screen appears on form submission | High |
| LS-002 | Logo animation plays correctly | Medium |
| LS-003 | Messages rotate every 3-4 seconds | Medium |
| LS-004 | Transition to results is smooth | High |
| LS-005 | Error state displays correctly | High |
| LS-006 | Screen reader announces loading state | High |
| LS-007 | Reduced motion preference respected | High |
| LS-008 | Focus is trapped in loading screen | Medium |
| LS-009 | Brand colors are correct | Low |
| LS-010 | Secondary reassurance text displays | Low |
| LS-011 | Content is perfectly centered on all viewports | High |
| LS-012 | Mobile responsive - logo scales, text readable | High |
| LS-013 | Tablet responsive - appropriate sizing | Medium |
| LS-014 | Large screen - content doesn't stretch | Medium |
| LS-015 | Landscape mobile - fits without scroll | Medium |

---

## Dependencies

| Package | Purpose | Required |
|---------|---------|----------|
| framer-motion | Already installed - use for transitions | Yes |
| lottie-react | Lottie animation player (optional) | No |
| CSS animations | Alternative to Lottie | Yes (fallback) |

---

## Acceptance Checklist

- [ ] Loading screen appears immediately on submission
- [ ] Logo animates smoothly with brand-appropriate motion
- [ ] Messages rotate and reassure user
- [ ] Transition to results is smooth and accessible
- [ ] Error state is handled gracefully
- [ ] All WCAG 2.1 AA accessibility requirements met
- [ ] Reduced motion preference respected
- [ ] Content is perfectly centered (vertical + horizontal)
- [ ] Works on mobile devices (< 640px)
- [ ] Works on tablets (640px - 1024px)
- [ ] Works on large screens (> 1440px)
- [ ] Works in landscape orientation on mobile
- [ ] No performance issues (60fps animation)
