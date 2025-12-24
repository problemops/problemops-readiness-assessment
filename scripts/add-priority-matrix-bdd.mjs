import { db } from '../server/db.js';
import { bddScenarios, bddEpics } from '../shared/schema.js';

async function addPriorityMatrixBDD() {
  // Add Epic 31
  const [epic] = await db.insert(bddEpics).values({
    epicNumber: 31,
    title: 'Priority Matrix Always-Visible Driver Information',
    description: 'Enhancement to display driver names and scores directly on the Action Priority Matrix chart without requiring hover interaction, improving usability and accessibility.'
  }).returning();
  
  console.log('Created Epic 31:', epic.id);
  
  // Add scenarios
  const scenarios = [
    {
      epicId: epic.id,
      scenarioNumber: '31.1.1',
      title: 'Driver names displayed on chart',
      givenContext: 'the Results page has loaded with assessment data',
      whenAction: 'the user views the Action Priority Matrix',
      thenOutcome: 'each driver should display its name directly on the chart (not just a circle) and the name should be readable without any hover interaction',
      status: 'passed'
    },
    {
      epicId: epic.id,
      scenarioNumber: '31.1.2',
      title: 'Driver scores visible on chart',
      givenContext: 'the Results page has loaded with assessment data',
      whenAction: 'the user views the Action Priority Matrix',
      thenOutcome: 'each driver should display its score (e.g., "3.5/7") alongside or below the name and the score should be visible without hover interaction',
      status: 'passed'
    },
    {
      epicId: epic.id,
      scenarioNumber: '31.1.3',
      title: 'Quadrant color coding preserved',
      givenContext: 'the Results page has loaded with assessment data',
      whenAction: 'the user views the Action Priority Matrix',
      thenOutcome: 'each driver label should use color coding matching its quadrant: Critical (red), Strengths (green), Monitor (yellow), Stable (blue)',
      status: 'passed'
    },
    {
      epicId: epic.id,
      scenarioNumber: '31.2.1',
      title: 'Labels do not overlap',
      givenContext: 'the Results page has loaded with 7 drivers',
      whenAction: 'the user views the Action Priority Matrix',
      thenOutcome: 'driver labels should be positioned to minimize overlap and all driver names should be readable',
      status: 'passed'
    },
    {
      epicId: epic.id,
      scenarioNumber: '31.2.2',
      title: 'Responsive on mobile',
      givenContext: 'the user is viewing on a mobile device (viewport < 768px)',
      whenAction: 'the user views the Action Priority Matrix',
      thenOutcome: 'driver labels should remain readable and the chart should scale appropriately for the viewport',
      status: 'pending'
    },
    {
      epicId: epic.id,
      scenarioNumber: '31.2.3',
      title: 'Dark mode compatibility',
      givenContext: 'the user has enabled dark mode',
      whenAction: 'the user views the Action Priority Matrix',
      thenOutcome: 'all driver labels should have sufficient contrast and quadrant colors should remain distinguishable',
      status: 'pending'
    },
    {
      epicId: epic.id,
      scenarioNumber: '31.3.1',
      title: 'No hover required for information',
      givenContext: 'a user who cannot use a mouse (keyboard-only navigation)',
      whenAction: 'the user views the Action Priority Matrix',
      thenOutcome: 'all driver information should be visible without hover and the user should understand which drivers are in each quadrant',
      status: 'passed'
    },
    {
      epicId: epic.id,
      scenarioNumber: '31.3.2',
      title: 'Screen reader accessible',
      givenContext: 'a user using a screen reader',
      whenAction: 'the Action Priority Matrix is announced',
      thenOutcome: 'the screen reader should convey driver names, scores, and quadrant categories via ARIA labels',
      status: 'passed'
    }
  ];
  
  for (const scenario of scenarios) {
    const [inserted] = await db.insert(bddScenarios).values(scenario).returning();
    console.log('Added scenario:', scenario.scenarioNumber, scenario.title);
  }
  
  console.log('\nSuccessfully added Epic 31 with 8 BDD scenarios');
  process.exit(0);
}

addPriorityMatrixBDD().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
