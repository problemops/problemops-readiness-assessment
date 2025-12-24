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

## Dark Mode Toggle Feature
- [x] Create ThemeToggle component with sun/moon icons
- [x] Add toggle button to Assessment page header
- [x] Add toggle button to Results page header
- [x] Ensure toggle is keyboard accessible with aria-label
- [x] Persist theme preference in localStorage
- [x] Test theme switching functionality
- [x] Verify dark mode color contrast meets WCAG standards

## Critical Bug Fix
- [x] Fix TypeError: Cannot read properties of undefined (reading 'toLowerCase') on recommendations page

## QA: Training Options Logic and Results
- [ ] Test "Not Sure" option - shows all training options with comparative ROI
- [ ] Test "Half Day" option - focuses on #1 critical area
- [ ] Test "Full Day" option - focuses on top 2 critical areas
- [ ] Test "Month-Long" option - comprehensive training across all areas
- [ ] Verify ROI calculations are accurate for each training type
- [ ] Verify priority areas match selected training option
- [ ] Test recommendations filtering based on training type
- [ ] Test edge cases: missing data, zero values, extreme values
- [ ] Verify 4Cs scores calculation
- [ ] Verify training plan generation logic

## Dark Mode Readability Fix
- [x] Fix field labels color in dark mode (currently black, unreadable)
- [x] Fix placeholder text color in dark mode (currently black, unreadable)
- [x] Verify all form fields are readable in dark mode

## Assess Page Navigation Fix
- [x] Fix autofocus on Assess page to scroll to top/title on navigation
- [x] Ensure users see "Tell Us About Your Team" title when landing on page

## Autofocus Fix - Assess Page
- [x] Fix autofocus to scroll to very top of page (currently scrolls to middle)
- [x] Remove focus on title element (causes mid-page scroll)
- [x] Ensure user sees header and logo when page loads

## BDD Test Database Storage
- [x] Create bdd_test_scenarios table in database
- [x] Import sample BDD scenarios from /tests/bdd-test-database.md (11 key scenarios)
- [x] Add indexes for efficient querying by epic, status, priority
- [ ] Create API endpoint to retrieve test scenarios (future enhancement)

## Slide Deck Generation Feature
- [ ] Design slide deck outline for assessment results presentation
- [ ] Create slide generation function that accepts assessment data
- [ ] Add "Create Slide Deck" button to Results page
- [ ] Implement slide deck generation with company branding
- [ ] Include key metrics, 4Cs analysis, priority areas, and recommendations
- [ ] Test slide deck generation with sample data
- [ ] Verify all charts and data display correctly in slides

## Word Document Export Feature
- [x] Remove PowerPoint export functionality
- [x] Install docx library for Word document generation
- [x] Create Word document generator utility function
- [x] Replace "Download PowerPoint" button with "Download Word Document" button
- [x] Implement DOCX generation with company branding and ProblemOps logo
- [x] Include key metrics, 4Cs analysis, priority areas, and recommendations
- [x] Test Word document generation with sample data
- [x] Verify all content displays correctly in DOCX

## Word Document Generation Bug Fix
- [x] Investigate "Failed to generate Word document" error
- [x] Fix error in docxGenerator.ts or Results.tsx (converted drivers array to object, added null checks)
- [x] Test Word document download successfully generates DOCX file

## Driver Impact Analysis Feature
- [x] Review literature review document for academic context on 7 drivers
- [x] Review slide deck on performing teams for additional insights
- [x] Review case study template for practical applications
- [x] Create BDD scenarios for dynamic driver impact display
- [x] Design driver impact content structure (consequences, waste metrics)
- [x] Rename "Your Team's Story" to "Your Team's Current Story"
- [x] Move section to above "Understanding Your Cost of Dysfunction"
- [x] Add waste analysis showing how team behaviors lead to lost money
- [x] Include specific waste examples: bugs, tickets, rework, cycle time, throughput
- [x] Update Results page with driver impact analysis
- [x] Update PDF generator with driver impact analysis
- [x] Update Word document generator with driver impact analysis
- [x] Include academic citations and research-backed insights
- [x] Test all three outputs with various score combinations (38 unit tests passed)
- [x] Add BDD scenarios to database for regression testing (18 scenarios added to Epics 28, 29, 30)


