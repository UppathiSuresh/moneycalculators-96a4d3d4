import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PiggyBank } from "lucide-react";

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlySavings, setMonthlySavings] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [retirementCorpus, setRetirementCorpus] = useState<number | null>(null);
  const [yearsToRetirement, setYearsToRetirement] = useState<number | null>(null);

  useEffect(() => {
    const age = parseFloat(currentAge);
    const retAge = parseFloat(retirementAge);
    const current = parseFloat(currentSavings);
    const monthly = parseFloat(monthlySavings);
    const returnRate = parseFloat(expectedReturn);

    if (age > 0 && retAge > age && current >= 0 && monthly >= 0 && returnRate > 0) {
      const years = retAge - age;
      const months = years * 12;
      const monthlyRate = returnRate / (12 * 100);

      // Future value of current savings
      const fvCurrent = current * Math.pow(1 + returnRate / 100, years);

      // Future value of monthly savings (Future Value of Annuity)
      const fvMonthly = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

      const totalCorpus = fvCurrent + fvMonthly;

      setRetirementCorpus(totalCorpus);
      setYearsToRetirement(years);
    } else {
      setRetirementCorpus(null);
      setYearsToRetirement(null);
    }
  }, [currentAge, retirementAge, currentSavings, monthlySavings, expectedReturn]);

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5 text-primary" />
          <CardTitle>Retirement Planning Calculator</CardTitle>
        </div>
        <CardDescription>Plan your retirement savings goal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="current-age">Current Age</Label>
            <Input
              id="current-age"
              type="text"
              placeholder="Years"
              value={currentAge}
              onChange={(e) => setCurrentAge(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="retirement-age">Retirement Age</Label>
            <Input
              id="retirement-age"
              type="text"
              placeholder="Years"
              value={retirementAge}
              onChange={(e) => setRetirementAge(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="current-savings">Current Savings (₹)</Label>
          <Input
            id="current-savings"
            type="text"
            placeholder="Enter current savings"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthly-savings">Monthly Savings (₹)</Label>
          <Input
            id="monthly-savings"
            type="text"
            placeholder="Enter monthly contribution"
            value={monthlySavings}
            onChange={(e) => setMonthlySavings(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expected-return">Expected Annual Return (%)</Label>
          <Input
            id="expected-return"
            type="text"
            placeholder="Enter expected return"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(e.target.value)}
          />
        </div>

        {retirementCorpus !== null && yearsToRetirement !== null && (
          <div className="mt-6 p-4 bg-primary/10 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Retirement Corpus:</span>
              <span className="text-lg font-bold text-primary">₹{retirementCorpus.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Years to Retirement:</span>
              <span className="text-sm font-semibold">{yearsToRetirement} years</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Invested:</span>
              <span className="text-sm font-semibold">
                ₹{(parseFloat(currentSavings) + parseFloat(monthlySavings) * yearsToRetirement * 12).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RetirementCalculator;
