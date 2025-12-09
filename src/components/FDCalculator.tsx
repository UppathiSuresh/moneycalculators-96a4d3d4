import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Landmark, RotateCcw, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { filterNumericInput } from "@/lib/inputValidation";
import { trackCalculatorUsage } from "@/lib/analytics";
import jsPDF from "jspdf";

const FDCalculator = () => {
  const [principal, setPrincipal] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [tenure, setTenure] = useState<string>("");
  const [compounding, setCompounding] = useState<string>("4");
  const [maturityAmount, setMaturityAmount] = useState<number | null>(null);
  const [interestEarned, setInterestEarned] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(tenure);
    const n = parseFloat(compounding);

    if (P > 0 && r > 0 && t > 0 && n > 0) {
      const maturity = P * Math.pow(1 + r / n, n * t);
      setMaturityAmount(Math.round(maturity));
      setInterestEarned(Math.round(maturity - P));
    } else {
      setMaturityAmount(null);
      setInterestEarned(null);
    }
  }, [principal, rate, tenure, compounding]);

  const hasTracked = useRef(false);
  useEffect(() => {
    if (maturityAmount !== null && !hasTracked.current) {
      trackCalculatorUsage('FD', 'calculate');
      hasTracked.current = true;
    } else if (maturityAmount === null) {
      hasTracked.current = false;
    }
  }, [maturityAmount]);

  const handleReset = () => {
    trackCalculatorUsage('FD', 'reset');
    setPrincipal("");
    setRate("");
    setTenure("");
    setCompounding("4");
  };

  const getCompoundingLabel = (value: string) => {
    const labels: Record<string, string> = { "1": "Annually", "2": "Semi-Annually", "4": "Quarterly", "12": "Monthly" };
    return labels[value] || value;
  };

  const handleDownloadPDF = () => {
    if (!maturityAmount) return;
    trackCalculatorUsage('FD', 'download');
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("FD Calculator Results", 20, 20);
    doc.setFontSize(12);
    doc.text("Input Values:", 20, 40);
    doc.text(`Principal Amount: ₹${principal}`, 20, 50);
    doc.text(`Interest Rate: ${rate}% p.a.`, 20, 60);
    doc.text(`Tenure: ${tenure} years`, 20, 70);
    doc.text(`Compounding: ${getCompoundingLabel(compounding)}`, 20, 80);
    doc.text("Results:", 20, 100);
    doc.text(`Interest Earned: ₹${interestEarned?.toLocaleString()}`, 20, 110);
    doc.text(`Maturity Amount: ₹${maturityAmount?.toLocaleString()}`, 20, 120);
    doc.save("fd-calculation.pdf");
    toast({ title: "PDF Downloaded", description: "Your FD calculation has been saved." });
  };

  const getShareText = () => {
    return `🏦 FD Calculator Results\n\nPrincipal: ₹${principal}\nRate: ${rate}% p.a.\nTenure: ${tenure} years\nMaturity Amount: ₹${maturityAmount?.toLocaleString()}\n\nCalculated with Financial Calculators`;
  };

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'email') => {
    const text = encodeURIComponent(getShareText());
    const urls = {
      whatsapp: `https://wa.me/?text=${text}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      email: `mailto:?subject=${encodeURIComponent("FD Calculation Results")}&body=${text}`
    };
    window.open(urls[platform], '_blank');
    toast({ title: "Sharing", description: `Opening ${platform} to share your results` });
  };

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50 hover:shadow-[0_8px_30px_-4px_hsl(var(--primary)/0.15)] transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Landmark className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">FD Calculator</CardTitle>
        </div>
        <CardDescription>Calculate your Fixed Deposit maturity amount</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fd-principal">Principal Amount (₹)</Label>
            <Input
              id="fd-principal"
              type="text"
              placeholder="Enter principal"
              value={principal}
              onChange={(e) => setPrincipal(filterNumericInput(e.target.value))}
              className="shadow-[var(--shadow-input)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fd-rate">Interest Rate (% p.a.)</Label>
            <Input
              id="fd-rate"
              type="text"
              placeholder="Enter interest rate"
              value={rate}
              onChange={(e) => setRate(filterNumericInput(e.target.value))}
              className="shadow-[var(--shadow-input)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fd-tenure">Tenure (Years)</Label>
            <Input
              id="fd-tenure"
              type="text"
              placeholder="Enter tenure"
              value={tenure}
              onChange={(e) => setTenure(filterNumericInput(e.target.value))}
              className="shadow-[var(--shadow-input)]"
            />
          </div>
          <div className="space-y-2">
            <Label>Compounding Frequency</Label>
            <Select value={compounding} onValueChange={setCompounding}>
              <SelectTrigger className="shadow-[var(--shadow-input)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Annually</SelectItem>
                <SelectItem value="2">Semi-Annually</SelectItem>
                <SelectItem value="4">Quarterly</SelectItem>
                <SelectItem value="12">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {maturityAmount && (
          <div className="mt-6 p-6 bg-secondary rounded-lg border border-primary/20">
            <h3 className="text-lg font-semibold text-secondary-foreground mb-4">Results</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Principal:</span>
                <span className="text-xl font-semibold">₹{parseFloat(principal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Interest Earned:</span>
                <span className="text-xl font-semibold text-accent">₹{interestEarned?.toLocaleString()}</span>
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

export default FDCalculator;
