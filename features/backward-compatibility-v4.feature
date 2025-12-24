Feature: Backward Compatibility - v4.0 Formula Integration
  As a product owner
  I want the v4.0 formula to integrate seamlessly without breaking existing functionality
  So that users experience improved calculations without disruption

  Background:
    Given the Enhanced Dysfunction Cost Formula v4.0 is deployed
    And all existing features are still operational

  # ============================================================================
  # RESULTS PAGE - UI AND DISPLAY
  # ============================================================================

  @regression @results-page
  Scenario: Results page loads successfully with v4.0 calculations
    Given I have completed an assessment
    When I navigate to the results page
    Then the page should load without errors
    And I should see the assessment results
    And all UI components should render correctly

  @regression @results-page
  Scenario: Results page displays company information
    Given I have completed an assessment with company name "Acme Corp"
    When I navigate to the results page
    Then I should see "Acme Corp" displayed
    And I should see the team size
    And I should see the average salary
    And I should see the training type selected

  @regression @results-page
  Scenario: Results page displays readiness score
    Given I have completed an assessment
    When I navigate to the results page
    Then I should see a readiness score percentage
    And the readiness score should be between 0% and 100%
    And the readiness score should be displayed prominently

  @regression @results-page
  Scenario: Results page displays dysfunction cost
    Given I have completed an assessment with payroll $1,000,000
    When I navigate to the results page
    Then I should see the total dysfunction cost
    And the dysfunction cost should be formatted as currency
    And the dysfunction cost should be a positive number

  @regression @results-page
  Scenario: Results page displays all 7 driver scores
    Given I have completed an assessment
    When I navigate to the results page
    Then I should see scores for all 7 drivers:
      | Driver                |
      | Trust                 |
      | Psychological Safety  |
      | Communication Quality |
      | Goal Clarity          |
      | Coordination          |
      | TMS                   |
      | Team Cognition        |
    And each driver score should be between 1.0 and 7.0

  @regression @results-page
  Scenario: Results page displays priority matrix
    Given I have completed an assessment
    When I navigate to the results page
    Then I should see the priority matrix visualization
    And the matrix should have 4 quadrants: Critical, Important, Monitor, Strength
    And drivers should be distributed across quadrants
    And the matrix should be interactive

  @regression @results-page
  Scenario: Results page displays training recommendations
    Given I have completed an assessment with training type "full-day"
    When I navigate to the results page
    Then I should see training recommendations
    And the recommendations should match the selected training type
    And I should see ROI calculations for the training

  # ============================================================================
  # PRIORITY MATRIX - BUSINESS LOGIC UNCHANGED
  # ============================================================================

  @regression @priority-matrix
  Scenario: Priority matrix quadrant assignment logic unchanged
    Given I have driver scores:
      | Driver                | Score | Expected Quadrant |
      | Trust                 | 2.0   | Critical          |
      | Psychological Safety  | 6.5   | Strength          |
      | Communication Quality | 3.5   | Important         |
      | Goal Clarity          | 5.0   | Monitor           |
    When the priority matrix is calculated
    Then each driver should be in its expected quadrant
    And the quadrant logic should match the pre-v4.0 behavior

  @regression @priority-matrix
  Scenario: Priority matrix uses same thresholds as before
    Given the priority matrix calculation is running
    When determining quadrant placement
    Then the impact threshold should be 0.15
    And the gap threshold should be 0.15 (85% target)
    And these thresholds should be unchanged from v3.x

  @regression @priority-matrix
  Scenario: Priority matrix quadrant counts are accurate
    Given I have completed an assessment
    When I view the priority matrix
    Then the quadrant counts should sum to 7 (total drivers)
    And each driver should appear in exactly one quadrant
    And the counts should be displayed correctly

  @regression @priority-matrix
  Scenario: Priority matrix visualization renders correctly
    Given I have completed an assessment
    When I view the priority matrix
    Then the matrix should be displayed as a 2x2 grid
    And each quadrant should have a distinct color
    And driver names should be visible in each quadrant
    And the axes should be labeled "Impact" and "Gap"

  @regression @priority-matrix
  Scenario: Priority matrix is industry-adjusted
    Given I have completed an assessment for industry "Healthcare"
    When the priority matrix is calculated
    Then industry-specific weights should be applied
    And the quadrant placement should reflect industry context
    And this behavior should match pre-v4.0 logic

  # ============================================================================
  # TRAINING RECOMMENDATIONS - LOGIC UNCHANGED
  # ============================================================================

  @regression @training
  Scenario: Half-day workshop addresses top 1 driver
    Given I have completed an assessment with training type "half-day"
    And the priority matrix shows Trust in Critical quadrant
    When I view training recommendations
    Then the half-day workshop should target Trust only
    And the recommendation should explain why Trust was selected
    And the ROI should be calculated for Trust improvement

  @regression @training
  Scenario: Full-day workshop addresses top 2 drivers
    Given I have completed an assessment with training type "full-day"
    And the priority matrix shows Trust and Communication in Critical quadrant
    When I view training recommendations
    Then the full-day workshop should target Trust and Communication
    And the recommendation should explain the selection
    And the ROI should be calculated for both drivers

  @regression @training
  Scenario: Month-long engagement addresses all 7 drivers
    Given I have completed an assessment with training type "month-long"
    When I view training recommendations
    Then the month-long engagement should target all 7 drivers
    And the recommendation should provide a comprehensive plan
    And the ROI should be calculated for all drivers

  @regression @training
  Scenario: Training type "not-sure" provides all options
    Given I have completed an assessment with training type "not-sure"
    When I view training recommendations
    Then I should see all three training options
    And each option should show its scope and ROI
    And I should be able to compare the options

  # ============================================================================
  # ROI CALCULATIONS - NUMBERS CHANGE BUT LOGIC STAYS
  # ============================================================================

  @regression @roi
  Scenario: ROI calculation structure is preserved
    Given I have completed an assessment
    When I view ROI calculations
    Then I should see:
      | Field                  |
      | Dysfunction Cost       |
      | Training Investment    |
      | Projected Savings      |
      | ROI Percentage         |
      | Payback Period         |
    And all fields should be present and populated

  @regression @roi
  Scenario: ROI percentage is calculated correctly
    Given the dysfunction cost is $1,000,000
    And the training investment is $10,000
    And the projected savings are $850,000
    When the ROI percentage is calculated
    Then the ROI should be 8,400%
    And the formula should be: (Savings - Investment) / Investment × 100

  @regression @roi
  Scenario: Payback period is calculated correctly
    Given the training investment is $10,000
    And the annual savings are $850,000
    When the payback period is calculated
    Then the payback period should be less than 1 month
    And the calculation should be: Investment / (Savings / 12)

  @regression @roi
  Scenario: ROI calculations use 85% improvement assumption
    Given the total addressable dysfunction cost is $1,000,000
    When projected savings are calculated
    Then the savings should be $850,000 (85% of $1,000,000)
    And this assumption should be consistent with pre-v4.0

  # ============================================================================
  # DATABASE OPERATIONS - NO CHANGES
  # ============================================================================

  @regression @database
  Scenario: Assessment is saved to database correctly
    Given I complete an assessment
    When the assessment is submitted
    Then a record should be created in the assessments table
    And a record should be created in the assessmentData table
    And both records should have the same assessmentId
    And all fields should be populated correctly

  @regression @database
  Scenario: Assessment can be retrieved by ID
    Given I have completed an assessment with ID "123e4567-e89b-12d3-a456-426614174000"
    When I request the assessment by ID
    Then the system should return the assessment
    And all company info should be present
    And all driver scores should be present
    And the readiness score should be present
    And the dysfunction cost should be present

  @regression @database
  Scenario: Assessment list endpoint works correctly
    Given there are 5 assessments in the database
    When I request the assessment list
    Then I should receive 5 assessments
    And each assessment should have: id, companyName, readinessScore, dysfunctionCost, createdAt
    And the list should be sorted by createdAt descending

  # ============================================================================
  # EMAIL FUNCTIONALITY - UNCHANGED
  # ============================================================================

  @regression @email
  Scenario: Email is queued when email address provided
    Given I complete an assessment with email "user@example.com"
    When the assessment is submitted
    Then an email job should be queued
    And the email status should be "pending"
    And the email type should be "results_with_pdf"

  @regression @email
  Scenario: No email is queued when email address not provided
    Given I complete an assessment without an email address
    When the assessment is submitted
    Then no email job should be queued
    And the assessment should still be saved successfully

  # ============================================================================
  # INDUSTRY CLASSIFICATION - UNCHANGED
  # ============================================================================

  @regression @industry
  Scenario: Industry is detected from website
    Given I provide website "https://www.hospital.com"
    When the assessment is submitted
    Then the industry should be detected as "Healthcare"
    And the confidence score should be recorded
    And the detected industry should be saved

  @regression @industry
  Scenario: Default industry is used when no website provided
    Given I do not provide a website
    When the assessment is submitted
    Then the industry should default to "Professional Services"
    And the confidence score should be 0.5
    And the assessment should proceed normally

  @regression @industry
  Scenario: Industry classification failure is handled gracefully
    Given I provide an invalid website URL
    When the assessment is submitted
    Then the system should use the default industry
    And the assessment should not fail
    And an error should be logged but not shown to user

  # ============================================================================
  # USER FLOW - END-TO-END UNCHANGED
  # ============================================================================

  @regression @e2e
  Scenario: Complete assessment flow works end-to-end
    Given I am on the assessment homepage
    When I fill in company information
    And I answer all 35 assessment questions
    And I submit the assessment
    Then I should be redirected to the results page
    And I should see my results
    And all calculations should be complete
    And no errors should occur

  @regression @e2e
  Scenario: Results page can be bookmarked and revisited
    Given I have completed an assessment
    And I have the results page URL
    When I close my browser
    And I reopen the browser and navigate to the results URL
    Then I should see the same results
    And all data should be loaded from the database
    And the page should render correctly

  @regression @e2e
  Scenario: Multiple assessments can be completed in sequence
    Given I have completed assessment #1
    When I start a new assessment #2
    And I complete assessment #2
    Then both assessments should be saved independently
    And each should have a unique ID
    And I should be able to view results for both

  # ============================================================================
  # UI COMPONENTS - NO VISUAL REGRESSIONS
  # ============================================================================

  @regression @ui
  Scenario: User Guide modal opens and displays content
    Given I am on the results page
    When I click the "User Guide" button
    Then a modal should open
    And the modal should display user guide content
    And the modal should be scrollable
    And I should be able to close the modal

  @regression @ui
  Scenario: How It Works modal opens and displays content
    Given I am on the results page
    When I click the "How It Works" button
    Then a modal should open
    And the modal should display calculation methodology
    And the modal should be scrollable
    And I should be able to close the modal

  @regression @ui
  Scenario: Results page is responsive on mobile
    Given I am on the results page
    When I resize the browser to mobile width (375px)
    Then all content should be visible
    And the layout should adapt to mobile
    And no horizontal scrolling should be required
    And all interactive elements should be accessible

  @regression @ui
  Scenario: Results page is responsive on tablet
    Given I am on the results page
    When I resize the browser to tablet width (768px)
    Then all content should be visible
    And the layout should adapt to tablet
    And the priority matrix should be readable
    And all interactive elements should be accessible

  @regression @ui
  Scenario: Results page prints correctly
    Given I am on the results page
    When I trigger the print function
    Then the page should format for printing
    And all key information should be visible
    And the layout should be print-friendly
    And no UI controls should appear in print

  # ============================================================================
  # ERROR HANDLING - UNCHANGED
  # ============================================================================

  @regression @error-handling
  Scenario: Invalid assessment ID shows error page
    Given I navigate to results page with invalid ID "not-a-uuid"
    Then I should see an error message
    And the error should indicate "Assessment not found"
    And I should see a link to return to homepage

  @regression @error-handling
  Scenario: Missing assessment data is handled gracefully
    Given an assessment exists but data is corrupted
    When I navigate to the results page
    Then I should see an error message
    And the error should be user-friendly
    And the system should log the error for debugging

  @regression @error-handling
  Scenario: Database connection failure is handled
    Given the database is temporarily unavailable
    When I try to submit an assessment
    Then I should see an error message
    And the error should indicate "Service temporarily unavailable"
    And my assessment data should not be lost

  # ============================================================================
  # PERFORMANCE - NO DEGRADATION
  # ============================================================================

  @regression @performance
  Scenario: Assessment submission completes within acceptable time
    Given I have filled out the assessment
    When I submit the assessment
    Then the submission should complete within 3 seconds
    And I should be redirected to results page
    And the user should not experience delays

  @regression @performance
  Scenario: Results page loads within acceptable time
    Given I have an assessment ID
    When I navigate to the results page
    Then the page should load within 2 seconds
    And all data should be fetched from database
    And all calculations should be complete

  @regression @performance
  Scenario: Priority matrix calculation is fast
    Given I have driver scores
    When the priority matrix is calculated
    Then the calculation should complete within 100ms
    And the UI should not freeze
    And the user should not notice any delay

  # ============================================================================
  # DATA INTEGRITY - VALUES CHANGE BUT STRUCTURE STAYS
  # ============================================================================

  @regression @data-integrity
  Scenario: Readiness score is still between 0 and 1
    Given I complete an assessment with any driver scores
    When the readiness score is calculated
    Then the readiness score should be ≥ 0
    And the readiness score should be ≤ 1
    And the readiness score should be stored with 4 decimal places

  @regression @data-integrity
  Scenario: Dysfunction cost is always non-negative
    Given I complete an assessment with any driver scores
    When the dysfunction cost is calculated
    Then the dysfunction cost should be ≥ 0
    And the dysfunction cost should be stored with 2 decimal places
    And the dysfunction cost should be formatted as currency

  @regression @data-integrity
  Scenario: Driver scores are preserved exactly as entered
    Given I answer questions with specific scores
    When the assessment is saved
    Then the driver scores should match the calculated averages
    And the scores should be stored with 1 decimal place
    And the original answers should be preserved in assessmentData

  @regression @data-integrity
  Scenario: JSON fields are valid and parseable
    Given I complete an assessment
    When the assessment is saved to database
    Then the answers field should be valid JSON
    And the driverScores field should be valid JSON
    And the priorityMatrixData field should be valid JSON
    And all JSON fields should be parseable without errors

  # ============================================================================
  # BACKWARD COMPATIBILITY - EXISTING ASSESSMENTS
  # ============================================================================

  @regression @backward-compat
  Scenario: Pre-v4.0 assessments can still be viewed
    Given there is an assessment created before v4.0 deployment
    When I navigate to that assessment's results page
    Then the page should load successfully
    And I should see the original results
    And no recalculation should occur
    And the data should be displayed correctly

  @regression @backward-compat
  Scenario: Pre-v4.0 assessments show correct version indicator
    Given there is an assessment created before v4.0 deployment
    When I view that assessment
    Then there should be an indicator showing "Calculated with v3.x"
    And the results should be marked as using the old formula
    And users should understand this is historical data

  @regression @backward-compat
  Scenario: New assessments show v4.0 indicator
    Given I complete a new assessment after v4.0 deployment
    When I view the results
    Then there should be an indicator showing "Calculated with v4.0"
    And users should know this uses the enhanced formula
    And the indicator should be visible but not intrusive

  # ============================================================================
  # MIGRATION SCENARIOS
  # ============================================================================

  @regression @migration
  Scenario: Database schema supports both v3.x and v4.0 data
    Given the v4.0 formula is deployed
    When assessments are saved
    Then the database schema should accommodate both versions
    And no data migration should be required
    And existing data should remain intact

  @regression @migration
  Scenario: API responses maintain backward compatibility
    Given external systems consume the assessment API
    When v4.0 is deployed
    Then the API response structure should be unchanged
    And all existing fields should be present
    And external integrations should not break
