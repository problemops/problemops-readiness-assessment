# BDD Scenario Automation Priority

## Prioritization Criteria

**P0 (Critical)** - Core functionality, calculations, accessibility compliance  
**P1 (High)** - Important user flows, data validation  
**P2 (Medium)** - UI polish, edge cases  
**P3 (Low)** - Nice-to-have validations

## P0 Scenarios to Automate First (20 scenarios)

### ROI Calculations (5 scenarios)
1. **Scenario 14.1**: ROI calculated using gap-based improvement model
2. **Scenario 14.2**: Half Day ROI uses only top 1 driver cost
3. **Scenario 14.3**: Full Day ROI uses only top 2 drivers cost
4. **Scenario 14.4**: Month-Long ROI uses all 7 drivers cost
5. **Scenario 13.1**: Readiness score calculation formula

### Training Options Logic (5 scenarios)
6. **Scenario 11.1**: Training type selection persists through assessment
7. **Scenario 11.2**: Half Day Workshop focuses on #1 critical area
8. **Scenario 11.3**: Full Day Workshop focuses on top 2 areas
9. **Scenario 11.4**: Month-Long Engagement addresses all 7 drivers
10. **Scenario 11.5**: "Not Sure Yet" shows all options

### Accessibility (WCAG) (5 scenarios)
11. **Scenario 1.1**: Training type descriptions meet 4.5:1 contrast ratio
12. **Scenario 2.1**: Required field errors announced via ARIA live region
13. **Scenario 3.1**: All interactive elements keyboard accessible
14. **Scenario 3.2**: Focus visible on all interactive elements
15. **Scenario 4.1**: All form inputs have associated labels

### Data Flow (3 scenarios)
16. **Scenario 16.1**: Assessment saves to database with UUID
17. **Scenario 16.2**: Results page loads from saved assessment ID
18. **Scenario 17.1**: Invalid assessment ID shows 404 error

### UI/UX Critical Flows (2 scenarios)
19. **Scenario 8.1**: Company info form validation before proceeding
20. **Scenario 9.1**: All 35 questions must be answered to see results

## Automation Approach

### Browser Tests (Playwright)
- Accessibility scenarios (color contrast, keyboard nav, ARIA)
- UI/UX flows (form validation, navigation)
- Data flow (assessment creation, results loading)

### Integration Tests (Vitest + Supertest)
- ROI calculation scenarios
- Training options logic
- Database operations

### Visual Regression Tests (Playwright)
- Screenshot comparison for UI consistency
- Dark mode vs light mode

## Test Organization

```
tests/
  e2e/
    accessibility.spec.ts    # P0 WCAG scenarios
    roi-calculations.spec.ts # P0 ROI scenarios
    training-options.spec.ts # P0 training logic
    data-flow.spec.ts        # P0 data scenarios
    ui-flows.spec.ts         # P0 UI/UX scenarios
  integration/
    assessment-api.spec.ts   # API endpoint tests
  helpers/
    test-data.ts             # Shared test fixtures
    assertions.ts            # Custom assertions
```

## Success Criteria

- ✅ All 20 P0 scenarios automated
- ✅ 100% pass rate on automated tests
- ✅ Tests run in CI/CD pipeline
- ✅ Test execution time < 5 minutes
- ✅ Test registry updated with automation status
