import { Card } from '@/components/ui/card';

export function ProblemOpsPrinciples() {
  const principles = [
    {
      title: 'We believe in both solutions and problems',
      description: 'Problems are not obstacles to avoid—they\'re opportunities to understand. We embrace both finding problems and creating solutions.',
    },
    {
      title: 'We pursue a shared understanding',
      description: 'Teams work best when everyone speaks the same language. We build common definitions, goals, and expectations together.',
    },
    {
      title: 'We prioritize people over platforms',
      description: 'Technology is a tool, but people drive change. We focus on human collaboration, communication, and relationships first.',
    },
    {
      title: 'We deliver change early and often',
      description: 'Small, frequent improvements beat big, delayed launches. We ship quickly, learn fast, and iterate continuously.',
    },
    {
      title: 'We rely on failure as the engine for change',
      description: 'Failure teaches us what works and what doesn\'t. We measure, learn from mistakes, and use that knowledge to improve.',
    },
  ];
  
  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">ProblemOps Principles</h3>
          <p className="text-muted-foreground">
            ProblemOps stands for <strong>Problem-Solving Operations</strong>—the practice of carrying out the change you make. 
            These five principles guide how teams work together to make lasting change.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {principles.map((principle, index) => (
            <div key={index} className="space-y-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{principle.title}</h4>
                  <p className="text-sm text-muted-foreground">{principle.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm">
            <strong>What is ProblemOps?</strong> It's a people-first, multidisciplinary approach to making change. 
            ProblemOps teaches teams how to build shared understanding, unite everyone involved, deliver value incrementally, 
            and measure progress—especially important in the age of AI where human collaboration matters more than ever.
          </p>
        </div>
      </div>
    </Card>
  );
}
