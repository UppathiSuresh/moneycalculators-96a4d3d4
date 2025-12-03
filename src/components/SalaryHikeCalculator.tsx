import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TrendingUp, RotateCcw, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { filterNumericInput } from "@/lib/inputValidation";
import jsPDF from "jspdf";

const SalaryHikeCalculator = () => {
  const [currentSalary, setCurrentSalary] = useState<string>("");
  const [hikePercentage, setHikePercentage] = useState<string>("");
  const [newSalary, setNewSalary] = useState<string>("");
  const [calculationMode, setCalculationMode] = useState<"percentage" | "salary">("percentage");
  const { toast } = useToast();

  const calculateHike = () => {
    const current = parseFloat(currentSalary);

    if (!current || current <= 0) return null;

    if (calculationMode === "percentage") {
      const hike = parseFloat(hikePercentage);
      if (!hike || hike < 0) return null;

      const incrementalAmount = (current * hike) / 100;
      const calculatedNewSalary = current + incrementalAmount;

      return {
        incrementalAmount: incrementalAmount.toFixed(2),
        newSalary: calculatedNewSalary.toFixed(2),
        hikePercentage: hike.toFixed(2),
      };
    } else {
      const newSal = parseFloat(newSalary);
      if (!newSal || newSal <= current) return null;

      const incrementalAmount = newSal - current;
      const calculatedHikePercentage = (incrementalAmount / current) * 100;

      return {
        incrementalAmount: incrementalAmount.toFixed(2),
        newSalary: newSal.toFixed(2),
        hikePercentage: calculatedHikePercentage.toFixed(2),
      };
    }
  };

  const result = calculateHike();

  const handleReset = () => {
    setCurrentSalary("");
    setHikePercentage("");
    setNewSalary("");
    setCalculationMode("percentage");
  };

  const handleDownloadPDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Salary Hike Calculator", 20, 20);
    
    doc.setFontSize(12);
    doc.text("Input Values:", 20, 40);
    doc.text(`Current Salary: ₹${currentSalary}`, 20, 50);
    
    if (calculationMode === "percentage") {
      doc.text(`Hike Percentage: ${hikePercentage}%`, 20, 60);
    } else {
      doc.text(`New Salary: ₹${newSalary}`, 20, 60);
    }
    
    doc.text("Results:", 20, 80);
    doc.text(`Hike Percentage: ${result.hikePercentage}%`, 20, 90);
    doc.text(`Incremental Amount: ₹${result.incrementalAmount}`, 20, 100);
    doc.text(`New Salary: ₹${result.newSalary}`, 20, 110);
    
    doc.save("salary-hike-calculation.pdf");
  };

  const getShareText = () => {
    if (!result) return "";
    return `💼 Salary Hike Calculation\n\nCurrent Salary: ₹${currentSalary}\nHike: ${result.hikePercentage}%\nIncrement: ₹${result.incrementalAmount}\nNew Salary: ₹${result.newSalary}\n\nCalculated with Financial Calculators`;
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
        url = `mailto:?subject=${encodeURIComponent('Salary Hike Calculation')}&body=${encodedText}`;
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
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Salary Hike Calculator</CardTitle>
        </div>
        <CardDescription>Calculate your salary increase percentage and amount</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-salary">Current Salary (₹)</Label>
            <Input
              id="current-salary"
              type="text"
              placeholder="Enter current salary"
              value={currentSalary}
              onChange={(e) => setCurrentSalary(filterNumericInput(e.target.value))}
              className="shadow-[var(--shadow-input)]"
            />
          </div>

          <div className="space-y-3">
            <Label>Calculate By</Label>
            <RadioGroup
              value={calculationMode}
              onValueChange={(value) => setCalculationMode(value as "percentage" | "salary")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage" className="cursor-pointer font-normal">Hike Percentage</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="salary" id="salary" />
                <Label htmlFor="salary" className="cursor-pointer font-normal">New Salary</Label>
              </div>
            </RadioGroup>
          </div>

          {calculationMode === "percentage" ? (
            <div className="space-y-2">
              <Label htmlFor="hike-percentage">Hike Percentage (%)</Label>
              <Input
                id="hike-percentage"
                type="text"
                placeholder="Enter hike percentage"
                value={hikePercentage}
                onChange={(e) => setHikePercentage(filterNumericInput(e.target.value))}
                className="shadow-[var(--shadow-input)]"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="new-salary">New Salary (₹)</Label>
              <Input
                id="new-salary"
                type="text"
                placeholder="Enter new salary"
                value={newSalary}
                onChange={(e) => setNewSalary(filterNumericInput(e.target.value))}
                className="shadow-[var(--shadow-input)]"
              />
            </div>
          )}
        </div>

        {result && (
          <div className="mt-6 p-6 bg-secondary rounded-lg border border-primary/20">
            <h3 className="text-lg font-semibold text-secondary-foreground mb-4">Results</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Hike Percentage:</span>
                <span className="text-2xl font-bold text-primary">{result.hikePercentage}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Incremental Amount:</span>
                <span className="text-xl font-semibold text-accent">₹{result.incrementalAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">New Salary:</span>
                <span className="text-xl font-semibold text-accent">₹{result.newSalary}</span>
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

export default SalaryHikeCalculator;
