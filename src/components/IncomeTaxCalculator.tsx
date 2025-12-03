import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Scale, RotateCcw, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

const IncomeTaxCalculator = () => {
  const [income, setIncome] = useState<string>("");
  const [ageGroup, setAgeGroup] = useState<string>("below60");
  const [deductions, setDeductions] = useState<string>("");
  const [oldRegimeTax, setOldRegimeTax] = useState<number | null>(null);
  const [newRegimeTax, setNewRegimeTax] = useState<number | null>(null);
  const { toast } = useToast();

  const calculateOldRegimeTax = (taxableIncome: number, age: string): number => {
    let tax = 0;
    const exemptionLimit = age === "above80" ? 500000 : age === "60to80" ? 300000 : 250000;

    if (taxableIncome <= exemptionLimit) return 0;

    if (age === "below60") {
      if (taxableIncome > 250000) tax += Math.min(taxableIncome - 250000, 250000) * 0.05;
      if (taxableIncome > 500000) tax += Math.min(taxableIncome - 500000, 500000) * 0.2;
      if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.3;
    } else if (age === "60to80") {
      if (taxableIncome > 300000) tax += Math.min(taxableIncome - 300000, 200000) * 0.05;
      if (taxableIncome > 500000) tax += Math.min(taxableIncome - 500000, 500000) * 0.2;
      if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.3;
    } else {
      if (taxableIncome > 500000) tax += Math.min(taxableIncome - 500000, 500000) * 0.2;
      if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.3;
    }

    // Add cess
    tax += tax * 0.04;
    return Math.round(tax);
  };

  const calculateNewRegimeTax = (grossIncome: number): number => {
    let tax = 0;
    // New regime FY 2023-24 onwards (standard deduction of 50000 allowed)
    const taxableIncome = Math.max(0, grossIncome - 50000);

    if (taxableIncome <= 300000) return 0;
    if (taxableIncome > 300000) tax += Math.min(taxableIncome - 300000, 300000) * 0.05;
    if (taxableIncome > 600000) tax += Math.min(taxableIncome - 600000, 300000) * 0.1;
    if (taxableIncome > 900000) tax += Math.min(taxableIncome - 900000, 300000) * 0.15;
    if (taxableIncome > 1200000) tax += Math.min(taxableIncome - 1200000, 300000) * 0.2;
    if (taxableIncome > 1500000) tax += (taxableIncome - 1500000) * 0.3;

    // Rebate u/s 87A for income up to 7 lakhs
    if (taxableIncome <= 700000) tax = 0;

    // Add cess
    tax += tax * 0.04;
    return Math.round(tax);
  };

  useEffect(() => {
    const grossIncome = parseFloat(income);
    const totalDeductions = parseFloat(deductions) || 0;

    if (grossIncome > 0) {
      const taxableIncomeOld = Math.max(0, grossIncome - totalDeductions);
      setOldRegimeTax(calculateOldRegimeTax(taxableIncomeOld, ageGroup));
      setNewRegimeTax(calculateNewRegimeTax(grossIncome));
    } else {
      setOldRegimeTax(null);
      setNewRegimeTax(null);
    }
  }, [income, ageGroup, deductions]);

  const handleReset = () => {
    setIncome("");
    setAgeGroup("below60");
    setDeductions("");
  };

  const getBetterRegime = () => {
    if (oldRegimeTax === null || newRegimeTax === null) return null;
    if (oldRegimeTax < newRegimeTax) return "old";
    if (newRegimeTax < oldRegimeTax) return "new";
    return "same";
  };

  const handleDownloadPDF = () => {
    if (oldRegimeTax === null) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Income Tax Calculator Results", 20, 20);
    doc.setFontSize(12);
    doc.text(`Gross Income: ₹${income}`, 20, 40);
    doc.text(`Deductions (Old Regime): ₹${deductions || "0"}`, 20, 50);
    doc.text(`Age Group: ${ageGroup === "below60" ? "Below 60" : ageGroup === "60to80" ? "60-80" : "Above 80"}`, 20, 60);
    doc.text(`Old Regime Tax: ₹${oldRegimeTax?.toLocaleString()}`, 20, 80);
    doc.text(`New Regime Tax: ₹${newRegimeTax?.toLocaleString()}`, 20, 90);
    const better = getBetterRegime();
    doc.text(`Better Option: ${better === "old" ? "Old Regime" : better === "new" ? "New Regime" : "Both Same"}`, 20, 100);
    doc.save("income-tax-calculation.pdf");
    toast({ title: "PDF Downloaded", description: "Your tax calculation has been saved." });
  };

  const getShareText = () => {
    const better = getBetterRegime();
    return `Income Tax Calculator Results:\nGross Income: ₹${income}\nOld Regime Tax: ₹${oldRegimeTax?.toLocaleString()}\nNew Regime Tax: ₹${newRegimeTax?.toLocaleString()}\nBetter Option: ${better === "old" ? "Old Regime" : better === "new" ? "New Regime" : "Both Same"}`;
  };

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'email') => {
    const text = encodeURIComponent(getShareText());
    const urls = {
      whatsapp: `https://wa.me/?text=${text}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      email: `mailto:?subject=${encodeURIComponent("Income Tax Calculation Results")}&body=${text}`
    };
    window.open(urls[platform], '_blank');
    toast({ title: "Share", description: `Opening ${platform}...` });
  };

  const betterRegime = getBetterRegime();

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Scale className="h-5 w-5 text-primary" />
          Income Tax Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tax-income">Gross Annual Income (₹)</Label>
          <Input id="tax-income" type="text" placeholder="Enter annual income" value={income} onChange={(e) => setIncome(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Age Group</Label>
          <Select value={ageGroup} onValueChange={setAgeGroup}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="below60">Below 60 years</SelectItem>
              <SelectItem value="60to80">60-80 years</SelectItem>
              <SelectItem value="above80">Above 80 years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tax-deductions">Deductions - Old Regime (₹)</Label>
          <Input id="tax-deductions" type="text" placeholder="80C, 80D, HRA, etc." value={deductions} onChange={(e) => setDeductions(e.target.value)} />
          <p className="text-xs text-muted-foreground">Include 80C, 80D, HRA, LTA, etc.</p>
        </div>
        {oldRegimeTax !== null && (
          <div className="mt-4 space-y-3">
            <div className={`p-4 rounded-lg ${betterRegime === "old" ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500" : "bg-muted"}`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">Old Regime Tax:</span>
                <span className="font-bold text-lg">₹{oldRegimeTax?.toLocaleString()}</span>
              </div>
              {betterRegime === "old" && <p className="text-sm text-green-600 dark:text-green-400 mt-1">✓ Better Option</p>}
            </div>
            <div className={`p-4 rounded-lg ${betterRegime === "new" ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500" : "bg-muted"}`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">New Regime Tax:</span>
                <span className="font-bold text-lg">₹{newRegimeTax?.toLocaleString()}</span>
              </div>
              {betterRegime === "new" && <p className="text-sm text-green-600 dark:text-green-400 mt-1">✓ Better Option</p>}
            </div>
            {betterRegime && betterRegime !== "same" && (
              <p className="text-center text-sm text-muted-foreground">
                You save ₹{Math.abs((oldRegimeTax || 0) - (newRegimeTax || 0)).toLocaleString()} with {betterRegime === "old" ? "Old" : "New"} Regime
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 px-6 pb-6">
        <Button variant="outline" onClick={handleReset} className="min-w-[120px]"><RotateCcw className="h-4 w-4 mr-2" />Reset</Button>
        <Button variant="outline" onClick={handleDownloadPDF} disabled={oldRegimeTax === null} className="min-w-[120px]"><Download className="h-4 w-4 mr-2" />Download</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={oldRegimeTax === null} className="min-w-[120px]"><Share2 className="h-4 w-4 mr-2" />Share</Button>
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

export default IncomeTaxCalculator;
