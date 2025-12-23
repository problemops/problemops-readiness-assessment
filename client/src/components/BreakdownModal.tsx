import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, Info } from "lucide-react";

type Driver = {
  id: string;
  name: string;
  description: string;
  weight: number;
  value: number;
};

type BreakdownModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "cost" | "savings";
  drivers: Driver[];
  teamSize: number;
  avgSalary: number;
  totalAmount: number;
};

export default function BreakdownModal({ 
  isOpen, 
  onClose, 
  type, 
  drivers, 
  teamSize, 
  avgSalary,
  totalAmount 
}: BreakdownModalProps) {
  
  const totalSalary = teamSize * avgSalary;
  const targetScore = 0.85; // 85% baseline for savings

  // Calculate breakdown per driver
  const breakdown = drivers.map(driver => {
    // Calculate this driver's contribution to the total score
    // Formula: (Driver Value * Weight) / Sum(Max Value * Weight)
    // But we need to isolate the *loss* attributed to this driver
    
    // Max possible weighted score for this driver
    const maxWeightedScore = 7 * driver.weight;
    // Actual weighted score
    const actualWeightedScore = driver.value * driver.weight;
    
    // The "gap" for this driver (weighted)
    const weightedGap = maxWeightedScore - actualWeightedScore;
    
    // Total possible weighted score for all drivers (denominator)
    const totalMaxWeightedScore = drivers.reduce((sum, d) => sum + (7 * d.weight), 0);
    
    // This driver's share of the total dysfunction (gap / total max)
    // This represents the % of total salary lost due to this specific driver
    const dysfunctionShare = weightedGap / totalMaxWeightedScore;
    
    const costAmount = dysfunctionShare * totalSalary;

    // For savings: only count if current value < target (85% of 7 = 5.95)
    const targetValue = 5.95;
    const savingsGap = driver.value < targetValue 
      ? (targetValue * driver.weight) - (driver.value * driver.weight)
      : 0;
      
    const savingsShare = savingsGap / totalMaxWeightedScore;
    const savingsAmount = savingsShare * totalSalary;

    return {
      ...driver,
      amount: type === "cost" ? costAmount : savingsAmount,
      percentage: type === "cost" 
        ? (costAmount / totalAmount) * 100 
        : (savingsAmount / totalAmount) * 100
    };
  }).sort((a, b) => b.amount - a.amount); // Sort by highest impact

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full sm:h-auto sm:max-h-[95vh] md:w-[95vw] md:max-w-[95vw] md:h-[95vh] overflow-y-auto flex flex-col p-0 gap-0 rounded-none sm:rounded-lg">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            {type === "cost" ? (
              <>
                <AlertTriangle className="h-6 w-6 text-destructive" />
                Dysfunction Cost Breakdown
              </>
            ) : (
              <>
                <TrendingUp className="h-6 w-6 text-primary" />
                Projected Savings Breakdown
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {type === "cost" 
              ? "See exactly where money is being lost due to team dynamics." 
              : "Potential financial recovery by improving each driver to the 85% functional baseline."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-6 p-6">
          <div className="bg-secondary/50 p-4 rounded-lg border border-border text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
              Total {type === "cost" ? "Annual Loss" : "Potential Savings"}
            </p>
            <p className={`text-4xl font-bold font-mono ${type === "cost" ? "text-destructive" : "text-primary"}`}>
              {formatCurrency(totalAmount)}
            </p>
          </div>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6">
              {breakdown.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="space-y-0.5">
                      <div className="font-medium flex items-center gap-2">
                        {item.name}
                        <span className="text-xs text-muted-foreground font-normal bg-secondary px-1.5 py-0.5 rounded">
                          Score: {item.value.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold font-mono ${type === "cost" ? "text-destructive" : "text-primary"}`}>
                        {formatCurrency(item.amount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.amount > 0 ? `${((item.amount / totalAmount) * 100).toFixed(1)}% of total` : "No impact"}
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={(item.amount / totalAmount) * 100} 
                    className={`h-2 ${type === "cost" ? "[&>div]:bg-destructive" : "[&>div]:bg-primary"}`} 
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
