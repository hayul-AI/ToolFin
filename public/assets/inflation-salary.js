import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const salaryInput = document.getElementById('base-salary');
  const yearsInput = document.getElementById('years-count');
  const rateInput = document.getElementById('inflation-rate');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resAdjusted = document.getElementById('res-adjusted-salary');
  const resTotalIncrease = document.getElementById('res-total-increase');
  const resCumulativePct = document.getElementById('res-cumulative-pct');
  const resPowerLoss = document.getElementById('res-power-loss');

  function calculate() {
    const baseSalary = parseFloat(salaryInput.value) || 0;
    const years = parseFloat(yearsInput.value) || 0;
    const rate = (parseFloat(rateInput.value) || 0) / 100;

    if (baseSalary <= 0 || years < 0) {
        resAdjusted.innerHTML = formatCurrencyDecimal(0);
        resTotalIncrease.innerHTML = formatCurrencyDecimal(0);
        resCumulativePct.textContent = "0%";
        resPowerLoss.textContent = "0%";
        return;
    }

    // Adjusted Salary = P(1 + r)^n
    const adjustedSalary = baseSalary * Math.pow(1 + rate, years);
    const totalIncrease = adjustedSalary - baseSalary;
    
    // Cumulative Inflation %
    const cumulativePct = ((adjustedSalary / baseSalary) - 1) * 100;
    
    // Purchasing Power Loss %
    // If something cost $1 and now costs $1.50, your $1 only buys 1/1.50 = 66.6% of original.
    // Loss = 1 - (1/1.50) = 33.3%
    const powerLoss = (1 - (baseSalary / adjustedSalary)) * 100;

    // Update UI
    resAdjusted.innerHTML = formatCurrencyDecimal(adjustedSalary);
    resTotalIncrease.innerHTML = formatCurrencyDecimal(totalIncrease);
    resCumulativePct.textContent = cumulativePct.toFixed(2) + "%";
    resPowerLoss.textContent = powerLoss.toFixed(2) + "%";
  }

  calculateBtn.addEventListener('click', calculate);

  // Auto-calculate on input
  [salaryInput, yearsInput, rateInput].forEach(el => {
    el.addEventListener('input', calculate);
  });

  // Wiring currency change
  window.addEventListener('currencyChange', () => {
    calculate();
  });

  // Initial
  calculate();
});
