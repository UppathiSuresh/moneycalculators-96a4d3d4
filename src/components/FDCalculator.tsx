import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Landmark, RotateCcw, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

  const handleReset = () => {
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
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("FD Calculator Results", 20, 20);
    doc.setFontSize(12);
    doc.text(`Principal Amount: ₹${principal}`, 20, 40);
    doc.text(`Interest Rate: ${rate}% p.a.`, 20, 50);
    doc.text(`Tenure: ${tenure} years`, 20, 60);
    doc.text(`Compounding: ${getCompoundingLabel(compounding)}`, 20, 70);
    doc.text(`Interest Earned: ₹${interestEarned?.toLocaleString()}`, 20, 90);
    doc.text(`Maturity Amount: ₹${maturityAmount?.toLocaleString()}`, 20, 100);
    doc.save("fd-calculation.pdf");
    toast({ title: "PDF Downloaded", description: "Your FD calculation has been saved." });
  };

  const getShareText = () => {
    return `FD Calculator Results:\nPrincipal: ₹${principal}\nRate: ${rate}% p.a.\nTenure: ${tenure} years\nMaturity Amount: ₹${maturityAmount?.toLocaleString()}`;
  };

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'email') => {
    const text = encodeURIComponent(getShareText());
    const urls = {
      whatsapp: `https://wa.me/?text=${text}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      email: `mailto:?subject=${encodeURIComponent("FD Calculation Results")}&body=${text}`
    };
    window.open(urls[platform], '_blank');
    toast({ title: "Share", description: `Opening ${platform}...` });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Landmark className="h-5 w-5 text-primary" />
          FD Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fd-principal">Principal Amount (₹)</Label>
          <Input id="fd-principal" type="text" placeholder="Enter principal" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fd-rate">Interest Rate (% p.a.)</Label>
          <Input id="fd-rate" type="text" placeholder="Enter interest rate" value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fd-tenure">Tenure (Years)</Label>
          <Input id="fd-tenure" type="text" placeholder="Enter tenure" value={tenure} onChange={(e) => setTenure(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Compounding Frequency</Label>
          <Select value={compounding} onValueChange={setCompounding}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Annually</SelectItem>
              <SelectItem value="2">Semi-Annually</SelectItem>
              <SelectItem value="4">Quarterly</SelectItem>
              <SelectItem value="12">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {maturityAmount && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Principal:</span><span className="font-semibold">₹{parseFloat(principal).toLocaleString()}</span></div>
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

export default FDCalculator;
