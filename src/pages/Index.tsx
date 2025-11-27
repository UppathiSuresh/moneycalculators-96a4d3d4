import SalaryHikeCalculator from "@/components/SalaryHikeCalculator";
import DiscountCalculator from "@/components/DiscountCalculator";
import InterestCalculator from "@/components/InterestCalculator";
import EMICalculator from "@/components/EMICalculator";
import CompoundInterestCalculator from "@/components/CompoundInterestCalculator";
import RetirementCalculator from "@/components/RetirementCalculator";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calculator } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-[image:var(--gradient-bg)] flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-6 md:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8 md:mb-12">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
            <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
              <SalaryHikeCalculator />
            </div>
            <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
              <DiscountCalculator />
            </div>
            <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
              <InterestCalculator />
            </div>
            <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
              <EMICalculator />
            </div>
            <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}>
              <CompoundInterestCalculator />
            </div>
            <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}>
              <RetirementCalculator />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
export default Index;