import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TrendingUp, RotateCcw, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { filterNumericInput } from "@/lib/inputValidation";
import { trackCalculatorUsage } from "@/lib/analytics";
import jsPDF from "jspdf";

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>("");
  const [expectedReturn, setExpectedReturn] = useState<string>("");
  const [timePeriod, setTimePeriod] = useState<string>("");
  const [maturityAmount, setMaturityAmount] = useState<number | null>(null);
  const [totalInvested, setTotalInvested] = useState<number | null>(null);
  const [wealthGained, setWealthGained] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const P = parseFloat(monthlyInvestment);
    const r = parseFloat(expectedReturn) / 100 / 12;
    const n = parseFloat(timePeriod) * 12;

    if (P > 0 && r > 0 && n > 0) {
      const maturity = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      const invested = P * n;
      setMaturityAmount(Math.round(maturity));
      setTotalInvested(Math.round(invested));
      setWealthGained(Math.round(maturity - invested));
    } else {
      setMaturityAmount(null);
      setTotalInvested(null);
      setWealthGained(null);
    }
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  const hasTracked = useRef(false);
  useEffect(() => {
    if (maturityAmount !== null && !hasTracked.current) {
      trackCalculatorUsage('SIP', 'calculate');
      hasTracked.current = true;
    } else if (maturityAmount === null) {
      hasTracked.current = false;
    }
  }, [maturityAmount]);

  const handleReset = () => {
    trackCalculatorUsage('SIP', 'reset');
    setMonthlyInvestment("");
    setExpectedReturn("");
    setTimePeriod("");
  };

  const handleDownloadPDF = () => {
    if (!maturityAmount) return;
    trackCalculatorUsage('SIP', 'download');
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("SIP Calculator Results", 20, 20);
    doc.setFontSize(12);
    doc.text("Input Values:", 20, 40);
    doc.text(`Monthly Investment: ₹${monthlyInvestment}`, 20, 50);
    doc.text(`Expected Return: ${expectedReturn}% p.a.`, 20, 60);
    doc.text(`Time Period: ${timePeriod} years`, 20, 70);
    doc.text("Results:", 20, 90);
    doc.text(`Total Invested: ₹${totalInvested?.toLocaleString()}`, 20, 100);
    doc.text(`Wealth Gained: ₹${wealthGained?.toLocaleString()}`, 20, 110);
    doc.text(`Maturity Amount: ₹${maturityAmount?.toLocaleString()}`, 20, 120);
    doc.save("sip-calculation.pdf");
    toast({ title: "PDF Downloaded", description: "Your SIP calculation has been saved." });
  };

  const getShareText = () => {
    return `📈 SIP Calculator Results\n\nMonthly Investment: ₹${monthlyInvestment}\nExpected Return: ${expectedReturn}% p.a.\nTime Period: ${timePeriod} years\nMaturity Amount: ₹${maturityAmount?.toLocaleString()}\n\nCalculated with Financial Calculators`;
  };

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'email') => {
    const text = encodeURIComponent(getShareText());
    const urls = {
      whatsapp: `https://wa.me/?text=${text}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      email: `mailto:?subject=${encodeURIComponent("SIP Calculation Results")}&body=${text}`
    };
    window.open(urls[platform], '_blank');
    toast({ title: "Sharing", description: `Opening ${platform} to share your results` });
  };

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50 hover:shadow-[0_8px_30px_-4px_hsl(var(--primary)/0.15)] transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">SIP Calculator</CardTitle>
        </div>
        <CardDescription>Calculate your SIP returns and wealth creation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sip-monthly">Monthly Investment (₹)</Label>
            <Input
              id="sip-monthly"
              type="text"
              placeholder="Enter monthly amount"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(filterNumericInput(e.target.value))}
              className="shadow-[var(--shadow-input)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sip-return">Expected Return (% p.a.)</Label>
            <Input
              id="sip-return"
              type="text"
              placeholder="Enter expected return"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(filterNumericInput(e.target.value))}
              className="shadow-[var(--shadow-input)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sip-period">Time Period (Years)</Label>
            <Input
              id="sip-period"
              type="text"
              placeholder="Enter time period"
              value={timePeriod}
              onChange={(e) => setTimePeriod(filterNumericInput(e.target.value))}
              className="shadow-[var(--shadow-input)]"
            />
          </div>
        </div>

        {maturityAmount && (
          <div className="mt-6 p-6 bg-secondary rounded-lg border border-primary/20">
            <h3 className="text-lg font-semibold text-secondary-foreground mb-4">Results</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Invested:</span>
                <span className="text-xl font-semibold">₹{totalInvested?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Wealth Gained:</span>
                <span className="text-xl font-semibold text-accent">₹{wealthGained?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-3">
                <span className="text-muted-foreground">Maturity Amount:</span>
                <span className="text-2xl font-bold text-primary">₹{maturityAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 px-6 pb-6">
        <Button variant="outline" onClick={handleReset} className="flex-1 min-w-[120px]">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleDownloadPDF} disabled={!maturityAmount} className="flex-1 min-w-[120px]">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={!maturityAmount} className="flex-1 min-w-[120px]">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleShare('whatsapp')}>Share on WhatsApp</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('twitter')}>Share on Twitter</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('email')}>Share via Email</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default SIPCalculator;
