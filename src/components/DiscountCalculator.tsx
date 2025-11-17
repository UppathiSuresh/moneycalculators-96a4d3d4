import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tag } from "lucide-react";

const DiscountCalculator = () => {
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<string>("");

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

  return (
    <Card className="shadow-[var(--shadow-card)] border-border/50 hover:shadow-lg transition-shadow duration-300">
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
              type="number"
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
              type="number"
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
    </Card>
  );
};

export default DiscountCalculator;
