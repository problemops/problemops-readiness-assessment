- [x] Install `jspdf` and `html2canvas`
- [x] Create `ReportGenerator` component or utility function
- [x] Implement PDF generation logic capturing key metrics and charts
- [x] Connect "Download Report" button to the generation function
- [x] Test PDF generation
- [x] Retrieve 35-question survey instrument
- [x] Create `AssessmentModal` component
- [x] Implement survey logic (pagination, scoring, progress)
- [x] Connect assessment results to main calculator state
- [x] Create `BreakdownModal` component
- [x] Implement logic to calculate cost/savings per driver
- [x] Make Cost and Savings cards clickable
- [x] Connect cards to open BreakdownModal with specific data context
- [x] Create `Navbar` component with Dashboard and Assessment links
- [x] Integrate Navbar into Home.tsx layout
- [x] Assessment completion auto-redirect to dashboard
- [x] Responsive assessment modal (90% desktop, 100% mobile)
- [x] Auto-scroll to top on assessment step changes

## New Features - Results Page
- [x] Add company information fields to home page Team Parameters section
- [x] Add company information form to assessment (name, website, team/dept)
- [ ] Create Results page component with routing
- [ ] Display executive metrics (Cost, Savings, ROI) at top
- [ ] Show 7-driver summary with scores
- [x] Show detailed line-item breakdown of Annual Cost of Dysfunction calculation
- [ ] Generate detailed reasoning for each driver based on assessment answers
- [ ] Create qualitative team narrative paragraph with company context
- [ ] Build chunked training plan organized by driver clusters with 4 C's exercises
- [x] Design PDF page templates and structure (17-page format with Company Overview)
- [x] Create PDF generation utility with jsPDF
- [x] Implement driver reasoning generator based on assessment answers
- [x] Build ProblemOps 4 C's training plan content
- [x] Wire PDF export to Download Report button
- [x] Test complete PDF generation flow
- [ ] Integrate company website analysis for contextualized insights
- [ ] Wire assessment completion to redirect to Results page
- [ ] Test complete user flow from assessment to results

## Streamlining - Remove Home Dashboard
- [x] Create accordion-based Assessment with 7 driver sections
- [x] Add 2-sentence context for each driver (8th grade level)
- [x] Implement auto-expand/collapse on section completion
- [x] Add subtle status icons (checkmark/circle) for completion
- [x] Apply Gestalt principles (proximity, common region, grouping, continuity)
- [x] Proper information hierarchy throughout
- [x] Create Results page with all metrics and PDF download
- [x] Update App.tsx routing to start with Assessment
- [x] Remove Home page with sliders and manual calculator
- [x] Test streamlined flow: Assessment → Results → PDF

## Results Page Enhancements
- [x] Add narrative breakdown for Annual Cost of Dysfunction
- [x] Add narrative breakdown for Projected Annual Savings
- [x] Show driver-by-driver contribution to costs
- [x] Explain financial logic in 8th-grade reading level
- [x] Enhance ROI card to highlight payback period more prominently
- [x] Test financial breakdown clarity

## Priority Matrix Feature
- [x] Create priority matrix quadrant chart component
- [x] Plot drivers by Impact (weight) vs Performance (score)
- [x] Add quadrant labels and color coding
- [x] Integrate into Results page
- [x] Test priority matrix visualization

## 4 C's Framework & ProblemOps Integration
- [x] Map drivers to 4 C's (Criteria, Commitment, Collaboration, Change)
- [x] Calculate percentage scores for each of the 4 C's
- [x] Show 4 C's scores with gap from 85% target
- [x] Visualize 4 C's performance on Results page
- [x] Add ProblemOps Principles section explaining core framework
- [x] Build detailed training plan organized by 4 C's
- [x] Map 4 C's scores to recommended ProblemOps deliverables
- [x] Integrate company website analysis for business context
- [x] Generate qualitative team narrative with company insights
- [x] Test complete 4 C's integration

## PDF Generator Fix
- [x] Investigate why PDF is generating blank (generate() not being called before download())
- [x] Rebuild PDF generator to include all Results sections
- [x] Add cover page with company info
- [x] Add 4 C's framework visualization
- [x] Add team narrative (using enhanced narrative)
- [x] Add ProblemOps principles
- [x] Add training plan sections
- [x] Add recommended deliverables
- [x] Test PDF generation with real data

