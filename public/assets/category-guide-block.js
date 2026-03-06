class CategoryGuideBlock extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const categoryKey = this.getAttribute('category-key');
    const title = this.getAttribute('title');
    if (categoryKey) {
      this.render(categoryKey, title);
    }
  }

  render(key, title) {
    const data = {
      loans: {
        what: "Analyze loan structures, compare debt payoff strategies, and determine your borrowing power. Whether you are managing existing credit card debt or shopping for a new personal loan, these tools provide the mathematical transparency needed to make informed decisions.",
        what2: "Use our calculators to find your Debt-to-Income (DTI) ratio, evaluate the true cost of an APR, or simulate how much interest you can save by switching from a debt snowball to a debt avalanche method.",
        how: "ToolFin uses standard amortization and compound interest formulas. We calculate monthly payments and payoff timelines based on the principal, interest rate, and term length you provide, ensuring objective mathematical results.",
        useCases: [
          "Comparing different loan offers by their true APR",
          "Planning a timeline to become debt-free using snowball or avalanche methods",
          "Checking if you qualify for a loan based on your current income and debt (DTI)",
          "Calculating the impact of refinancing a high-interest loan"
        ],
        faq: [
          { q: "What is the difference between Debt Snowball and Debt Avalanche?", a: "Snowball focuses on paying the smallest balances first to build psychological momentum, while Avalanche targets the highest interest rates first to minimize total interest paid." },
          { q: "How is APR different from an interest rate?", a: "The interest rate is the cost of borrowing the principal, while the APR (Annual Percentage Rate) includes both the interest rate and any additional fees or costs associated with the loan, representing the true annual cost." },
          { q: "What is a 'safe' DTI ratio?", a: "Typically, lenders prefer a Debt-to-Income ratio below 36%, with no more than 28% of that going toward housing, though guidelines vary by loan type." }
        ],
        links: [
          { group: "Start here", links: [{ label: "Loan Payment Calculator", href: "/calculators/loan-payment.html" }, { label: "DTI Ratio Calculator", href: "/calculators/dti-calculator.html" }] },
          { group: "Compare payoff methods", links: [{ label: "Debt Snowball Calculator", href: "/calculators/debt-snowball.html" }, { label: "Debt Avalanche Calculator", href: "/debt-avalanche-calculator.html" }] },
          { group: "Plan next steps", links: [{ label: "Loan Affordability Calculator", href: "/calculators/loan-affordability-calculator.html" }, { label: "APR Calculator", href: "/calculators/apr.html" }] }
        ]
      },
      income: {
        what: "Convert between various pay rates and estimate your actual take-home pay after taxes and deductions. Our income tools help you understand the impact of raises, bonuses, and overtime on your financial bottom line.",
        what2: "Track how inflation erodes your purchasing power over time and compare the cost of living between different geographic locations to see how far your salary will actually go.",
        how: "Our income tools use standard tax brackets and conversion logic (e.g., 2,080 hours for a standard work year). Results are projections based on current tax law estimates and user-provided inputs.",
        useCases: [
          "Converting an hourly wage to an equivalent annual salary",
          "Estimating net pay after federal and state tax withholding",
          "Calculating the value of a job offer in a new city with a different cost of living",
          "Evaluating the long-term impact of a pay raise or work bonus"
        ],
        faq: [
          { q: "Why is Gross Income different from Net Income?", a: "Gross income is your total earnings before any deductions, while Net income (take-home pay) is what remains after taxes, social security, and other voluntary deductions like health insurance." },
          { q: "Why do tax estimates differ by state?", a: "Each state has its own income tax laws; some have progressive brackets, others have flat rates, and some have no state income tax at all, which significantly changes your take-home pay." },
          { q: "How does inflation affect my salary?", a: "Inflation increases the cost of goods and services, meaning the same salary buys fewer items today than it did in previous years. If your raise is lower than the inflation rate, your 'real' income has actually decreased." }
        ],
        links: [
          { group: "Start here", links: [{ label: "Salary Converter", href: "/calculators/salary-hourly.html" }, { label: "Take Home Pay Calculator", href: "/calculators/take-home-pay.html" }] },
          { group: "Analyze changes", links: [{ label: "Pay Raise Calculator", href: "/calculators/pay-raise.html" }, { label: "Overtime Calculator", href: "/calculators/overtime.html" }] },
          { group: "Plan next steps", links: [{ label: "Cost of Living Calculator", href: "/calculators/cost-of-living.html" }, { label: "Inflation Salary Adjuster", href: "/calculators/inflation-salary.html" }] }
        ]
      },
      investments: {
        what: "Project the future value of your assets and understand the power of compounding. These tools are designed to help you visualize retirement timelines and evaluate the efficiency of different investment vehicles.",
        what2: "Analyze the hidden cost of management fees (expense ratios) and see how regular contributions through Dollar Cost Averaging (DCA) can impact your total wealth over decades.",
        how: "Calculations are based on the time value of money, using compound interest formulas. We factor in initial balances, recurring contributions, estimated returns, and fee deductions over your specified time horizon.",
        useCases: [
          "Estimating how much a monthly $500 investment will grow over 30 years",
          "Calculating the Return on Investment (ROI) for a specific asset",
          "Seeing how much wealth is lost to a 1% management fee",
          "Determining your 'FIRE' number using the 4% safe withdrawal rule"
        ],
        faq: [
          { q: "Are investment returns guaranteed?", a: "No. This calculator uses mathematical estimates based on average rates of return you provide. Real-world market returns fluctuate significantly year-to-year." },
          { q: "How do fees impact my portfolio over time?", a: "Fees are deducted annually from your total balance. Because that money is no longer invested, you lose both the fee amount and the compounded returns that money would have earned." },
          { q: "What is the 4% Rule?", a: "The 4% rule is a guideline suggesting that if you withdraw 4% of your initial retirement portfolio each year (adjusted for inflation), your money has a high probability of lasting for at least 30 years." }
        ],
        links: [
          { group: "Start here", links: [{ label: "Investment Growth Calculator", href: "/calculators/investment-growth.html" }, { label: "Compound Interest Calculator", href: "/calculators/compound-interest.html" }] },
          { group: "Compare options", links: [{ label: "ROI Calculator", href: "/calculators/roi.html" }, { label: "Dollar Cost Averaging", href: "/calculators/dollar-cost-averaging.html" }] },
          { group: "Plan next steps", links: [{ label: "Investment Fee Calculator", href: "/calculators/investment-fees.html" }, { label: "FIRE Calculator", href: "/calculators/fire-calculator.html" }] }
        ]
      },
      housing: {
        what: "Navigate the complex financial decisions of homeownership and real estate investing. Estimate monthly mortgage payments and compare the long-term costs of renting versus buying a home in your market.",
        what2: "Calculate your break-even point for a mortgage refinance or see how much time and interest you can save by making extra principal payments toward your current loan.",
        how: "We use standard mortgage amortization formulas that include principal and interest. Advanced options allow for the inclusion of property taxes, homeowners insurance, and Private Mortgage Insurance (PMI) estimates.",
        useCases: [
          "Estimating total monthly housing costs for a specific home price",
          "Comparing the financial outcome of renting vs. buying over 10 years",
          "Determining if a mortgage refinance will pay for itself in monthly savings",
          "Seeing how much house you can afford based on your down payment and DTI"
        ],
        faq: [
          { q: "What is included in an escrow payment?", a: "An escrow payment typically includes your property taxes and homeowners insurance, which the lender collects monthly and pays on your behalf when they are due." },
          { q: "What does 'Break-Even' mean in refinancing?", a: "It is the point in time where the total monthly interest savings from your new lower rate equal the total closing costs paid to get the new loan." },
          { q: "Is a 20% down payment required?", a: "No, many loan programs allow for as little as 3% or 3.5% down, though you will likely have to pay Private Mortgage Insurance (PMI) until you reach 20% equity." }
        ],
        links: [
          { group: "Start here", links: [{ label: "Mortgage Calculator", href: "/calculators/mortgage.html" }, { label: "Home Affordability", href: "/calculators/home-affordability.html" }] },
          { group: "Compare options", links: [{ label: "Rent vs Buy Calculator", href: "/calculators/rent-vs-buy.html" }, { label: "Refinance Break-Even", href: "/calculators/refinance-break-even.html" }] },
          { group: "Plan next steps", links: [{ label: "Closing Cost Calculator", href: "/calculators/closing-costs.html" }, { label: "Mortgage Extra Payment", href: "/calculators/mortgage-extra-payment.html" }] }
        ]
      },
      everyday: {
        what: "Simplify your daily financial choices with quick, practical tools. From managing a monthly budget to calculating the best value at the grocery store, these tools are designed for immediate use.",
        what2: "Track your recurring subscription costs, estimate an appropriate emergency fund, or quickly split a bill with a tip among friends.",
        how: "These tools use straightforward arithmetic and widely accepted financial rules of thumb, such as the 50/30/20 rule for budgeting or the 3-6 month rule for emergency savings.",
        useCases: [
          "Allocating your monthly paycheck between needs, wants, and savings",
          "Comparing unit prices of items in different sizes to find the best deal",
          "Auditing how much you spend annually on streaming and app subscriptions",
          "Determining your current savings rate to track your financial health"
        ],
        faq: [
          { q: "What is the 50/30/20 budget rule?", a: "It is a guideline where you spend 50% of your income on needs, 30% on wants, and 20% on savings or debt repayment." },
          { q: "How much should I have in an emergency fund?", a: "Most experts recommend saving 3 to 6 months of essential living expenses to cover unexpected events like job loss or medical bills." },
          { q: "How do recurring subscriptions affect my budget?", a: "Because they are automatic and often small, 'subscription leak' can occur where you pay for services you no longer use, costing you hundreds of dollars per year." }
        ],
        links: [
          { group: "Start here", links: [{ label: "Budget Planner", href: "/calculators/budget-planner.html" }, { label: "Emergency Fund", href: "/calculators/emergency-fund.html" }] },
          { group: "Check efficiency", links: [{ label: "Savings Rate Calculator", href: "/calculators/savings-rate.html" }, { label: "Subscription Cost Calculator", href: "/calculators/subscription-cost.html" }] },
          { group: "Plan next steps", links: [{ label: "Unit Price Calculator", href: "/calculators/unit-price.html" }, { label: "Sales Tax Calculator", href: "/calculators/sales-tax.html" }] }
        ]
      }
    };

    const c = data[key];
    if (!c) return;

    const style = `
      <style>
        :host {
          display: block;
          margin-top: 4rem;
          color: #1e293b;
          line-height: 1.6;
          font-family: 'Inter', sans-serif;
        }
        .guide-container {
          padding: 2rem 0;
          border-top: 2px solid #f1f5f9;
        }
        section {
          margin-bottom: 3rem;
        }
        h2 {
          font-size: 1.875rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          color: #0f172a;
        }
        h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #334155;
        }
        h4 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #334155;
        }
        p {
          margin-bottom: 1rem;
          color: #475569;
        }
        ul {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        li {
          margin-bottom: 0.5rem;
          color: #475569;
        }
        .link-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 1rem;
        }
        .link-group ul {
          list-style: none;
          padding: 0;
        }
        .link-group a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
          display: block;
          margin-bottom: 0.5rem;
        }
        .link-group a:hover {
          text-decoration: underline;
        }
        .faq-grid {
          display: grid;
          gap: 1.5rem;
        }
        .disclaimer-box {
          margin-top: 4rem;
          padding: 2rem;
          background: #f1f5f9;
          border-radius: 12px;
          font-size: 0.9rem;
          color: #64748b;
        }
        .update-tag {
          font-size: 0.85rem;
          color: #94a3b8;
          margin-top: 1rem;
          display: block;
        }
      </style>
    `;

    const linksHtml = c.links.map(g => `
      <div class="link-group">
        <h4>${g.group}</h4>
        <ul>
          ${g.links.map(l => `<li><a href="${l.href}">${l.label} →</a></li>`).join('')}
        </ul>
      </div>
    `).join('');

    const faqHtml = c.faq.map(f => `
      <div>
        <h4>${f.q}</h4>
        <p>${f.a}</p>
      </div>
    `).join('');

    const content = `
      <div class="guide-container">
        <section>
          <h2>What You Can Do Here</h2>
          <p>${c.what}</p>
          <p>${c.what2}</p>
        </section>

        <section>
          <h2>How ToolFin Calculates Results</h2>
          <p>${c.how}</p>
        </section>

        <section>
          <h2>Common Use Cases</h2>
          <ul>
            ${c.useCases.map(u => `<li>${u}</li>`).join('')}
          </ul>
        </section>

        <section>
          <h2>Recommended Tools</h2>
          <div class="link-grid">
            ${linksHtml}
          </div>
        </section>

        <section>
          <h2>Frequently Asked Questions (FAQ)</h2>
          <div class="faq-grid">
            ${faqHtml}
          </div>
        </section>

        <div class="disclaimer-box">
          <p><strong>Legal Disclaimer:</strong> ToolFin provides mathematical estimates for educational and informational purposes only. Results do not constitute financial, investment, tax, or legal advice. Actual terms and outcomes vary by provider and jurisdiction.</p>
          <span class="update-tag">Last updated: February 26, 2026</span>
        </div>
      </div>
    `;

    this.shadowRoot.innerHTML = style + content;
  }
}

customElements.define('category-guide-block', CategoryGuideBlock);