## Action Priority Matrix Enhancement
- [x] Review current Priority Matrix implementation (circles with hover)
- [x] Create BDD specification for always-visible driver information
- [x] Replace circles with labeled data points showing driver names
- [x] Show score and impact weight directly on chart
- [x] Ensure readability without hover interaction
- [x] Test on desktop and mobile viewports
- [x] Verified visual display in browser


## Bug Fix: Driver Score Calculation
- [x] Investigate why drivers other than Trust show incorrect scores (4/7 instead of 1/7)
- [x] Find the score calculation logic in assessment creation
- [x] Fix the calculation to properly average question scores per driver (key mapping bug in generateTeamStory)
- [x] Test with all-1s assessment to verify all drivers show 1/7
- [x] Test with all-7s assessment to verify all drivers show 7/7
- [x] Test with mixed scores (low, medium, high) to verify correct display
- [x] Create automated test script for score combinations (11 test cases, 100% pass rate)
- [x] Verify Priority Matrix displays correct colors (red for low scores)
- [x] Fix PDF generator to use correct driver scores (added teamStory to pdfData)
- [x] Fix Word generator to use correct driver scores (added teamStory to wordData)
- [x] Update unit tests to use database driver keys
- [x] Fix assessment API test expectations (readiness 55%, dysfunction $449k)
- [x] Fix assessment list ordering to show newest first (desc)
- [x] All 53 unit tests passing (100% pass rate)


## Merge Waste Breakdown into Driver Cards
- [x] Review current "Where the Waste Comes From" section structure
- [x] Review current "Where Your Team May Be Wasting Resources" driver cards
- [x] Create visual mockup showing merged layout
- [x] Write BDD specification for merged driver cards (includes typography hierarchy and section header consistency)
- [x] Update Results page to show waste breakdown in each driver card (cost, gap, weight)
- [x] Update all section headers to consistent text-3xl size
- [x] Update PDF generator to include waste breakdown in driver sections
- [x] Update Word generator to include waste breakdown in driver sections
- [x] Remove standalone "Where the Waste Comes From" section
- [x] Fix driver cost calculation bug (added dbKey field to DriverImpactNarrative)
- [x] Test Results page display - Trust $36k and Psych Safety $27k showing correctly
- [ ] Test PDF export
- [ ] Test Word export
- [ ] Run all 53 unit tests
- [ ] Create BDD unit tests for merged driver cards
- [ ] Add BDD scenarios to regression database
- [ ] Test with various score combinations
- [ ] Add BDD scenarios to database for regression testing


## Merged Driver Cards with Financial Data (COMPLETED)
- [x] Created visual mockup showing merged layout
- [x] Wrote BDD specification with typography hierarchy requirements
- [x] Added dbKey field to DriverImpactNarrative interface for efficient lookups
- [x] Updated Results page to show cost, gap %, and impact weight in each driver card
- [x] Fixed all section headers to consistent text-3xl size
- [x] Removed standalone "Where the Waste Comes From" section (merged into driver cards)
- [x] Updated PDF generator to include financial data in driver cards
- [x] Fixed driver score calculation bug (key mapping issue)
- [x] Tested with all-1s, all-7s, and mixed score combinations (100% pass rate)
- [x] All 53 unit tests passing
- [x] PDF export working perfectly with all driver costs displayed
- [ ] Word export (KNOWN ISSUE: generation failing, requires separate debugging session)
- [ ] Add BDD scenarios to regression database
- [x] Checkpoint saved: "Merged driver cards with financial data in Results page and PDF"

## Known Issues
- [ ] Word document generation failing (needs debugging - teamStory data issue)


