// Google Analytics 4 Event Tracking

export const trackCalculatorUsage = (calculatorName: string, action: 'calculate' | 'reset' | 'download' | 'share') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'calculator_usage', {
      calculator_name: calculatorName,
      action: action,
    });
  }
};

export const trackPageView = (pageName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageName,
    });
  }
};