## Results Page Intro
- [x] Add personalized intro paragraph explaining assessment value
- [x] Address company by name
- [x] Explain what results show
- [x] Highlight why results are valuable
- [x] Preview actionable next steps

## Assessment Progress Bar
- [x] Calculate completion percentage based on answered questions
- [x] Create visual progress bar component
- [x] Display progress bar at top of assessment
- [x] Show "X of 35 questions answered" text
- [x] Update progress in real-time as users answer questions

## Training Type Selector
- [x] Replace "Est. Intervention Cost" with "What Kind of Corporate Training Do You Want?"
- [x] Add 4 options: Half Day ($2k), Full Day ($3.5k), Month-Long ($25k), Not Sure Yet
- [x] Create recommendation logic for Half Day (top 1 critical area)
- [x] Create recommendation logic for Full Day (top 2 critical areas)
- [x] Create recommendation logic for Month-Long (all areas, 1-month timeline)
- [ ] Create comparative view for "Not Sure Yet" (show all 3 options)
- [ ] Update Results page to show tailored recommendations
- [ ] Update deliverables based on training type
- [ ] Update PDF generator with training-specific content
- [ ] Test all training type options

## Training Type Feature - BDD Implementation
- [x] Verify Assessment.tsx training type field (4 radio options, default "not-sure")
- [x] Verify trainingRecommendations.ts ROI calculations for all 4 types
- [x] Implement comparison table for "I'm Not Sure Yet" in Results.tsx
- [x] Implement Training Focus Areas section (conditional based on training type)
- [x] Add Month-Long Timeline display for month-long option
- [x] Filter Priority Focus Areas based on training type
- [x] Add edge case handling for fewer priority areas than expected
- [x] Update PDF generator to include training scope on Company Overview page
- [x] Update PDF generator to add Training Focus page after Executive Summary
- [x] Update PDF generator to use correct ROI data based on training type
- [ ] CURRENT: Manual browser testing of all 4 training type scenarios
  - [ ] Test Half Day Workshop: Enter data, complete assessment, verify Results page
  - [ ] Test Full Day Workshop: Same data, verify 2 focus areas shown
  - [ ] Test Month-Long Engagement: Same data, verify timeline and all 7 areas
  - [ ] Test "I'm Not Sure Yet": Same data, verify comparison table displayed
- [ ] Verify ROI calculations match BDD formulas for each scenario
- [ ] Test PDF generation for each training type (4 PDFs total)
- [ ] Document all test results in training-type-test-report.md
- [ ] Fix any issues found during testing
- [ ] Update test report with PASS/FAIL status for each scenario
- [ ] Mark all training type tasks complete in todo.md
- [ ] Save checkpoint: "Training type feature complete with dynamic ROI"
- [ ] Deliver test report and checkpoint to user

## High-Performance Database Architecture with Email (HIGH PRIORITY)
- [x] User approved BDD scenarios - proceeding with implementation
- [x] Phase 1: Database Setup
  - [x] Create optimized schema (4 tables: assessments, assessment_data, email_logs, pdf_cache)
  - [x] Add all indexes (primary, partial, GIN for JSONB)
  - [x] Configure connection pooling
  - [x] Run migrations
- [x] Phase 2: Assessment Service API
  - [x] POST /api/assessments - Create assessment
  - [x] GET /api/assessments/:id - Get by ID
  - [ ] Add Redis caching layer (deferred)
  - [x] Error handling and retries
- [ ] Phase 3: Email Service (Async)
  - [ ] Integrate email provider (SendGrid/AWS SES/Resend)
  - [ ] Create email templates (HTML with results link)
  - [ ] Implement async job queue (BullMQ)
  - [ ] Add retry logic with exponential backoff
  - [ ] Email logging and tracking
- [ ] Phase 4: PDF Service
  - [ ] GET /api/assessments/:id/pdf endpoint
  - [ ] S3 upload integration for PDF storage
  - [ ] CDN configuration (Cloudflare/CloudFront)
  - [ ] PDF caching logic