## "Where to Focus Your Efforts" Categorization Bug (URGENT)
- [x] Investigate why drivers with score 1 appear in "Key Strengths" instead of "Critical"
- [x] Find the categorization logic in PriorityMatrix.tsx (not Results.tsx)
- [x] Fix the severity thresholds - changed from relative (avgScore) to absolute (5.5 threshold)
- [ ] Test with all-1s assessment to verify Critical categorization
- [ ] Test with all-7s assessment to verify Strengths categorization
- [ ] Test with mixed scores to verify all 4 categories work correctly
- [ ] Run all unit tests to ensure no regressions
- [ ] Save checkpoint with fix

## Fix ROI Calculation Scoping by Training Type
- [x] Analyze current ROI calculation in trainingRecommendations.ts
- [x] Update calculateTrainingROI to scope savings by training type:
  - [x] Half Day: Calculate savings from top 1 critical driver only
  - [x] Full Day: Calculate savings from top 2 critical drivers only
  - [x] Month-Long: Calculate savings from all 7 drivers (current behavior)
  - [x] Not Sure: Show all three scoped calculations in comparison
- [x] Update Results.tsx to use scoped ROI values
- [x] Update training comparison table to show correct scoped ROI
- [x] Write unit tests for scoped ROI calculations (8/8 passing)
- [x] Test in browser with example: Trust=1.5, Psych Safety=2.0
- [x] Verify Half Day ROI uses only highest priority driver cost ($120k savings, 5,910% ROI)
- [x] Verify Full Day ROI uses top 2 priority drivers cost ($217k savings, 6,110% ROI)
- [x] Verify Month-Long ROI uses all 7 drivers cost ($342k savings, 1,267% ROI)
- [x] Save checkpoint: "Fixed ROI calculation scoping by training type"

## Fix 4 C's Priority Calculation Bug
- [ ] Investigate current priority calculation logic in fourCsScoring.ts or problemOpsTrainingPlan.ts
- [ ] Fix priority thresholds to match specification:
  - [ ] 1.0 - 3.0: High Priority
  - [ ] 3.01 - 5.0: Medium Priority
  - [ ] 5.01 - 7.0: Low Priority
- [ ] Test with all 1's scenario (should show High Priority for all 4 C's)
- [ ] Test with all 4's scenario (should show Medium Priority)
- [ ] Test with all 6's scenario (should show Low Priority)
- [ ] Verify fix in browser with test assessment
- [ ] Save checkpoint: "Fixed 4 C's priority calculation thresholds"

## Fix Training Options Display Issues
- [x] Rename "Annual Savings" column to "Value If Fixed" in training comparison table
- [x] Update Month-Long Engagement price from $25,000 to $50,000
- [x] Fix annual savings calculation for Month-Long Engagement to match total dysfunction cost
- [x] Verify all three training options show correct pricing and ROI
- [x] Test in browser to confirm changes
- [x] Add BDD scenarios to permanent regression suite
- [x] Save checkpoint: "Fixed training options display and pricing"

## Fix "Selected Training Scope" Blank Display Bug
- [x] Create BDD specification for Selected Training Scope section behavior
- [x] Investigate why "not-sure" training type shows blank section
- [x] Fix display logic to show comparison table for "not-sure"
- [x] Verify all 4 training types display correctly:
  - [x] Not Sure Yet: Shows comparison table with all 3 options (browser verified)
  - [x] Half Day: Shows selected training scope with focus areas (code verified)
  - [x] Full Day: Shows selected training scope with focus areas (code verified)
  - [x] Month-Long: Shows selected training scope with timeline (code verified)
- [x] Run full regression test suite (141/141 passing)
- [x] Add BDD scenarios to regression suite
- [x] Save checkpoint: "Fixed Selected Training Scope display for not-sure type"

## Add 3 Months to Payback Period Calculations
- [ ] Create BDD specification for payback period adjustment
- [ ] Update payback calculation formula to add 3 months implementation time
- [ ] Update unit tests to reflect new payback periods
- [ ] Verify in browser that all training options show +3 months
- [ ] Update regression test suite with new expected values
- [ ] Save checkpoint: "Added 3-month implementation buffer to payback calculations"

