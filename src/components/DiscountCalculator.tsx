import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tag, RotateCcw, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

const DiscountCalculator = () => {
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<string>("");
  const { toast } = useToast();

  const calculateDiscount = () => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercent);

    if (!price || !discount || price <= 0 || discount < 0 || discount > 100) return null;

    const discountAmount = (price * discount) / 100;
    const finalPrice = price - discountAmount;

    return {
      discountAmount: discountAmount.toFixed(2),
      finalPrice: finalPrice.toFixed(2),
      savings: discountAmount.toFixed(2),
    };
  };

  const result = calculateDiscount();

  const handleReset = () => {
    setOriginalPrice("");
    setDiscountPercent("");
  };

  const handleDownloadPDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Discount Calculator", 20, 20);
    
    doc.setFontSize(12);
    doc.text("Input Values:", 20, 40);
    doc.text(`Original Price: ₹${originalPrice}`, 20, 50);
    doc.text(`Discount Percentage: ${discountPercent}%`, 20, 60);
    
    doc.text("Results:", 20, 80);
    doc.text(`You Save: ₹${result.savings}`, 20, 90);
    doc.text(`Final Price: ₹${result.finalPrice}`, 20, 100);
    
    doc.save("discount-calculation.pdf");
  };

  const getShareText = () => {
    if (!result) return "";
    return `🏷️ Discount Calculation\n\nOriginal Price: ₹${originalPrice}\nDiscount: ${discountPercent}%\nYou Save: ₹${result.savings}\nFinal Price: ₹${result.finalPrice}\n\nCalculated with Financial Calculators`;
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
        url = `mailto:?subject=${encodeURIComponent('Discount Calculation')}&body=${encodedText}`;
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
          <div className="p-2 rounded-lg bg-accent/10">
            <Tag className="h-6 w-6 text-accent" />
          </div>
          <CardTitle className="text-2xl">Discount Calculator</CardTitle>
        </div>
        <CardDescription>Calculate the final price after applying discount</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="original-price">Original Price (₹)</Label>
            <Input
              id="original-price"
              type="text"
              placeholder="Enter original price"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="shadow-[var(--shadow-input)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount-percent">Discount Percentage (%)</Label>
            <Input
              id="discount-percent"
              type="text"
              placeholder="Enter discount percentage"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              min="0"
              max="100"
              className="shadow-[var(--shadow-input)]"
            />
          </div>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-secondary rounded-lg border border-accent/20">
            <h3 className="text-lg font-semibold text-secondary-foreground mb-4">Results</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">You Save:</span>
                <span className="text-xl font-semibold text-accent">₹{result.savings}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-muted-foreground">Final Price:</span>
                <span className="text-2xl font-bold text-primary">₹{result.finalPrice}</span>
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

export default DiscountCalculator;
