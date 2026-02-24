import { formatCurrency, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const initialAmountInput = document.getElementById('initial-amount');
  const monthlyContributionInput = document.getElementById('monthly-contribution');
  const rateInput = document.getElementById('rate-of-return');
  const yearsInput = document.getElementById('years');
  const compoundingInput = document.getElementById('compounding');
  const calculateBtn = document.getElementById('calculate-btn');

  // Result Elements
  const endBalance = document.getElementById('end-balance');
  const totalContributions = document.getElementById('total-contributions');
  const totalGrowth = document.getElementById('total-growth');

  function calculate() {
    const P = parseFloat(initialAmountInput.value) || 0;
    const PMT = parseFloat(monthlyContributionInput.value) || 0;
    const annualRate = parseFloat(rateInput.value) || 0;
    const t = parseFloat(yearsInput.value) || 0;
    const n = parseInt(compoundingInput.value) || 12;

    const r = annualRate / 100;
    
    // Future Value of Initial Principal: P * (1 + r/n)^(nt)
    const fvPrincipal = P * Math.pow(1 + r/n, n * t);

    // Future Value of Monthly Contributions: PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
    // Since PMT is monthly, we adjust the formula if compounding is annual
    let fvAnnuity = 0;
    const monthlyRate = r / 12;
    const totalMonths = t * 12;

    if (r === 0) {
      fvAnnuity = PMT * totalMonths;
    } else {
      // We assume contributions are at the end of each month
      fvAnnuity = PMT * (Math.pow(1 + r/12, totalMonths) - 1) / (r/12);
    }

    const totalFV = fvPrincipal + fvAnnuity;
    const totalContributed = P + (PMT * totalMonths);
    const growth = totalFV - totalContributed;

    // Update UI
    endBalance.textContent = formatCurrency(totalFV);
    totalContributions.textContent = formatCurrency(totalContributed);
    totalGrowth.textContent = formatCurrency(growth);
  }

  [initialAmountInput, monthlyContributionInput, rateInput, yearsInput, compoundingInput].forEach(el => {
    el.addEventListener('input', calculate);
  });

  calculateBtn.addEventListener('click', calculate);

  // Initial Calculation
  calculate();

  // Listen for global currency changes
  window.addEventListener('currencyChange', calculate);
});
