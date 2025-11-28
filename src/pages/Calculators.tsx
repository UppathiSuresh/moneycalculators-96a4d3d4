import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, Percent, DollarSign, PiggyBank, Building2 } from "lucide-react";

const calculators = [
  {
    id: "salary-hike",
    title: "Salary Hike Calculator",
    description: "Calculate your salary increase based on percentage hike or new salary amount. See the exact incremental amount and your new salary.",
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    id: "discount",
    title: "Discount Calculator",
    description: "Find out how much you save with discounts. Enter the original price and discount percentage to get the final price and savings.",
    icon: Percent,
    color: "text-blue-500",
  },
  {
    id: "interest",
    title: "Simple Interest Calculator",
    description: "Calculate simple interest on your investments. Enter principal, rate, and time to see interest earned and total amount.",
    icon: DollarSign,
    color: "text-purple-500",
  },
  {
    id: "emi",
    title: "EMI Calculator",
    description: "Calculate your loan EMI (Equated Monthly Installment). Get breakdown of total amount payable and total interest on your loan.",
    icon: Building2,
    color: "text-orange-500",
  },
  {
    id: "compound-interest",
    title: "Compound Interest Calculator",
    description: "Calculate compound interest with different compounding frequencies. See your investment grow over time with the power of compounding.",
    icon: Calculator,
    color: "text-indigo-500",
  },
  {
    id: "retirement",
    title: "Retirement Planning Calculator",
    description: "Plan your retirement corpus. Calculate how much you'll have saved by retirement based on current savings and monthly contributions.",
    icon: PiggyBank,
    color: "text-pink-500",
  },
];

const Calculators = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              All Calculators
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Choose from our collection of financial calculators to help you make informed decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {calculators.map((calculator, index) => {
              const Icon = calculator.icon;
              return (
                <Card
                  key={calculator.id}
                  className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className={`p-2 md:p-3 rounded-lg bg-muted ${calculator.color}`}>
                        <Icon className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg md:text-xl mb-2">
                          {calculator.title}
                        </CardTitle>
                        <CardDescription className="text-sm md:text-base">
                          {calculator.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/#${calculator.id}`}>
                      <Button className="w-full" variant="default">
                        Use Calculator
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Calculators;
