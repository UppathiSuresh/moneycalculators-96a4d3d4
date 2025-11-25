import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

const EMICalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [emi, setEmi] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);

  useEffect(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(tenure);

    if (p > 0 && r > 0 && t > 0) {
      // Monthly interest rate
      const monthlyRate = r / (12 * 100);
      // Number of months
      const months = t * 12;
      
      // EMI Formula: P × r × (1 + r)^n / ((1 + r)^n - 1)
      const emiValue = (p * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                       (Math.pow(1 + monthlyRate, months) - 1);
      
      const totalPaid = emiValue * months;
      const interestPaid = totalPaid - p;

      setEmi(emiValue);
      setTotalAmount(totalPaid);
      setTotalInterest(interestPaid);
    } else {
      setEmi(null);
      setTotalAmount(null);
      setTotalInterest(null);
    }
  }, [principal, rate, tenure]);

  return (
    <Card className="w-full hover:shadow-[0_8px_30px_-4px_hsl(var(--primary)/0.15)] transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>EMI Calculator</CardTitle>
        </div>
        <CardDescription>Calculate your monthly loan installment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
          <Input
            id="loan-amount"
            type="text"
            placeholder="Enter loan amount"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interest-rate">Interest Rate (% per annum)</Label>
          <Input
            id="interest-rate"
            type="text"
            placeholder="Enter interest rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenure">Loan Tenure (Years)</Label>
          <Input
            id="tenure"
            type="text"
            placeholder="Enter tenure in years"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
          />
        </div>

        {emi !== null && (
          <div className="mt-6 p-4 bg-primary/10 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Monthly EMI:</span>
              <span className="text-lg font-bold text-primary">₹{emi.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Amount:</span>
              <span className="text-sm font-semibold">₹{totalAmount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Interest:</span>
              <span className="text-sm font-semibold">₹{totalInterest?.toFixed(2)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EMICalculator;
