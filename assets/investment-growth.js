import { formatCurrency, formatCurrencyDecimal } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const initialInput = document.getElementById('initial-balance');
  const contributionInput = document.getElementById('contribution-amount');
  const frequencySelect = document.getElementById('contribution-frequency');
  const returnInput = document.getElementById('return-rate');
  const yearsInput = document.getElementById('investment-years');
  const inflationInput = document.getElementById('inflation-rate');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resFutureValue = document.getElementById('res-future-value');
  const resAdjustedValue = document.getElementById('res-adjusted-value');
  const resTotalContributions = document.getElementById('res-total-contributions');
  const resTotalInterest = document.getElementById('res-total-interest');

  function calculate() {
    const initial = parseFloat(initialInput.value) || 0;
    const contribution = parseFloat(contributionInput.value) || 0;
    const frequency = parseInt(frequencySelect.value) || 12;
    const annualReturn = (parseFloat(returnInput.value) || 0) / 100;
    const years = parseFloat(yearsInput.value) || 0;
    const inflation = (parseFloat(inflationInput.value) || 0) / 100;

    if (years < 0) return;

    // Monthly compounding assumption for standard growth modeling
    const compoundingFreq = 12; 
    const r = annualReturn / compoundingFreq;
    const n = compoundingFreq * years;
    
    // Contributions mapped to compounding periods
    const contributionPerCompoundingPeriod = (contribution * frequency) / compoundingFreq;

    // FV = P(1+r)^n + PMT * [((1+r)^n - 1) / r]
    let fv = initial * Math.pow(1 + r, n);
    if (r > 0) {
      fv += contributionPerCompoundingPeriod * ((Math.pow(1 + r, n) - 1) / r);
    } else {
      fv += contributionPerCompoundingPeriod * n;
    }

    const totalContributions = initial + (contribution * frequency * years);
    const totalInterest = Math.max(0, fv - totalContributions);

    // Adjusted for Inflation: Real Value = Nominal Value / (1 + i)^n
    const adjustedValue = fv / Math.pow(1 + inflation, years);

    // Update UI
    resFutureValue.innerHTML = formatCurrencyDecimal(fv);
    resAdjustedValue.innerHTML = formatCurrencyDecimal(adjustedValue);
    resTotalContributions.innerHTML = formatCurrencyDecimal(totalContributions);
    resTotalInterest.innerHTML = formatCurrencyDecimal(totalInterest);
  }

  calculateBtn.addEventListener('click', calculate);

  // Auto-calculate on input
  [initialInput, contributionInput, frequencySelect, returnInput, yearsInput, inflationInput].forEach(el => {
    el.addEventListener('input', calculate);
  });

  // Wiring currency change
  window.addEventListener('currencyChange', () => {
    calculate();
  });

  // Initial
  calculate();
});