- [x] Phase 5: Frontend Updates
  - [x] Add email field to Assessment form (optional)
  - [x] Update Assessment.tsx to POST to API
  - [x] Update Results.tsx to load from GET /api/assessments/:id
  - [x] Add URL routing for /results/:id
  - [x] Loading states and error handling
- [x] Phase 6: Testing & Performance
  - [x] Unit tests for assessment API (14 tests passing)
  - [x] Database persistence testing
  - [x] Data retrieval testing
  - [ ] Load testing (1000 concurrent users) - deferred
  - [ ] Database failover testing - deferred
  - [ ] Email delivery testing - pending email service
  - [ ] PDF generation performance testing - working
  - [x] Verify API response times
- [ ] Phase 7: Monitoring
  - [ ] Set up APM (Application Performance Monitoring)
  - [ ] Database monitoring dashboard
  - [ ] Email delivery tracking
  - [ ] Alert configuration
- [ ] Save checkpoint: "High-performance database with email integration"


## ProblemOps Branding Implementation
- [x] Copy logo file to client/public directory
- [x] Update color scheme in client/src/index.css (primary: #64563A)
- [x] Update Assessment page header with logo
- [x] Update Results page header with logo
- [x] Add favicon using ProblemOps icon
- [x] Update page title to "ProblemOps Team Readiness Assessment"
- [ ] Create branded email template HTML (deferred - email service not yet integrated)
- [ ] Update meta tags with OG images (deferred)
- [x] Test branding on all pages
- [ ] NEXT: Save checkpoint with branding complete



## Keyboard Accessibility (WCAG 2.0 Compliance)
- [x] Add skip-to-content link at top of all pages
- [x] Implement proper tab order for company info form
- [x] Add keyboard support for radio button groups (arrow keys)
- [x] Enable Enter key submission from text inputs (form onSubmit works natively)
- [x] Implement number key shortcuts (1-7) for rating questions
- [x] Add auto-advance to next question after rating selection
- [x] Implement N/J/P/K shortcuts for question navigation
- [x] Add Ctrl+Enter shortcut to submit assessment
- [x] Add Ctrl+Shift+R shortcut to jump to Results button
- [x] Implement ? key to show keyboard shortcuts help
- [x] Add visible focus indicators (2px ring) to all interactive elements
- [x] Ensure focus management on page transitions
- [x] Add ARIA labels and roles for screen reader support
- [x] Add aria-live regions for progress announcements
- [x] Test complete keyboard navigation flow

- [x] Fix typography hierarchy: "Company Information" and "Team Parameters" should be one em smaller than "Before We Begin" but larger than field labels


## Critical Bugs (URGENT)
- [x] Fix "Generating Results" infinite loading bug - was using wouter's useLocation instead of React Router's useNavigate
- [ ] Fix React form state not updating when input values are set programmatically (affects testing and accessibility)


## Enhanced Keyboard Navigation: TAB+ENTER (NEW)
- [x] Make each rating option (1-7) individually focusable with tabindex="0"
- [x] Implement TAB navigation through rating options in natural order (1→2→3→4→5→6→7)
- [x] Implement SHIFT+TAB backward navigation through rating options
- [x] Add ENTER key handler to select focused rating option
- [x] Implement auto-advance to next question's first rating after ENTER selection
- [x] Ensure TAB navigation continues across questions (question N option 7 → question N+1 option 1)
- [x] Add proper ARIA attributes (role="radiogroup", role="radio", aria-checked)
- [x] Implement focus management to move focus programmatically after selection
- [x] Prevent ENTER key from submitting form when pressed on rating options
- [x] Ensure number key shortcuts (1-7) work alongside TAB+ENTER navigation
- [x] Test focus indicators are visible on all rating options (2px ring, high contrast)
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver) for proper announcements
- [x] Test complete assessment flow using only TAB, SHIFT+TAB, and ENTER
- [x] Verify no focus traps exist in the assessment
- [x] Test changing previous answers using TAB+ENTER
- [x] Implement SHIFT+TAB from rating 1 to jump to rating 7 of previous question
- [x] Implement TAB from rating 7 to jump to rating 1 of next question
- [x] Implement cross-section navigation: auto-expand previous section on SHIFT+TAB from first question
- [x] Implement cross-section navigation: auto-expand next section on TAB from last question
- [x] Add smooth scrolling to bring focused question into view during cross-section navigation
- [x] Test TAB/SHIFT+TAB navigation across all 7 accordion sections
- [x] Verify no focus traps exist at section boundaries

