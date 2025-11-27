import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp, Shield, Zap, Users, Heart } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Calculator,
      title: "Easy to Use",
      description: "Our calculators are designed with simplicity in mind. Just enter your numbers and get instant results.",
    },
    {
      icon: TrendingUp,
      title: "Accurate Results",
      description: "All calculators use precise financial formulas to ensure you get reliable calculations every time.",
    },
    {
      icon: Shield,
      title: "Privacy Focused",
      description: "We don't store your data. All calculations happen in your browser, keeping your information private.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get results instantly without any delays. No registration or sign-up required.",
    },
    {
      icon: Users,
      title: "For Everyone",
      description: "Whether you're planning a purchase, managing loans, or saving for retirement, we've got you covered.",
    },
    {
      icon: Heart,
      title: "Completely Free",
      description: "All our calculators are 100% free to use. No hidden fees, no subscriptions, no catches.",
    },
  ];

  const calculators = [
    {
      name: "Salary Hike Calculator",
      description: "Calculate your new salary after a percentage increase or find out what percentage hike you received.",
    },
    {
      name: "Discount Calculator",
      description: "Find out how much you save and the final price after applying a discount percentage.",
    },
    {
      name: "Interest Calculator",
      description: "Calculate simple interest earned on your principal amount over a specified time period.",
    },
    {
      name: "EMI Calculator",
      description: "Determine your monthly loan payment based on loan amount, interest rate, and tenure.",
    },
    {
      name: "Compound Interest Calculator",
      description: "See how your money grows with compound interest over time with flexible compounding frequencies.",
    },
    {
      name: "Retirement Calculator",
      description: "Plan your retirement by calculating how much you need to save monthly to reach your retirement goal.",
    },
  ];

  return (
    <div className="min-h-screen bg-[image:var(--gradient-bg)] flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-6 md:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary rounded-xl shadow-lg">
                <Calculator className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                About Financial Calculators
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Your trusted companion for making smart financial decisions. We provide simple, accurate, and free financial calculators to help you plan your finances with confidence.
            </p>
          </section>

          {/* What We Do Section */}
          <section className="mb-12 md:mb-16">
            <Card className="shadow-[var(--shadow-card)] border-border/50">
              <CardHeader>
                <CardTitle className="text-3xl">What We Do</CardTitle>
                <CardDescription className="text-base">
                  Empowering you with financial clarity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  At Financial Calculators, we believe that everyone deserves access to powerful financial tools without complexity or cost. Our mission is to make financial planning accessible, understandable, and stress-free for everyone.
                </p>
                <p>
                  Whether you're planning a major purchase, evaluating a job offer, managing loans, or preparing for retirement, our suite of calculators provides you with instant, accurate results to guide your decisions.
                </p>
                <p>
                  We've eliminated the need for complex spreadsheets or expensive financial software. Just enter your numbers, and let our calculators do the rest. It's that simple!
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Features Grid */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="shadow-[var(--shadow-card)] border-border/50 hover:shadow-[0_8px_30px_-4px_hsl(var(--primary)/0.15)] transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <feature.icon className="h-6 w-6 text-accent" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* How Our Calculators Work */}
          <section className="mb-12 md:mb-16">
            <Card className="shadow-[var(--shadow-card)] border-border/50">
              <CardHeader>
                <CardTitle className="text-3xl">How Our Calculators Work</CardTitle>
                <CardDescription className="text-base">
                  Simple steps to get your results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Choose Your Calculator</h3>
                      <p className="text-muted-foreground">
                        Select the calculator that matches your needs from our homepage.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Enter Your Numbers</h3>
                      <p className="text-muted-foreground">
                        Fill in the required fields with your financial information. All inputs are clearly labeled.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Get Instant Results</h3>
                      <p className="text-muted-foreground">
                        See your results immediately as you type. No need to click a calculate button!
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Download or Share</h3>
                      <p className="text-muted-foreground">
                        Download your results as a PDF or share them via WhatsApp, Twitter, or email.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Available Calculators */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              Our Calculators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {calculators.map((calc, index) => (
                <Card
                  key={index}
                  className="shadow-[var(--shadow-card)] border-border/50 hover:shadow-[0_8px_30px_-4px_hsl(var(--primary)/0.15)] transition-all duration-300"
                >
                  <CardHeader>
                    <CardTitle className="text-xl">{calc.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{calc.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Closing Section */}
          <section className="text-center">
            <Card className="shadow-[var(--shadow-card)] border-border/50 bg-accent/5">
              <CardContent className="py-12 px-6">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Ready to Take Control of Your Finances?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                  Start using our free calculators today and make informed financial decisions with confidence. No sign-up required!
                </p>
                <a
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-11 md:h-10 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Start Calculating Now
                </a>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
