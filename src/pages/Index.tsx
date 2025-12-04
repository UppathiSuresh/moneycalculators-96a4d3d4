import { lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calculator } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet-async";

// Lazy load calculators for better performance
const SalaryHikeCalculator = lazy(() => import("@/components/SalaryHikeCalculator"));
const DiscountCalculator = lazy(() => import("@/components/DiscountCalculator"));
const InterestCalculator = lazy(() => import("@/components/InterestCalculator"));
const EMICalculator = lazy(() => import("@/components/EMICalculator"));
const CompoundInterestCalculator = lazy(() => import("@/components/CompoundInterestCalculator"));
const RetirementCalculator = lazy(() => import("@/components/RetirementCalculator"));
const SIPCalculator = lazy(() => import("@/components/SIPCalculator"));
const FDCalculator = lazy(() => import("@/components/FDCalculator"));
const RDCalculator = lazy(() => import("@/components/RDCalculator"));
const GSTCalculator = lazy(() => import("@/components/GSTCalculator"));
const IncomeTaxCalculator = lazy(() => import("@/components/IncomeTaxCalculator"));

const CalculatorSkeleton = () => (
  <div className="bg-card rounded-xl p-6 shadow-lg">
    <Skeleton className="h-8 w-48 mb-4" />
    <Skeleton className="h-10 w-full mb-3" />
    <Skeleton className="h-10 w-full mb-3" />
    <Skeleton className="h-10 w-full mb-3" />
    <Skeleton className="h-10 w-32" />
  </div>
);

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Financial Calculators India - EMI, SIP, FD, Tax Calculator Free</title>
        <meta name="description" content="Free online financial calculators for India. Calculate EMI, SIP returns, FD maturity, income tax (old vs new regime), GST, salary hike, and more. Instant accurate results." />
        <link rel="canonical" href="https://financial-calculators.lovable.app/" />
      </Helmet>
      
      <div className="min-h-screen bg-[image:var(--gradient-bg)] flex flex-col">
        <Navigation />
        
        <main className="flex-1 py-6 md:py-8 px-4 sm:px-6 lg:px-8">
          <article className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="text-center mb-8 md:mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-primary rounded-xl shadow-lg" role="img" aria-label="Calculator icon">
                  <Calculator className="h-8 w-8 text-primary-foreground" aria-hidden="true" />
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
            <section aria-label="Financial calculators collection">
              <h2 className="sr-only">Available Financial Calculators</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
                <Suspense fallback={<CalculatorSkeleton />}>
                  <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
                    <SalaryHikeCalculator />
                  </div>
                </Suspense>
                <Suspense fallback={<CalculatorSkeleton />}>
                  <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
                    <DiscountCalculator />
                  </div>
                </Suspense>
                <Suspense fallback={<CalculatorSkeleton />}>
                  <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
                    <InterestCalculator />
                  </div>
                </Suspense>
                <Suspense fallback={<CalculatorSkeleton />}>
                  <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
                    <EMICalculator />
                  </div>
                </Suspense>
                <Suspense fallback={<CalculatorSkeleton />}>
                  <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}>
                    <CompoundInterestCalculator />
                  </div>
                </Suspense>
                <Suspense fallback={<CalculatorSkeleton />}>
                  <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}>
                    <RetirementCalculator />
                  </div>
                </Suspense>
                <Suspense fallback={<CalculatorSkeleton />}>
                  <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'backwards' }}>
                    <SIPCalculator />
                  </div>
                </Suspense>
                <Suspense fallback={<CalculatorSkeleton />}>
                  <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'backwards' }}>
                    <FDCalculator />
                  </div>
                </Suspense>
                <Suspense fallback={<CalculatorSkeleton />}>
                  <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.9s', animationFillMode: 'backwards' }}>
                    <RDCalculator />
                  </div>
                </Suspense>
                <Suspense fallback={<CalculatorSkeleton />}>
                  <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '1.0s', animationFillMode: 'backwards' }}>
                    <GSTCalculator />
                  </div>
                </Suspense>
                <Suspense fallback={<CalculatorSkeleton />}>
                  <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '1.1s', animationFillMode: 'backwards' }}>
                    <IncomeTaxCalculator />
                  </div>
                </Suspense>
              </div>
            </section>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;