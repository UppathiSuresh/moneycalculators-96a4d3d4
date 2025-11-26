import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TrendingUp, RotateCcw, Download } from "lucide-react";
import jsPDF from "jspdf";

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

  const handleReset = () => {
    setPrincipal("");
    setRate("");
    setTime("");
    setFrequency("12");
  };

  const getFrequencyLabel = (value: string) => {
    const labels: { [key: string]: string } = {
      "1": "Annually",
      "2": "Semi-Annually",
      "4": "Quarterly",
      "12": "Monthly",
      "365": "Daily"
    };
    return labels[value] || value;
  };

  const handleDownloadPDF = () => {
    if (futureValue === null) return;

    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Compound Interest Calculator", 20, 20);
    
    doc.setFontSize(12);
    doc.text("Input Values:", 20, 40);
    doc.text(`Principal Amount: ₹${principal}`, 20, 50);
    doc.text(`Annual Interest Rate: ${rate}%`, 20, 60);
    doc.text(`Time Period: ${time} years`, 20, 70);
    doc.text(`Compounding Frequency: ${getFrequencyLabel(frequency)}`, 20, 80);
    
    doc.text("Results:", 20, 100);
    doc.text(`Future Value: ₹${futureValue.toFixed(2)}`, 20, 110);
    doc.text(`Interest Earned: ₹${interestEarned?.toFixed(2)}`, 20, 120);
    doc.text(`Total Return: ${((interestEarned! / parseFloat(principal)) * 100).toFixed(2)}%`, 20, 130);
    
    doc.save("compound-interest-calculation.pdf");
  };

  return (
    <Card className="w-full hover:shadow-[0_8px_30px_-4px_hsl(var(--primary)/0.15)] transition-all duration-300 hover:-translate-y-1">
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
        
        <CardFooter className="flex gap-2 pt-6">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleDownloadPDF} disabled={futureValue === null} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download Result
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default CompoundInterestCalculator;
