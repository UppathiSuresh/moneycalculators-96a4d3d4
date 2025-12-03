import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PiggyBank, RotateCcw, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

const RDCalculator = () => {
  const [monthlyDeposit, setMonthlyDeposit] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [tenure, setTenure] = useState<string>("");
  const [maturityAmount, setMaturityAmount] = useState<number | null>(null);
  const [totalDeposited, setTotalDeposited] = useState<number | null>(null);
  const [interestEarned, setInterestEarned] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const P = parseFloat(monthlyDeposit);
    const r = parseFloat(rate) / 100 / 4;
    const n = parseFloat(tenure) * 12;

    if (P > 0 && r > 0 && n > 0) {
      // RD formula with quarterly compounding
      const quarters = Math.ceil(n / 3);
      let maturity = 0;
      for (let i = 0; i < n; i++) {
        const monthsRemaining = n - i;
        const quartersRemaining = monthsRemaining / 3;
        maturity += P * Math.pow(1 + r, quartersRemaining);
      }
      const deposited = P * n;
      setMaturityAmount(Math.round(maturity));
      setTotalDeposited(Math.round(deposited));
      setInterestEarned(Math.round(maturity - deposited));
    } else {
      setMaturityAmount(null);
      setTotalDeposited(null);
      setInterestEarned(null);
    }
  }, [monthlyDeposit, rate, tenure]);

  const handleReset = () => {
    setMonthlyDeposit("");
    setRate("");
    setTenure("");
  };

  const handleDownloadPDF = () => {
    if (!maturityAmount) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("RD Calculator Results", 20, 20);
    doc.setFontSize(12);
    doc.text(`Monthly Deposit: ₹${monthlyDeposit}`, 20, 40);
    doc.text(`Interest Rate: ${rate}% p.a.`, 20, 50);
    doc.text(`Tenure: ${tenure} years`, 20, 60);
    doc.text(`Total Deposited: ₹${totalDeposited?.toLocaleString()}`, 20, 80);
    doc.text(`Interest Earned: ₹${interestEarned?.toLocaleString()}`, 20, 90);
    doc.text(`Maturity Amount: ₹${maturityAmount?.toLocaleString()}`, 20, 100);
    doc.save("rd-calculation.pdf");
    toast({ title: "PDF Downloaded", description: "Your RD calculation has been saved." });
  };

  const getShareText = () => {
    return `RD Calculator Results:\nMonthly Deposit: ₹${monthlyDeposit}\nRate: ${rate}% p.a.\nTenure: ${tenure} years\nMaturity Amount: ₹${maturityAmount?.toLocaleString()}`;
  };

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'email') => {
    const text = encodeURIComponent(getShareText());
    const urls = {
      whatsapp: `https://wa.me/?text=${text}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      email: `mailto:?subject=${encodeURIComponent("RD Calculation Results")}&body=${text}`
    };
    window.open(urls[platform], '_blank');
    toast({ title: "Share", description: `Opening ${platform}...` });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <PiggyBank className="h-5 w-5 text-primary" />
          RD Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rd-monthly">Monthly Deposit (₹)</Label>
          <Input id="rd-monthly" type="text" placeholder="Enter monthly deposit" value={monthlyDeposit} onChange={(e) => setMonthlyDeposit(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rd-rate">Interest Rate (% p.a.)</Label>
          <Input id="rd-rate" type="text" placeholder="Enter interest rate" value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rd-tenure">Tenure (Years)</Label>
          <Input id="rd-tenure" type="text" placeholder="Enter tenure" value={tenure} onChange={(e) => setTenure(e.target.value)} />
        </div>
        {maturityAmount && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Total Deposited:</span><span className="font-semibold">₹{totalDeposited?.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Interest Earned:</span><span className="font-semibold text-green-600">₹{interestEarned?.toLocaleString()}</span></div>
            <div className="flex justify-between border-t pt-2"><span className="text-muted-foreground">Maturity Amount:</span><span className="font-bold text-primary text-lg">₹{maturityAmount?.toLocaleString()}</span></div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 px-6 pb-6">
        <Button variant="outline" onClick={handleReset} className="min-w-[120px]"><RotateCcw className="h-4 w-4 mr-2" />Reset</Button>
        <Button variant="outline" onClick={handleDownloadPDF} disabled={!maturityAmount} className="min-w-[120px]"><Download className="h-4 w-4 mr-2" />Download</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={!maturityAmount} className="min-w-[120px]"><Share2 className="h-4 w-4 mr-2" />Share</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleShare('whatsapp')}>WhatsApp</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('twitter')}>Twitter</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('email')}>Email</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default RDCalculator;