## Fix Markdown Bold Syntax Not Rendering
- [ ] Find where "**However, there are significant concerns**" text is displayed
- [ ] Add markdown-to-HTML rendering or convert to proper HTML bold tags
- [ ] Verify bold text displays correctly in browser
- [ ] Check all driver impact narratives for proper formatting
- [ ] Save checkpoint: "Fixed markdown bold syntax rendering"

## Fix "Selected Training Scope" Blank for Full Day Workshop
- [ ] Investigate why full-day workshop shows blank "Selected Training Scope"
- [ ] Check conditional rendering logic
- [ ] Verify trainingOption data is being passed correctly
- [ ] Test all 4 training types in browser
- [ ] Save checkpoint: "Fixed Selected Training Scope display for all training types"

## Fix "Team Strength" Badge Color
- [ ] Find where "Team Strength" badge is rendered
- [ ] Change color from yellow to green
- [ ] Verify in browser that Team Strength shows green
- [ ] Save checkpoint: "Fixed Team Strength badge color to green"

## Update Recommended Deliverables Section
- [x] Update "Recommended ProblemOps Deliverables" heading to add "during your training"
- [x] Create BDD specification for training-type-based deliverables display
- [x] Implement getRecommendedDeliverablesByTraining() function
- [x] Implement getOtherDeliverablesByTraining() function
- [x] Update Results.tsx to use training-type-based deliverables logic
- [x] Add "The Other Deliverables For the 4 C's of ProblemOps" section to Results page
- [x] Test Half Day Workshop scenario (top 1 priority)
- [x] Test Full Day Workshop scenario (top 2 priorities)
- [x] Test Month-Long Engagement scenario (all priorities)
- [x] Test Not Sure Yet scenario (all priorities)
- [x] Test edge case: All C's above 60%
- [x] Test edge case: Only 1 C below 60% with Half Day
- [x] Test edge case: Only 1 C below 60% with Full Day
- [x] Run full regression test suite (79 tests passing)
- [x] Fix Moderate Concern badge color from green to yellow
- [x] Save checkpoint: Training-type-based deliverables implementation

## Add Training Duration Information
- [x] Add duration to Half Day Workshop: 4 hours of training
- [x] Add duration to Full Day Workshop: 8 hours of training
- [x] Add duration to Month-Long Engagement: 80 hours of training, coaching, and consulting
- [x] Update training comparison table UI to show duration (uses TRAINING_OPTIONS constant)
- [x] Update Assessment page training options to show duration
- [x] Update Results page training recommendations to show duration (uses TRAINING_OPTIONS constant)
- [x] Update PDF export to include duration (uses TRAINING_OPTIONS constant)
- [x] Update Word export to include duration (uses TRAINING_OPTIONS constant)

## Update Month-Long Engagement Pricing
- [x] Change price from $50,000 to $30,000 in trainingRecommendations.ts constants
- [x] Update Assessment page UI display (uses TRAINING_OPTIONS constant)
- [x] Update Results page training comparison table (uses TRAINING_OPTIONS constant)
- [x] Update ROI calculation logic (uses TRAINING_OPTIONS constant)
- [x] Update PDF generator
- [x] Update Word generator (uses TRAINING_OPTIONS constant, no hardcoded prices)
- [x] Update all test fixtures and expectations
- [x] Verify calculations are correct with new price (79 tests passing)

## Convert BDD Scenarios to Automated Tests
- [ ] Audit all 86+ BDD scenarios in tests/bdd-test-database.md
- [ ] Create automated tests for WCAG accessibility scenarios (browser tests)
- [ ] Create automated tests for training options logic (unit tests)
- [ ] Create automated tests for ROI calculations (unit tests)
- [ ] Create automated tests for data flow scenarios (integration tests)
- [ ] Create automated tests for UI/UX scenarios (browser tests)
- [ ] Create automated tests for dark mode scenarios (browser tests)
- [ ] Create automated tests for navigation scenarios (browser tests)
- [ ] Run all automated tests and verify 100% pass rate

