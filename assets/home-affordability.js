import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const annualIncomeInput = document.getElementById('annual-income');
  const monthlyDebtInput = document.getElementById('monthly-debt');
  const downPaymentInput = document.getElementById('down-payment');
  const interestRateInput = document.getElementById('interest-rate');
  const loanTermInput = document.getElementById('loan-term');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resMainPrice = document.getElementById('res-main-price');
  const priceConservative = document.getElementById('price-conservative');
  const priceModerate = document.getElementById('price-moderate');
  const priceAggressive = document.getElementById('price-aggressive');
  const resMonthlyPayment = document.getElementById('res-monthly-payment');
  const resMaxDebt = document.getElementById('res-max-debt');

  function calculateMaxPrice(totalMonthlyBudget, annualRate, years) {
    // Estimating Tax + Insurance as 1.5% of home price annually -> 0.125% monthly
    // Since we don't know the price yet, we solve: 
    // Payment = PI + (Price * 0.00125)
    // PI = Loan * (r(1+r)^n)/((1+r)^n - 1)
    // Loan = Price - DownPayment
    
    // For simplicity in this common model, we'll reverse calculate from P&I 
    // and assume Tax/Insurance take up about 20% of the budget.
    const piBudget = totalMonthlyBudget * 0.80; 
    
    const monthlyRate = (annualRate / 100) / 12;
    const n = years * 12;
    
    if (monthlyRate === 0) return piBudget * n;
    
    const loanAmount = piBudget * (Math.pow(1 + monthlyRate, n) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, n));
    return loanAmount;
  }

  function calculate() {
    const annualIncome = parseFloat(annualIncomeInput.value) || 0;
    const monthlyDebt = parseFloat(monthlyDebtInput.value) || 0;
    const downPayment = parseFloat(downPaymentInput.value) || 0;
    const rate = parseFloat(interestRateInput.value) || 0;
    const term = parseFloat(loanTermInput.value) || 30;

    const monthlyGrossIncome = annualIncome / 12;

    // DTI Limits
    const ratios = {
      conservative: 0.28,
      moderate: 0.36,
      aggressive: 0.43
    };

    const results = {};

    for (const [key, ratio] of Object.entries(ratios)) {
      // Back-end DTI calculation: (Housing + Debt) / Income
      const maxTotalMonthly = monthlyGrossIncome * ratio;
      const maxHousingMonthly = Math.max(0, maxTotalMonthly - monthlyDebt);
      
      const maxLoan = calculateMaxPrice(maxHousingMonthly, rate, term);
      results[key] = {
        price: maxLoan + downPayment,
        monthly: maxHousingMonthly
      };
    }

    // Update UI
    resMainPrice.innerHTML = formatCurrency(results.moderate.price);
    priceConservative.innerHTML = formatCurrency(results.conservative.price);
    priceModerate.innerHTML = formatCurrency(results.moderate.price);
    priceAggressive.innerHTML = formatCurrency(results.aggressive.price);
    
    resMonthlyPayment.innerHTML = formatCurrencyDecimal(results.moderate.monthly * 0.8); // Showing P&I portion
    resMaxDebt.innerHTML = formatCurrency(monthlyGrossIncome * 0.36);

    // Dynamic Verdict color
    resMainPrice.style.color = '#b45309'; // moderate
  }

  // Listeners
  [annualIncomeInput, monthlyDebtInput, downPaymentInput, interestRateInput, loanTermInput].forEach(input => {
    input.addEventListener('input', calculate);
  });

  calculateBtn.addEventListener('click', calculate);

  // Sync with global currency
  window.addEventListener('currencyChange', calculate);

  // Initial
  calculate();
});
