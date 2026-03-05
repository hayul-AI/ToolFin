// ToolFin Global Search Functionality

const searchData = [
  // Categories
  { title: "Loans, Credit & Debt", url: "/loans.html", tags: ["loan", "credit", "debt", "payoff"] },
  { title: "Income, Tax & Salary", url: "/income.html", tags: ["income", "tax", "salary", "pay", "wage"] },
  { title: "Investments & Future Value", url: "/investments.html", tags: ["investment", "savings", "growth", "retirement", "net worth"] },
  { title: "Housing & Real Estate", url: "/housing.html", tags: ["mortgage", "rent", "buy", "housing", "property"] },
  { title: "Everyday Finance Tools", url: "/everyday.html", tags: ["budget", "savings", "tip", "daily", "expenses"] },
  
  // Calculators
  { title: "Mortgage Calculator", url: "/calculators/mortgage.html", tags: ["home", "loan", "housing", "house", "payment"] },
  { title: "Compound Interest Calculator", url: "/calculators/compound-interest.html", tags: ["investment", "savings", "growth", "interest"] },
  { title: "Salary Hourly Calculator", url: "/calculators/salary-hourly.html", tags: ["income", "pay", "wage", "work", "conversion"] },
  { title: "Rent vs Buy Calculator", url: "/calculators/rent-vs-buy.html", tags: ["housing", "home", "investment", "rent", "buy"] },
  { title: "ROI Calculator", url: "/calculators/roi.html", tags: ["investment", "return", "profit", "gain"] },
  { title: "Amortization Schedule", url: "/calculators/amortization.html", tags: ["loan", "mortgage", "schedule", "payment", "breakdown"] },
  { title: "APR Calculator", url: "/calculators/apr.html", tags: ["interest", "rate", "loan", "true cost"] },
  { title: "Bonus Tax Calculator", url: "/calculators/bonus-tax.html", tags: ["income", "tax", "bonus", "paycheck"] },
  { title: "Budget Planner (50/30/20)", url: "/calculators/budget-planner.html", tags: ["budget", "planning", "spending", "savings"] },
  { title: "Closing Cost Calculator", url: "/calculators/closing-costs.html", tags: ["home", "housing", "closing", "fees", "purchase"] },
  { title: "Cost of Living Calculator", url: "/calculators/cost-of-living.html", tags: ["expenses", "location", "lifestyle", "budget"] },
  { title: "Credit Card Payoff Calculator", url: "/calculators/credit-card-payoff.html", tags: ["debt", "credit", "card", "payoff", "interest"] },
  { title: "Debt Snowball Calculator", url: "/calculators/debt-snowball.html", tags: ["debt", "payoff", "strategy", "loans"] },
  { title: "Discount Calculator", url: "/calculators/discount.html", tags: ["shopping", "sale", "price", "savings"] },
  { title: "Dividend Income Calculator", url: "/calculators/dividend-income.html", tags: ["investment", "stocks", "income", "passive"] },
  { title: "Dollar Cost Averaging (DCA)", url: "/calculators/dollar-cost-averaging.html", tags: ["investment", "strategy", "stocks", "crypto"] },
  { title: "Down Payment Calculator", url: "/calculators/down-payment.html", tags: ["home", "housing", "savings", "purchase"] },
  { title: "DTI (Debt-to-Income) Calculator", url: "/calculators/dti-calculator.html", tags: ["debt", "income", "ratio", "loan", "qualification"] },
  { title: "Emergency Fund Calculator", url: "/calculators/emergency-fund.html", tags: ["savings", "safety", "buffer", "expenses"] },
  { title: "FIRE / 4% Rule Calculator", url: "/calculators/fire-calculator.html", tags: ["retirement", "early", "independence", "savings"] },
  { title: "Home Affordability Calculator", url: "/calculators/home-affordability.html", tags: ["home", "housing", "budget", "loan", "purchase"] },
  { title: "Inflation Salary Adjuster", url: "/calculators/inflation-salary.html", tags: ["income", "pay", "inflation", "value", "purchasing power"] },
  { title: "Investment Fee Calculator", url: "/calculators/investment-fees.html", tags: ["investment", "fees", "expense ratio", "cost"] },
  { title: "Investment Growth Calculator", url: "/calculators/investment-growth.html", tags: ["investment", "growth", "savings", "future value"] },
  { title: "Loan Affordability Calculator", url: "/calculators/loan-affordability-calculator.html", tags: ["loan", "debt", "budget", "borrow"] },
  { title: "Loan Payment Calculator", url: "/calculators/loan-payment.html", tags: ["loan", "debt", "payment", "interest"] },
  { title: "Mortgage Extra Payment", url: "/calculators/mortgage-extra-payment.html", tags: ["mortgage", "debt", "payoff", "interest", "savings"] },
  { title: "Net Worth Calculator", url: "/calculators/net-worth.html", tags: ["wealth", "assets", "liabilities", "finance"] },
  { title: "Overtime Calculator", url: "/calculators/overtime.html", tags: ["income", "pay", "work", "wage", "extra"] },
  { title: "Pay Raise Calculator", url: "/calculators/pay-raise.html", tags: ["income", "pay", "raise", "increase", "salary"] },
  { title: "Property Tax Estimator", url: "/calculators/property-tax.html", tags: ["home", "housing", "tax", "expenses"] },
  { title: "Refinance Break-Even", url: "/calculators/refinance-break-even.html", tags: ["mortgage", "loan", "refinance", "savings"] },
  { title: "Refinance Calculator", url: "/calculators/refinance.html", tags: ["mortgage", "loan", "refinance", "payment"] },
  { title: "Rent Affordability Calculator", url: "/calculators/rent-affordability.html", tags: ["housing", "rent", "budget", "income"] },
  { title: "Retirement Contribution", url: "/calculators/retirement-contribution.html", tags: ["retirement", "savings", "401k", "ira", "contribution"] },
  { title: "Retirement Savings Calculator", url: "/calculators/retirement-savings.html", tags: ["retirement", "savings", "future", "growth"] },
  { title: "Sales Tax Calculator", url: "/calculators/sales-tax.html", tags: ["shopping", "tax", "price", "cost"] },
  { title: "Savings Rate Calculator", url: "/calculators/savings-rate.html", tags: ["savings", "income", "ratio", "percent"] },
  { title: "Self-Employment Tax", url: "/calculators/self-employment-tax.html", tags: ["income", "tax", "freelance", "business"] },
  { title: "Subscription Cost Calculator", url: "/calculators/subscription-cost.html", tags: ["expenses", "monthly", "budget", "streaming", "cost"] },
  { title: "Take Home Pay Calculator", url: "/calculators/take-home-pay.html", tags: ["income", "tax", "paycheck", "net pay"] },
  { title: "Tip Calculator", url: "/calculators/tip-calculator.html", tags: ["everyday", "dining", "restaurant", "service"] },
  { title: "Unit Cost Calculator", url: "/calculators/unit-cost-calculator.html", tags: ["shopping", "price", "value", "comparison"] },
  { title: "Unit Price Calculator", url: "/calculators/unit-price.html", tags: ["shopping", "price", "value", "comparison"] }
];

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('global-search');
  const resultsDropdown = document.getElementById('search-results');

  if (!searchInput || !resultsDropdown) return;

  const showResults = (query) => {
    if (!query) {
      resultsDropdown.hidden = true;
      return;
    }

    const normalizedQuery = query.toLowerCase().trim();
    const filtered = searchData.filter(item => {
      return item.title.toLowerCase().includes(normalizedQuery) || 
             item.tags.some(tag => tag.toLowerCase().includes(normalizedQuery));
    });

    if (filtered.length > 0) {
      resultsDropdown.innerHTML = filtered.map(item => `
        <a href="${item.url}" class="search-result-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
          <span>${item.title}</span>
        </a>
      `).join('');
      resultsDropdown.hidden = false;
    } else {
      resultsDropdown.innerHTML = `<div class="search-no-results">No calculators found for "${query}"</div>`;
      resultsDropdown.hidden = false;
    }
  };

  searchInput.addEventListener('input', (e) => {
    showResults(e.target.value);
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !resultsDropdown.contains(e.target)) {
      resultsDropdown.hidden = true;
    }
  });

  // Handle focus
  searchInput.addEventListener('focus', () => {
    if (searchInput.value) {
      resultsDropdown.hidden = false;
    }
  });

  // Keyboard navigation
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      resultsDropdown.hidden = true;
      searchInput.blur();
    }
    
    const items = resultsDropdown.querySelectorAll('.search-result-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[0].focus();
    }
  });
});