## Create Master Test Database
- [x] Design schema for master test registry table
- [x] Create migration for test_registry table (testRegistry table with 22 columns)
- [x] Populate database with sample unit tests (5 representative tests)
- [x] Populate database with sample BDD scenarios (3 representative scenarios)
- [x] Create SQL queries to retrieve full test suite
- [x] Demonstrate retrieving tests from database (8 tests retrieved successfully)
- [x] Demonstrate test coverage statistics by category
- [x] Demonstrate BDD scenario retrieval with Given-When-Then structure
- [ ] Populate remaining 71 unit tests (script ready: populate-test-registry.sql)
- [ ] Populate remaining 83 BDD scenarios from tests/bdd-test-database.md
- [ ] Save checkpoint: Master test database infrastructure

## Populate Complete Test Registry (Task A)
- [ ] Run populate-test-registry script to insert all 79 unit tests
- [ ] Parse BDD scenarios from tests/bdd-test-database.md
- [ ] Insert all 86 BDD scenarios into testRegistry
- [ ] Verify total count: 165 tests in database
- [ ] Create summary report of test coverage

## Convert Critical BDD Scenarios to Automated Tests (Task B)
- [x] Audit all 86 BDD scenarios and prioritize P0 scenarios (created bdd-automation-priority.md)
- [x] Set up Playwright test infrastructure
- [x] Install Playwright and configure for the project (@playwright/test 1.57.0 + playwright.config.ts)
- [x] Create test utilities and helpers (tests/helpers/test-data.ts)
- [ ] Convert P0 accessibility scenarios (color contrast, keyboard nav)
- [ ] Convert P0 training options scenarios (Half Day, Full Day, Month-Long)
- [x] Convert P0 ROI calculation scenarios (5 tests in tests/e2e/roi-calculations.spec.ts)
- [ ] Convert P0 UI/UX scenarios (navigation, forms, validation)
- [ ] Convert P0 data flow scenarios (assessment creation, retrieval)
- [ ] Fix test selectors and verify Playwright tests pass
- [ ] Run all automated tests (unit + browser) and verify 100% pass
- [ ] Update test registry with automation status
- [x] Save checkpoint: BDD automation infrastructure + 5 P0 ROI tests


## Complete Playwright Test Suite (20 P0 Tests)
- [x] Fix ROI calculation test selectors (check actual question navigation)
- [x] Create 5 P0 ROI calculation tests (roi-calculations.spec.ts)
- [x] Create 5 P0 training options tests (training-options.spec.ts)
- [x] Create 5 P0 accessibility tests (accessibility.spec.ts)
- [x] Create 3 P0 data flow tests (data-flow.spec.ts)
- [x] Create 2 P0 UI/UX tests (ui-flows.spec.ts)
- [x] Run complete Playwright suite (20 tests)
- [ ] Fix 15 failing tests (sticky header blocking clicks, timing issues)
- [ ] Achieve 100% pass rate (currently 5/20 passing = 25%)
- [ ] Update package.json with test scripts
- [ ] Save checkpoint: P0 test automation infrastructure complete


## Fix 4 C's Priority Level Calculation Bug
- [ ] Create BDD specification for 4 C's priority level calculation
- [ ] Investigate current priority level logic in fourCsScoring.ts
- [ ] Fix priority level thresholds to match: Critical (1-2.5), High (2.51-4), Medium (4.01-5.5), Low (5.51-7)
- [ ] Create automated tests for all threshold boundaries
- [ ] Test with all 1's scenario (all 4 C's should show Critical)
- [ ] Test with mixed scores scenario
- [ ] Verify fix in browser
- [ ] Save checkpoint: Fixed 4 C's priority level calculation


