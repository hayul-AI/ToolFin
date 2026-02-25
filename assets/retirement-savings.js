import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const currentAgeInput = document.getElementById('current-age');
  const retirementAgeInput = document.getElementById('retirement-age');
  const initialInput = document.getElementById('initial-balance');
  const contributionInput = document.getElementById('monthly-contribution');
  const returnInput = document.getElementById('return-rate');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resTotalBalance = document.getElementById('res-total-balance');
  const resYears = document.getElementById('res-years');
  const resContributions = document.getElementById('res-contributions');
  const resMonthlyDraw = document.getElementById('res-monthly-draw');

  function calculate() {
    const currentAge = parseInt(currentAgeInput.value) || 0;
    const retirementAge = parseInt(retirementAgeInput.value) || 0;
    const initial = parseFloat(initialInput.value) || 0;
    const monthlyContribution = parseFloat(contributionInput.value) || 0;
    const annualReturn = (parseFloat(returnInput.value) || 0) / 100;

    const yearsToSave = retirementAge - currentAge;

    if (yearsToSave <= 0) {
      resTotalBalance.innerHTML = formatCurrencyDecimal(initial);
      resYears.textContent = "0";
      resContributions.innerHTML = formatCurrencyDecimal(initial);
      resMonthlyDraw.innerHTML = formatCurrencyDecimal((initial * 0.04) / 12);
      return;
    }

    const n = yearsToSave * 12;
    const r = annualReturn / 12;

    // FV = P(1+r)^n + PMT * [((1+r)^n - 1) / r]
    let fv = initial * Math.pow(1 + r, n);
    if (r > 0) {
      fv += monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
    } else {
      fv += monthlyContribution * n;
    }

    const totalContributions = initial + (monthlyContribution * n);
    const monthlyDraw = (fv * 0.04) / 12;

    // Update UI
    resTotalBalance.innerHTML = formatCurrencyDecimal(fv);
    resYears.textContent = yearsToSave.toString();
    resContributions.innerHTML = formatCurrencyDecimal(totalContributions);
    resMonthlyDraw.innerHTML = formatCurrencyDecimal(monthlyDraw);
  }

  calculateBtn.addEventListener('click', calculate);

  // Auto-calculate on input changes
  [currentAgeInput, retirementAgeInput, initialInput, contributionInput, returnInput].forEach(el => {
    el.addEventListener('input', calculate);
  });

  // Wiring currency change
  window.addEventListener('currencyChange', () => {
    calculate();
  });

  // Initial
  calculate();
});
