import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp } from "lucide-react";

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState("12"); // Monthly by default
  const [futureValue, setFutureValue] = useState<number | null>(null);
  const [interestEarned, setInterestEarned] = useState<number | null>(null);

  useEffect(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);
    const n = parseFloat(frequency);

    if (p > 0 && r > 0 && t > 0 && n > 0) {
      // Compound Interest Formula: A = P(1 + r/n)^(nt)
      const amount = p * Math.pow(1 + r / (n * 100), n * t);
      const interest = amount - p;

      setFutureValue(amount);
      setInterestEarned(interest);
    } else {
      setFutureValue(null);
      setInterestEarned(null);
    }
  }, [principal, rate, time, frequency]);

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle>Compound Interest Calculator</CardTitle>
        </div>
        <CardDescription>Calculate compound interest on your investment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ci-principal">Principal Amount (₹)</Label>
          <Input
            id="ci-principal"
            type="text"
            placeholder="Enter principal amount"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ci-rate">Annual Interest Rate (%)</Label>
          <Input
            id="ci-rate"
            type="text"
            placeholder="Enter interest rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ci-time">Time Period (Years)</Label>
          <Input
            id="ci-time"
            type="text"
            placeholder="Enter time in years"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ci-frequency">Compounding Frequency</Label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger id="ci-frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Annually</SelectItem>
              <SelectItem value="2">Semi-Annually</SelectItem>
              <SelectItem value="4">Quarterly</SelectItem>
              <SelectItem value="12">Monthly</SelectItem>
              <SelectItem value="365">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {futureValue !== null && (
          <div className="mt-6 p-4 bg-primary/10 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Future Value:</span>
              <span className="text-lg font-bold text-primary">₹{futureValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Interest Earned:</span>
              <span className="text-sm font-semibold">₹{interestEarned?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Return:</span>
              <span className="text-sm font-semibold">
                {((interestEarned! / parseFloat(principal)) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompoundInterestCalculator;
