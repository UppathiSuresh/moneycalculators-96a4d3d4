import SalaryHikeCalculator from "@/components/SalaryHikeCalculator";
import DiscountCalculator from "@/components/DiscountCalculator";
import InterestCalculator from "@/components/InterestCalculator";
import { Calculator } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-[image:var(--gradient-bg)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl shadow-lg">
              <Calculator className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Financial Calculators
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional tools to help you calculate salary hikes, discounts, and interest rates with ease
          </p>
        </header>

        {/* Calculators Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SalaryHikeCalculator />
          </div>
          <div className="lg:col-span-1">
            <DiscountCalculator />
          </div>
          <div className="lg:col-span-1">
            <InterestCalculator />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Built with React, TypeScript, and Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
