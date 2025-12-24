import { Button } from "@/components/ui/button";
import { BarChart3, ClipboardCheck } from "lucide-react";

type NavbarProps = {
  onOpenAssessment: () => void;
};

export default function Navbar({ onOpenAssessment }: NavbarProps) {
  return (
    <nav role="navigation" aria-label="Main navigation" className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a 
          href="https://problemops.com" 
          className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          aria-label="Return to ProblemOps homepage"
        >
          <div className="bg-primary h-8 w-8 rounded flex items-center justify-center text-primary-foreground font-bold text-lg">
            P
          </div>
          <span className="font-bold text-xl tracking-tight">ProblemOps <span className="font-normal text-muted-foreground">ROI Calculator</span></span>
        </a>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </Button>
          <Button onClick={onOpenAssessment} className="gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Start Assessment
          </Button>
        </div>
      </div>
    </nav>
  );
}