- [x] Rename application title from "Team ProblemOps Readiness Assessment" to "Readiness Assessment"
- [x] Update logo to new ProblemOps horizontal dark mode SVG

## Accordion Navigation UX Improvements

- [x] Fix scroll positioning: when navigating to new section, scroll to top of section minus banner height
- [x] Calculate banner height dynamically and use as scroll offset
- [x] Prevent accordion auto-collapse when navigating backward to previous completed sections
- [x] Allow users to adjust answers in previously completed sections without accordion closing
- [x] Test scroll positioning across all 7 sections with TAB/SHIFT+TAB navigation
- [x] Test backward navigation (SHIFT+TAB) maintains open accordion state

## Progress Bar Styling

- [x] Change progress bar filled color to white (#FFFFFF)

## Banner and Page Title Updates

- [x] Remove "Readiness Assessment" text from top banner (keep only logo)
- [x] Rename "Before You Begin" to "Team Cross-Functional Efficiency Readiness Assessment"
- [x] Add "Tell Us About Your Team" title under banner on accordion page
- [x] Add "Test Results" title under banner on results page
- [x] Ensure consistent title styling across all pages

## Training Type Testing & Refinement (CURRENT)

- [ ] Create BDD specification for all 4 training type scenarios
- [ ] Test Half Day Workshop scenario end-to-end
- [ ] Test Full Day Workshop scenario end-to-end
- [ ] Test Month-Long Engagement scenario end-to-end
- [ ] Test "I'm Not Sure Yet" comparison table scenario
- [ ] Verify ROI calculations for each training type
- [ ] Fix any bugs or issues discovered during testing
- [ ] Document test results

## Screen Reader Accessibility Testing (CURRENT)

- [ ] Create BDD specification for screen reader testing
- [ ] Test company information form with screen reader
- [ ] Test assessment accordion navigation with screen reader
- [ ] Test rating selection with screen reader
- [ ] Test progress announcements with screen reader
- [ ] Test results page with screen reader
- [ ] Fix any accessibility issues discovered
- [ ] Document screen reader test results

## Logo Link Update

- [x] Update Assessment page logo to link to https://problemops.com
- [x] Update Results page logo to link to https://problemops.com

## Results Page Bottom Actions

- [x] Add "Generate Report PDF" button at bottom of Results page
- [x] Add "New Assessment" button at bottom of Results page
- [x] Left-align both buttons

## Multi-Level Progress Indicators

- [x] Create BDD specification for page-level and question-level progress
- [x] Create ProgressStepper component (Begin → Assess → Recommendations)
- [x] Add page-level stepper below banner on Assessment page
- [x] Add page-level stepper below banner on Results page
- [x] Position question-level progress bar below page-level stepper
- [x] Update progress calculations to consider page-level context
- [x] Test progress indicator on all three stages
- [x] Ensure responsive design on mobile devices

## Form Layout Fix

- [x] Vertically stack Team Size and Average Salary input fields
- [x] Ensure all text input fields have consistent full width
- [x] Remove horizontal layout for input fields

## Remove Email Field

- [x] Remove email input field from Assessment page company information form
- [x] Remove email from companyInfo state
- [x] Update backend schema to remove email field (not needed - backend accepts any fields)
- [x] Test form submission without email

## Progress Stepper Text Color Fix

- [x] Change text color inside golden amber (#FCD08B) circle from white to black
- [x] Change text color in gray inactive circles from gray to white

## Remove Autofocus on Form Load

- [x] Remove autofocus from Company Name field to prevent scroll jump on page load

## LocalStorage Auto-Save Feature

- [ ] Create BDD specification for localStorage auto-save
- [ ] Implement auto-save with 30-second interval for answers and company info
- [ ] Implement resume functionality on page load
- [ ] Add visual indicator showing "Draft saved" status
- [ ] Add "Clear Draft" button to discard saved progress
- [ ] Clear localStorage after successful submission
- [ ] Handle edge cases (localStorage full, disabled, corrupted data)
- [ ] Test auto-save and resume functionality

## Remove Auto-Focus on Assessment Start

- [x] Remove automatic focus and scroll to first question when assessment starts
- [x] Keep user at top of page to see "Tell Us About Your Team" title

## Sticky Banner on All Pages

- [x] Verify Assessment page banner is sticky (already has sticky top-0 z-20)
- [x] Make Results page banner sticky/fixed at top (added sticky top-0 z-20)
- [x] Test banner stays visible while scrolling on all pages

## New Assessment Button Scroll Fix

- [x] Make "New Assessment" button scroll to top of page after navigation

## Training Type TAB Navigation

- [ ] Create BDD specification for training type TAB/SHIFT+TAB navigation
- [ ] Change training type selection from arrow key navigation to TAB/SHIFT+TAB
- [ ] Remove arrow key navigation behavior from training type radio group
- [ ] Test TAB forward and SHIFT+TAB backward navigation

## Training Type Clickable Box Area

- [ ] Make entire training type option box clickable (not just text)
- [ ] Add hover state to entire box
- [ ] Add cursor pointer to entire box
- [ ] Test clicking anywhere in the box selects the option

## Training Type Layout & Styling Changes

- [x] Reorder training type options to start with "Not Sure Yet" first
- [x] Move option descriptions to new line below option name
- [x] Change option name text color to black
- [x] Change description text color to black
- [x] Test visual layout and readability

## Form Field Text Color

- [x] Change all form field text color from gray to black
- [x] Update input field text color (added text-black to Input component)
- [x] Update label text color to black
- [x] Ensure sufficient contrast for readability

## Training Type Description Color Fix

- [x] Change training type descriptions to placeholder text color (text-muted-foreground)
- [x] Ensure descriptions are left-aligned
- [x] Vertically center radio button in training type boxes

## Logo Update

- [x] Copy new ProblemOps horizontal logo to public directory
- [x] Update logo reference in Assessment page (already using /problemops-logo.svg)
- [x] Update logo reference in Results page (already using /problemops-logo.svg)
- [x] Test logo display on all pages

## Training Type Description Font Weight

- [x] Ensure training type descriptions are not bold (added font-normal)

## Month-Long Engagement Price Update

- [x] Update Month-Long Engagement price to $50,000 on Results page (already set in TRAINING_OPTIONS)
- [x] Verify price consistency across all pages (using shared constant)

## WCAG Accessibility Audit

- [x] Review WebAIM WCAG checklist (https://webaim.org/standards/wcag/checklist)
- [x] Audit Assessment page against WCAG 2.1 AA standards
- [x] Audit Results page against WCAG 2.1 AA standards
- [x] Document compliant items
- [x] Document non-compliant items with recommendations
- [x] Create comprehensive accessibility audit report

## WCAG Accessibility Implementation

### High Priority (Critical)
- [x] Fix color contrast for training type descriptions (4.5:1 minimum)
- [x] Fix color contrast for input placeholders (4.5:1 minimum)
- [x] Fix color contrast for progress stepper text (4.5:1 minimum)
- [x] Fix color contrast for radio button borders (3:1 minimum)
- [x] Add form error identification with ARIA live regions
- [x] Add error messages for required fields
- [x] Add proper heading structure (H1, H2, H3) to Assessment page
- [x] Add proper heading structure to Results page
- [x] Fix logo to use proper <a> tag with aria-label

### Medium Priority (Important)
- [x] Add ARIA live regions for status messages
- [x] Add aria-labels to rating buttons (1-7)
- [x] Add aria-label to progress bar
- [x] Add confirmation dialog for form submission (already exists)
- [x] Add error suggestions (e.g., "Please enter a valid number")mation before assessment submission### Low Priority (Polish)
- [x] Add ARIA landmark roles (banner, navigation, main, complementary)
- [x] Add table captions to Results page tables
- [x] Document keyboard shortcuts in help dialog (already exists)ardShortcutsDialog
- [ ] Add skip links for accordion sections
- [ ] Add focus management after accordion open
