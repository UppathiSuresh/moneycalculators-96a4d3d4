import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Percent, RotateCcw, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { filterNumericInput } from "@/lib/inputValidation";
import { trackCalculatorUsage } from "@/lib/analytics";
import jsPDF from "jspdf";

const InterestCalculator = () => {
  const [principal, setPrincipal] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const { toast } = useToast();

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
  const hasTracked = useRef(false);

  useEffect(() => {
    if (result && !hasTracked.current) {
      trackCalculatorUsage('Interest', 'calculate');
      hasTracked.current = true;
    } else if (!result) {
      hasTracked.current = false;
    }
  }, [result]);

  const handleReset = () => {
    trackCalculatorUsage('Interest', 'reset');
    setPrincipal("");
    setRate("");
    setTime("");
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    trackCalculatorUsage('Interest', 'download');

    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Interest Calculator", 20, 20);
    
    doc.setFontSize(12);
    doc.text("Input Values:", 20, 40);
    doc.text(`Principal Amount: ₹${principal}`, 20, 50);
    doc.text(`Interest Rate: ${rate}% per year`, 20, 60);
    doc.text(`Time Period: ${time} years`, 20, 70);
    
    doc.text("Results:", 20, 90);
    doc.text(`Interest Earned: ₹${result.interest}`, 20, 100);
    doc.text(`Total Amount: ₹${result.totalAmount}`, 20, 110);
    
    doc.save("interest-calculation.pdf");
  };

  const getShareText = () => {
    if (!result) return "";
    return `📊 Simple Interest Calculation\n\nPrincipal: ₹${principal}\nRate: ${rate}% per year\nTime: ${time} years\n\nInterest Earned: ₹${result.interest}\nTotal Amount: ₹${result.totalAmount}\n\nCalculated with Financial Calculators`;
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
        url = `mailto:?subject=${encodeURIComponent('Interest Calculation')}&body=${encodedText}`;
        break;
    }
    
    window.open(url, '_blank');
    toast({
      title: "Sharing",
      description: `Opening ${platform} to share your results`,
    });
  };

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
              onChange={(e) => setPrincipal(filterNumericInput(e.target.value))}
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
              onChange={(e) => setRate(filterNumericInput(e.target.value))}
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
              onChange={(e) => setTime(filterNumericInput(e.target.value))}
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
      <CardFooter className="flex flex-wrap gap-2 px-6 pb-6">
        <Button variant="outline" onClick={handleReset} className="flex-1 min-w-[120px]">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleDownloadPDF} disabled={!result} className="flex-1 min-w-[120px]">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={!result} className="flex-1 min-w-[120px]">
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

export default InterestCalculator;
