import { getDb } from '../server/db.js';import { bddScenarios, bddEpics } from '../shared/schema.js';

async function addDriverScoreBugBDD() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Add Epic 32
  const [epic] = await db.insert(bddEpics).values({
    epicNumber: 32,
    title: 'Driver Score Display Accuracy',
    description: 'Ensure that driver scores are accurately displayed in the Results page "Your Team\'s Current Story" section, matching the scores stored in the database regardless of score values. Fixes bug where drivers showed default 4/7 instead of actual scores.'
  }).returning();
  
  console.log('Created Epic 32:', epic.id);
  
  // Add scenarios
  const scenarios = [
    {
      epicId: epic.id,
      scenarioNumber: '32.1.1',
      title: 'All-1s assessment displays correctly',
      givenContext: 'a user has completed an assessment with all questions answered as 1 (Strongly Disagree)',
      whenAction: 'the user views the Results page',
      thenOutcome: 'all 7 drivers should display as "1.0/7.0" or "1/7" and all drivers should show "Critical Dysfunction" severity and no driver should show a default score of 4/7',
      status: 'passed'
    },
    {
      epicId: epic.id,
      scenarioNumber: '32.1.2',
      title: 'All-7s assessment displays correctly',
      givenContext: 'a user has completed an assessment with all questions answered as 7 (Strongly Agree)',
      whenAction: 'the user views the Results page',
      thenOutcome: 'all 7 drivers should display as "7.0/7.0" or "7/7" and all drivers should show "Team Strength" severity and the narrative should emphasize strengths, not concerns',
      status: 'passed'
    },
    {
      epicId: epic.id,
      scenarioNumber: '32.1.3',
      title: 'Mixed scores display correctly',
      givenContext: 'a user has completed an assessment with varied scores (Trust=2, Psych Safety=3, TMS=5, Comm Quality=6, Goal Clarity=3, Coordination=5, Team Cognition=6)',
      whenAction: 'the user views the Results page',
      thenOutcome: 'each driver displays its actual score with correct severity classification (Critical/High Risk/Moderate/Strength)',
      status: 'passed'
    },
    {
      epicId: epic.id,
      scenarioNumber: '32.2.1',
      title: 'Driver key mapping is correct',
      givenContext: 'the assessment stores scores with database keys (trust, psych_safety, tms, comm_quality, goal_clarity, coordination, team_cognition)',
      whenAction: 'the Results page generates the team story',
      thenOutcome: 'all database keys correctly map to their corresponding content keys without any undefined lookups',
      status: 'passed'
    },
    {
      epicId: epic.id,
      scenarioNumber: '32.2.2',
      title: 'No default fallback scores are used',
      givenContext: 'a user has completed an assessment with actual scores',
      whenAction: 'the Results page processes driver scores',
      thenOutcome: 'no driver should receive a fallback score of 4 and all drivers should use their actual calculated scores from the database',
      status: 'passed'
    },
    {
      epicId: epic.id,
      scenarioNumber: '32.3.1',
      title: 'Severity classification is accurate',
      givenContext: 'a driver score',
      whenAction: 'severity is calculated',
      thenOutcome: 'scores 1-2 are "Critical Dysfunction", 3-4 are "High Risk", 5 is "Moderate Concern", 6-7 are "Team Strength"',
      status: 'passed'
    },
    {
      epicId: epic.id,
      scenarioNumber: '32.3.2',
      title: 'Overall severity reflects worst driver',
      givenContext: 'an assessment with mixed driver scores',
      whenAction: 'overall severity is determined',
      thenOutcome: 'overall severity correctly reflects the most critical driver present (critical > high > moderate > strength)',
      status: 'passed'
    },
    {
      epicId: epic.id,
      scenarioNumber: '32.4.1',
      title: 'PDF export shows correct scores',
      givenContext: 'a user views Results page with correct driver scores',
      whenAction: 'the user downloads the PDF report',
      thenOutcome: 'the PDF should contain the same driver scores as displayed on the page and no driver should show incorrect scores',
      status: 'pending'
    },
    {
      epicId: epic.id,
      scenarioNumber: '32.4.2',
      title: 'Word document export shows correct scores',
      givenContext: 'a user views Results page with correct driver scores',
      whenAction: 'the user downloads the Word document',
      thenOutcome: 'the Word document should contain the same driver scores as displayed on the page and no driver should show incorrect scores',
      status: 'pending'
    }
  ];
  
  for (const scenario of scenarios) {
    await db.insert(bddScenarios).values(scenario).returning();
    console.log(`Added scenario: ${scenario.scenarioNumber} - ${scenario.title} (${scenario.status})`);
  }
  
  console.log('\nSuccessfully added Epic 32 with 9 BDD scenarios');
  console.log('7 scenarios marked as passed (verified by automated tests)');
  console.log('2 scenarios marked as pending (PDF/Word export verification)');
  process.exit(0);
}

addDriverScoreBugBDD().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