## Fix 4 C's Priority Level Calculation Bug (COMPLETED)
- [x] Create BDD specification for priority level calculation (bdd-4cs-priority-levels.md)
- [x] Investigate current priority level calculation logic
- [x] Fix priority level thresholds (1-2.5: Critical, 2.51-4: High, 4.01-5.5: Medium, 5.51-7: Low)
- [x] Update 4 C's formulas: Commitment = avg(CommQuality, Trust, GoalClarity)
- [x] Update 4 C's formulas: Collaboration = avg(TMS, Trust, PsychSafety, Coordination, TeamCognition)
- [x] Update 4 C's formulas: Criteria = avg(CommQuality, GoalClarity, Coordination)
- [x] Update Results.tsx to display 'critical' urgency level with red badge
- [x] Update all test expectations to match new formulas
- [x] All 79 tests passing
- [x] Save checkpoint: 4 C's formula and priority level fix


## Action Priority Matrix Redesign (Research-Backed Two-Dimensional)
- [x] Research team dynamics and business value correlations
- [x] Design calculation model with research-backed weights from meta-analyses
- [x] Create BDD specification with 33 scenarios
- [x] Add database columns (detectedIndustry, industryConfidence, priorityMatrixData)
- [x] Create priorityMatrixCalculations.ts utility with industry-specific weights
- [x] Create industryClassifier.ts for LLM-based website analysis
- [x] Update assessment router to calculate and store matrix data
- [x] Build new PriorityMatrix component with two-dimensional visualization
- [x] Add axis labels (Team Impact vs Business Value)
- [x] Add quadrant labels (Critical, High, Medium, Low)
- [x] Add industry detection display on Results page
- [x] Add Priority Legend explaining each quadrant
- [x] Write unit tests for priority matrix calculations
- [x] Verify end-to-end flow with test assessment
- [x] Create calculation methodology documentation


## Bug Fixes
- [x] Fix assessment submission timeout error (5 second timeout too short for LLM industry classification)
- [x] Run all unit tests to verify system stability (96 tests passing)


## Animated Loading Screen Feature
- [ ] Write BDD specification for loading screen
- [ ] Copy ProblemOps logo to project assets
- [ ] Install and configure Lottie animation library
- [ ] Create LoadingScreen component with animated logo
- [ ] Add rotating progress messages
- [ ] Update Assessment page to show loading screen during submission
- [ ] Add accessible fade transition to Results page
- [ ] Test complete flow and verify accessibility


## Loading Screen Feature (COMPLETED)
- [x] Create LoadingScreen component with animated ProblemOps logo
- [x] Implement CSS animations (pulse, float effects)
- [x] Add rotating progress messages
- [x] Ensure centered, responsive design across all viewports
- [x] Add accessibility features (prefers-reduced-motion support)
- [x] Add ARIA live regions for screen readers
- [x] Integrate with Assessment submission flow
- [x] Fix timeout error (increased from 5s to 60s for LLM classification)
- [x] Fix z-index visibility issue (changed from z-50 to z-[9999])
- [x] Restore proper dark charcoal background (#3D3D3D)
- [x] Write BDD specification (15 scenarios)
- [x] Write 39 unit tests (all passing)
- [x] User testing verified - loading screen displays correctly


## How It Works & User Guide Features (December 24, 2024)

- [x] Write BDD tests for "How It Works" button functionality
- [x] Write BDD tests for "User Guide" button functionality  
- [x] Write BDD tests for keyboard navigation in modals
- [x] Write BDD tests for WCAG 2.0 AA compliance
- [x] Create reusable AccessibleModal component
- [x] Implement focus trap in modal
- [x] Implement keyboard navigation (Tab, Shift+Tab, Escape)
- [x] Add "How It Works" buttons to all calculation sections
- [x] Create calculation methodology content components
- [x] Add "User Guide" button to header
- [x] Create user guide content with table of contents navigation
- [x] Implement smooth scrolling within modal
- [x] Add proper ARIA labels and roles
- [x] Ensure sufficient color contrast
- [x] Add visible focus indicators
- [x] Test with keyboard only (no mouse)
- [x] Test with screen reader
- [x] Run accessibility audit
- [x] Save checkpoint
