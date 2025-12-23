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


## Fix Assessment Submission Error (URGENT)
- [ ] Check server logs for error details
- [ ] Review Assessment.tsx handleSubmit function
- [ ] Check assessmentRouter.ts create endpoint
- [ ] Verify database schema matches API expectations
- [ ] Test API endpoint directly with curl/Postman
- [ ] Fix the root cause
- [ ] Write vitest test to prevent regression
- [ ] Test end-to-end submission flow in browser
- [ ] Save checkpoint with fix
