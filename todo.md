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
