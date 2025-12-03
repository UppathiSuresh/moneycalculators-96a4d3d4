import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calculator, RotateCcw, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { filterNumericInput } from "@/lib/inputValidation";
import jsPDF from "jspdf";

const EMICalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [emi, setEmi] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const { toast } = useToast();

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

  const handleReset = () => {
    setPrincipal("");
    setRate("");
    setTenure("");
  };

  const handleDownloadPDF = () => {
    if (emi === null) return;

    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("EMI Calculator", 20, 20);
    
    doc.setFontSize(12);
    doc.text("Input Values:", 20, 40);
    doc.text(`Loan Amount: ₹${principal}`, 20, 50);
    doc.text(`Interest Rate: ${rate}% per annum`, 20, 60);
    doc.text(`Loan Tenure: ${tenure} years`, 20, 70);
    
    doc.text("Results:", 20, 90);
    doc.text(`Monthly EMI: ₹${emi.toFixed(2)}`, 20, 100);
    doc.text(`Total Amount: ₹${totalAmount?.toFixed(2)}`, 20, 110);
    doc.text(`Total Interest: ₹${totalInterest?.toFixed(2)}`, 20, 120);
    
    doc.save("emi-calculation.pdf");
  };

  const getShareText = () => {
    if (emi === null) return "";
    return `💰 EMI Calculation\n\nLoan Amount: ₹${principal}\nInterest Rate: ${rate}% p.a.\nTenure: ${tenure} years\n\nMonthly EMI: ₹${emi.toFixed(2)}\nTotal Amount: ₹${totalAmount?.toFixed(2)}\nTotal Interest: ₹${totalInterest?.toFixed(2)}\n\nCalculated with Financial Calculators`;
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
        url = `mailto:?subject=${encodeURIComponent('EMI Calculation')}&body=${encodedText}`;
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
            onChange={(e) => setPrincipal(filterNumericInput(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interest-rate">Interest Rate (% per annum)</Label>
          <Input
            id="interest-rate"
            type="text"
            placeholder="Enter interest rate"
            value={rate}
            onChange={(e) => setRate(filterNumericInput(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenure">Loan Tenure (Years)</Label>
          <Input
            id="tenure"
            type="text"
            placeholder="Enter tenure in years"
            value={tenure}
            onChange={(e) => setTenure(filterNumericInput(e.target.value))}
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
      <CardFooter className="flex flex-wrap gap-2 px-6 pb-6">
        <Button variant="outline" onClick={handleReset} className="flex-1 min-w-[120px]">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleDownloadPDF} disabled={emi === null} className="flex-1 min-w-[120px]">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={emi === null} className="flex-1 min-w-[120px]">
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

export default EMICalculator;
