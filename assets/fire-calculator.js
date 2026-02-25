import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const expensesInput = document.getElementById('annual-expenses');
  const rateInput = document.getElementById('withdrawal-rate');
  const currentSavingsInput = document.getElementById('current-savings');
  const monthlySavingsInput = document.getElementById('monthly-savings');
  const returnInput = document.getElementById('market-return');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resFireNumber = document.getElementById('res-fire-number');
  const resYearsToFire = document.getElementById('res-years-to-fire');
  const resProgress = document.getElementById('res-progress');
  const resMonthlyIncome = document.getElementById('res-monthly-income');

  function calculate() {
    const annualExpenses = parseFloat(expensesInput.value) || 0;
    const withdrawalRate = (parseFloat(rateInput.value) || 4) / 100;
    const currentSavings = parseFloat(currentSavingsInput.value) || 0;
    const monthlySavings = parseFloat(monthlySavingsInput.value) || 0;
    const annualReturn = (parseFloat(returnInput.value) || 7) / 100;

    if (withdrawalRate <= 0) return;

    // 1. FIRE Number = Annual Expenses / Withdrawal Rate
    const fireNumber = annualExpenses / withdrawalRate;

    // 2. Monthly Income Potential
    const monthlyPassiveIncome = (currentSavings * withdrawalRate) / 12;

    // 3. Progress
    const progress = Math.min(100, (currentSavings / fireNumber) * 100);

    // 4. Years to FIRE (Solve for n in FV formula)
    let yearsToFire = 0;
    if (currentSavings >= fireNumber) {
      yearsToFire = 0;
    } else if (monthlySavings <= 0 && annualReturn <= 0) {
      yearsToFire = Infinity;
    } else {
      const r = annualReturn / 12;
      const P = monthlySavings;
      const PV = currentSavings;
      const FV = fireNumber;

      if (r > 0) {
        // Use log formula to find n (number of months)
        // FV = PV(1+r)^n + P * [((1+r)^n - 1) / r]
        // n = log((FV*r + P) / (PV*r + P)) / log(1 + r)
        const n = Math.log((FV * r + P) / (PV * r + P)) / Math.log(1 + r);
        yearsToFire = n / 12;
      } else {
        // If interest is 0, simple linear calculation
        yearsToFire = (FV - PV) / (P * 12);
      }
    }

    // Update UI
    resFireNumber.innerHTML = formatCurrencyDecimal(fireNumber);
    resProgress.textContent = progress.toFixed(1) + "%";
    resMonthlyIncome.innerHTML = formatCurrencyDecimal(monthlyPassiveIncome);

    if (yearsToFire === Infinity) {
      resYearsToFire.textContent = "Never (Need more savings)";
    } else if (yearsToFire <= 0) {
      resYearsToFire.textContent = "Reached FIRE!";
      resYearsToFire.style.color = "#10b981";
    } else {
      resYearsToFire.textContent = yearsToFire.toFixed(1) + " Years";
      resYearsToFire.style.color = "var(--primary)";
    }
  }

  calculateBtn.addEventListener('click', calculate);

  // Auto-calculate on input
  [expensesInput, rateInput, currentSavingsInput, monthlySavingsInput, returnInput].forEach(el => {
    el.addEventListener('input', calculate);
  });

  // Wiring currency change
  window.addEventListener('currencyChange', () => {
    calculate();
  });

  // Initial
  calculate();
});
