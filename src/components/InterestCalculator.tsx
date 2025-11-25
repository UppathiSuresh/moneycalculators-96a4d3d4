import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Percent } from "lucide-react";

const InterestCalculator = () => {
  const [principal, setPrincipal] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  const calculateInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);

    if (!p || !r || !t || p <= 0 || r < 0 || t < 0) return null;

    const simpleInterest = (p * r * t) / 100;
    const totalAmount = p + simpleInterest;

    return {
      interest: simpleInterest.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    };
  };

  const result = calculateInterest();

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50 hover:shadow-[0_8px_30px_-4px_hsl(var(--primary)/0.15)] transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Percent className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Interest Calculator</CardTitle>
        </div>
        <CardDescription>Calculate simple interest on your principal amount</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="principal">Principal Amount (₹)</Label>
            <Input
              id="principal"
              type="text"
              placeholder="Enter principal amount"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="shadow-[var(--shadow-input)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rate">Interest Rate (% per year)</Label>
            <Input
              id="rate"
              type="text"
              placeholder="Enter interest rate"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="shadow-[var(--shadow-input)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time Period (years)</Label>
            <Input
              id="time"
              type="text"
              placeholder="Enter time in years"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="shadow-[var(--shadow-input)]"
            />
          </div>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-secondary rounded-lg border border-primary/20">
            <h3 className="text-lg font-semibold text-secondary-foreground mb-4">Results</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Interest Earned:</span>
                <span className="text-xl font-semibold text-accent">₹{result.interest}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="text-2xl font-bold text-primary">₹{result.totalAmount}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InterestCalculator;
