import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PiggyBank, RotateCcw, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { filterNumericInput } from "@/lib/inputValidation";
import { trackCalculatorUsage } from "@/lib/analytics";
import jsPDF from "jspdf";

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlySavings, setMonthlySavings] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [retirementCorpus, setRetirementCorpus] = useState<number | null>(null);
  const [yearsToRetirement, setYearsToRetirement] = useState<number | null>(null);
  const { toast } = useToast();

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

  const hasTracked = useRef(false);
  useEffect(() => {
    if (retirementCorpus !== null && !hasTracked.current) {
      trackCalculatorUsage('Retirement', 'calculate');
      hasTracked.current = true;
    } else if (retirementCorpus === null) {
      hasTracked.current = false;
    }
  }, [retirementCorpus]);

  const handleReset = () => {
    trackCalculatorUsage('Retirement', 'reset');
    setCurrentAge("");
    setRetirementAge("");
    setCurrentSavings("");
    setMonthlySavings("");
    setExpectedReturn("");
  };

  const handleDownloadPDF = () => {
    if (retirementCorpus === null) return;
    trackCalculatorUsage('Retirement', 'download');

    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Retirement Planning Calculator", 20, 20);
    
    doc.setFontSize(12);
    doc.text("Input Values:", 20, 40);
    doc.text(`Current Age: ${currentAge} years`, 20, 50);
    doc.text(`Retirement Age: ${retirementAge} years`, 20, 60);
    doc.text(`Current Savings: ₹${currentSavings}`, 20, 70);
    doc.text(`Monthly Savings: ₹${monthlySavings}`, 20, 80);
    doc.text(`Expected Annual Return: ${expectedReturn}%`, 20, 90);
    
    doc.text("Results:", 20, 110);
    doc.text(`Retirement Corpus: ₹${retirementCorpus.toFixed(2)}`, 20, 120);
    doc.text(`Years to Retirement: ${yearsToRetirement} years`, 20, 130);
    const totalInvested = parseFloat(currentSavings) + parseFloat(monthlySavings) * yearsToRetirement! * 12;
    doc.text(`Total Invested: ₹${totalInvested.toFixed(2)}`, 20, 140);
    
    doc.save("retirement-planning.pdf");
  };

  const getShareText = () => {
    if (retirementCorpus === null) return "";
    const totalInvested = parseFloat(currentSavings) + parseFloat(monthlySavings) * yearsToRetirement! * 12;
    return `🏦 Retirement Planning\n\nCurrent Age: ${currentAge} years\nRetirement Age: ${retirementAge} years\nCurrent Savings: ₹${currentSavings}\nMonthly Savings: ₹${monthlySavings}\nExpected Return: ${expectedReturn}%\n\nRetirement Corpus: ₹${retirementCorpus.toFixed(2)}\nYears to Retirement: ${yearsToRetirement} years\nTotal Invested: ₹${totalInvested.toFixed(2)}\n\nCalculated with Financial Calculators`;
  };

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'email') => {
    const text = getShareText();
    const encodedText = encodeURIComponent(text);
    
    let url = '';
    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent('Retirement Planning')}&body=${encodedText}`;
        break;
    }
    
    window.open(url, '_blank');
    toast({
      title: "Sharing",
      description: `Opening ${platform} to share your results`,
    });
  };

  return (
    <Card className="w-full hover:shadow-[0_8px_30px_-4px_hsl(var(--primary)/0.15)] transition-all duration-300 hover:-translate-y-1">
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
              onChange={(e) => setCurrentAge(filterNumericInput(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="retirement-age">Retirement Age</Label>
            <Input
              id="retirement-age"
              type="text"
              placeholder="Years"
              value={retirementAge}
              onChange={(e) => setRetirementAge(filterNumericInput(e.target.value))}
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
            onChange={(e) => setCurrentSavings(filterNumericInput(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthly-savings">Monthly Savings (₹)</Label>
          <Input
            id="monthly-savings"
            type="text"
            placeholder="Enter monthly contribution"
            value={monthlySavings}
            onChange={(e) => setMonthlySavings(filterNumericInput(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expected-return">Expected Annual Return (%)</Label>
          <Input
            id="expected-return"
            type="text"
            placeholder="Enter expected return"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(filterNumericInput(e.target.value))}
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
      <CardFooter className="flex flex-wrap gap-2 px-6 pb-6">
        <Button variant="outline" onClick={handleReset} className="flex-1 min-w-[120px]">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleDownloadPDF} disabled={retirementCorpus === null} className="flex-1 min-w-[120px]">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={retirementCorpus === null} className="flex-1 min-w-[120px]">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
              Share on WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('twitter')}>
              Share on Twitter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('email')}>
              Share via Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default RetirementCalculator;
