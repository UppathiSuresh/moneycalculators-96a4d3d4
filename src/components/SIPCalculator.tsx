import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TrendingUp, RotateCcw, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

  const handleReset = () => {
    setMonthlyInvestment("");
    setExpectedReturn("");
    setTimePeriod("");
  };

  const handleDownloadPDF = () => {
    if (!maturityAmount) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("SIP Calculator Results", 20, 20);
    doc.setFontSize(12);
    doc.text(`Monthly Investment: ₹${monthlyInvestment}`, 20, 40);
    doc.text(`Expected Return: ${expectedReturn}% p.a.`, 20, 50);
    doc.text(`Time Period: ${timePeriod} years`, 20, 60);
    doc.text(`Total Invested: ₹${totalInvested?.toLocaleString()}`, 20, 80);
    doc.text(`Wealth Gained: ₹${wealthGained?.toLocaleString()}`, 20, 90);
    doc.text(`Maturity Amount: ₹${maturityAmount?.toLocaleString()}`, 20, 100);
    doc.save("sip-calculation.pdf");
    toast({ title: "PDF Downloaded", description: "Your SIP calculation has been saved." });
  };

  const getShareText = () => {
    return `SIP Calculator Results:\nMonthly Investment: ₹${monthlyInvestment}\nExpected Return: ${expectedReturn}% p.a.\nTime Period: ${timePeriod} years\nMaturity Amount: ₹${maturityAmount?.toLocaleString()}`;
  };

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'email') => {
    const text = encodeURIComponent(getShareText());
    const urls = {
      whatsapp: `https://wa.me/?text=${text}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      email: `mailto:?subject=${encodeURIComponent("SIP Calculation Results")}&body=${text}`
    };
    window.open(urls[platform], '_blank');
    toast({ title: "Share", description: `Opening ${platform}...` });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <TrendingUp className="h-5 w-5 text-primary" />
          SIP Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sip-monthly">Monthly Investment (₹)</Label>
          <Input id="sip-monthly" type="text" placeholder="Enter monthly amount" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sip-return">Expected Return (% p.a.)</Label>
          <Input id="sip-return" type="text" placeholder="Enter expected return" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sip-period">Time Period (Years)</Label>
          <Input id="sip-period" type="text" placeholder="Enter time period" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} />
        </div>
        {maturityAmount && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Total Invested:</span><span className="font-semibold">₹{totalInvested?.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Wealth Gained:</span><span className="font-semibold text-green-600">₹{wealthGained?.toLocaleString()}</span></div>
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

export default SIPCalculator;
