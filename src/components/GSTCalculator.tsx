import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Receipt, RotateCcw, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { filterNumericInput } from "@/lib/inputValidation";
import { trackCalculatorUsage } from "@/lib/analytics";
import jsPDF from "jspdf";

const GSTCalculator = () => {
  const [amount, setAmount] = useState<string>("");
  const [gstRate, setGstRate] = useState<string>("18");
  const [calcType, setCalcType] = useState<string>("exclusive");
  const [gstAmount, setGstAmount] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [originalAmount, setOriginalAmount] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const amt = parseFloat(amount);
    const rate = parseFloat(gstRate);

    if (amt > 0 && rate >= 0) {
      if (calcType === "exclusive") {
        // Amount is excluding GST, calculate GST to add
        const gst = (amt * rate) / 100;
        setGstAmount(Math.round(gst * 100) / 100);
        setTotalAmount(Math.round((amt + gst) * 100) / 100);
        setOriginalAmount(amt);
      } else {
        // Amount is including GST, calculate original amount
        const original = (amt * 100) / (100 + rate);
        const gst = amt - original;
        setGstAmount(Math.round(gst * 100) / 100);
        setTotalAmount(amt);
        setOriginalAmount(Math.round(original * 100) / 100);
      }
    } else {
      setGstAmount(null);
      setTotalAmount(null);
      setOriginalAmount(null);
    }
  }, [amount, gstRate, calcType]);

  const hasTracked = useRef(false);
  useEffect(() => {
    if (gstAmount !== null && !hasTracked.current) {
      trackCalculatorUsage('GST', 'calculate');
      hasTracked.current = true;
    } else if (gstAmount === null) {
      hasTracked.current = false;
    }
  }, [gstAmount]);

  const handleReset = () => {
    trackCalculatorUsage('GST', 'reset');
    setAmount("");
    setGstRate("18");
    setCalcType("exclusive");
  };

  const handleDownloadPDF = () => {
    if (!gstAmount) return;
    trackCalculatorUsage('GST', 'download');
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("GST Calculator Results", 20, 20);
    doc.setFontSize(12);
    doc.text("Input Values:", 20, 40);
    doc.text(`Calculation Type: ${calcType === "exclusive" ? "GST Exclusive" : "GST Inclusive"}`, 20, 50);
    doc.text(`Amount Entered: ₹${amount}`, 20, 60);
    doc.text(`GST Rate: ${gstRate}%`, 20, 70);
    doc.text("Results:", 20, 90);
    doc.text(`Original Amount: ₹${originalAmount?.toLocaleString()}`, 20, 100);
    doc.text(`GST Amount: ₹${gstAmount?.toLocaleString()}`, 20, 110);
    doc.text(`Total Amount: ₹${totalAmount?.toLocaleString()}`, 20, 120);
    doc.save("gst-calculation.pdf");
    toast({ title: "PDF Downloaded", description: "Your GST calculation has been saved." });
  };

  const getShareText = () => {
    return `🧾 GST Calculator Results\n\nOriginal Amount: ₹${originalAmount?.toLocaleString()}\nGST (${gstRate}%): ₹${gstAmount?.toLocaleString()}\nTotal Amount: ₹${totalAmount?.toLocaleString()}\n\nCalculated with Financial Calculators`;
  };

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'email') => {
    const text = encodeURIComponent(getShareText());
    const urls = {
      whatsapp: `https://wa.me/?text=${text}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      email: `mailto:?subject=${encodeURIComponent("GST Calculation Results")}&body=${text}`
    };
    window.open(urls[platform], '_blank');
    toast({ title: "Sharing", description: `Opening ${platform} to share your results` });
  };

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50 hover:shadow-[0_8px_30px_-4px_hsl(var(--primary)/0.15)] transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Receipt className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">GST Calculator</CardTitle>
        </div>
        <CardDescription>Calculate GST amount for your transactions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Calculation Type</Label>
            <RadioGroup value={calcType} onValueChange={setCalcType} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exclusive" id="gst-exclusive" />
                <Label htmlFor="gst-exclusive" className="cursor-pointer font-normal">Add GST</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inclusive" id="gst-inclusive" />
                <Label htmlFor="gst-inclusive" className="cursor-pointer font-normal">Remove GST</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gst-amount">Amount (₹)</Label>
            <Input
              id="gst-amount"
              type="text"
              placeholder={calcType === "exclusive" ? "Enter amount (excl. GST)" : "Enter amount (incl. GST)"}
              value={amount}
              onChange={(e) => setAmount(filterNumericInput(e.target.value))}
              className="shadow-[var(--shadow-input)]"
            />
          </div>
          <div className="space-y-2">
            <Label>GST Rate</Label>
            <Select value={gstRate} onValueChange={setGstRate}>
              <SelectTrigger className="shadow-[var(--shadow-input)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0%</SelectItem>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="12">12%</SelectItem>
                <SelectItem value="18">18%</SelectItem>
                <SelectItem value="28">28%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {gstAmount !== null && (
          <div className="mt-6 p-6 bg-secondary rounded-lg border border-primary/20">
            <h3 className="text-lg font-semibold text-secondary-foreground mb-4">Results</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Original Amount:</span>
                <span className="text-xl font-semibold">₹{originalAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">GST ({gstRate}%):</span>
                <span className="text-xl font-semibold text-accent">₹{gstAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-3">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="text-2xl font-bold text-primary">₹{totalAmount?.toLocaleString()}</span>
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
        <Button onClick={handleDownloadPDF} disabled={gstAmount === null} className="flex-1 min-w-[120px]">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={gstAmount === null} className="flex-1 min-w-[120px]">
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

export default GSTCalculator;
