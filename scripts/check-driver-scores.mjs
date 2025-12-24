import { getDb } from '../server/db.js';
import { assessments, assessmentData } from '../drizzle/schema.js';
import { eq, desc } from 'drizzle-orm';

async function checkScores() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const results = await db
    .select({
      id: assessments.id,
      companyName: assessments.companyName,
      readinessScore: assessments.readinessScore,
      driverScores: assessmentData.driverScores,
      answers: assessmentData.answers
    })
    .from(assessments)
    .innerJoin(assessmentData, eq(assessments.id, assessmentData.assessmentId))
    .orderBy(desc(assessments.createdAt))
    .limit(5);
  
  results.forEach(r => {
    console.log('\n=== Assessment:', r.companyName, '===');
    console.log('ID:', r.id);
    console.log('Readiness Score:', r.readinessScore);
    
    const scores = JSON.parse(r.driverScores);
    console.log('Driver Scores:', JSON.stringify(scores, null, 2));
    
    // Check if this looks like an all-1s test
    const allOnes = Object.values(scores).every(s => s === 1);
    if (allOnes) {
      console.log('>>> THIS IS AN ALL-1s ASSESSMENT <<<');
      const answers = JSON.parse(r.answers);
      console.log('Total answers:', Object.keys(answers).length);
      console.log('Sample answers:', Object.entries(answers).slice(0, 10));
    }
  });
  
  process.exit(0);
}

checkScores().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
