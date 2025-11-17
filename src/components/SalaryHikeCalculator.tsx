import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp } from "lucide-react";

const SalaryHikeCalculator = () => {
  const [currentSalary, setCurrentSalary] = useState<string>("");
  const [hikePercentage, setHikePercentage] = useState<string>("");

  const calculateHike = () => {
    const current = parseFloat(currentSalary);
    const hike = parseFloat(hikePercentage);

    if (!current || !hike || current <= 0 || hike < 0) return null;

    const incrementalAmount = (current * hike) / 100;
    const newSalary = current + incrementalAmount;

    return {
      incrementalAmount: incrementalAmount.toFixed(2),
      newSalary: newSalary.toFixed(2),
      hikePercentage: hike.toFixed(2),
    };
  };

  const result = calculateHike();

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Salary Hike Calculator</CardTitle>
        </div>
        <CardDescription>Calculate your salary increase percentage and amount</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-salary">Current Salary (₹)</Label>
            <Input
              id="current-salary"
              type="number"
              placeholder="Enter current salary"
              value={currentSalary}
              onChange={(e) => setCurrentSalary(e.target.value)}
              className="shadow-[var(--shadow-input)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hike-percentage">Hike Percentage (%)</Label>
            <Input
              id="hike-percentage"
              type="number"
              placeholder="Enter hike percentage"
              value={hikePercentage}
              onChange={(e) => setHikePercentage(e.target.value)}
              className="shadow-[var(--shadow-input)]"
            />
          </div>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-secondary rounded-lg border border-primary/20">
            <h3 className="text-lg font-semibold text-secondary-foreground mb-4">Results</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Incremental Amount:</span>
                <span className="text-2xl font-bold text-primary">₹{result.incrementalAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">New Salary:</span>
                <span className="text-xl font-semibold text-accent">₹{result.newSalary}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalaryHikeCalculator;
