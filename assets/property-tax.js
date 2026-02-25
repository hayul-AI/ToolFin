import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const homeValueInput = document.getElementById('home-value');
  const assessmentRatioInput = document.getElementById('assessment-ratio');
  const taxRateInput = document.getElementById('tax-rate');
  const exemptionsInput = document.getElementById('exemptions');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resAnnualTax = document.getElementById('res-annual-tax');
  const resMonthlyTax = document.getElementById('res-monthly-tax');
  const resQuarterlyTax = document.getElementById('res-quarterly-tax');
  const resAssessedValue = document.getElementById('res-assessed-value');

  function calculate() {
    const marketValue = parseFloat(homeValueInput.value) || 0;
    const ratio = parseFloat(assessmentRatioInput.value) || 0;
    const rate = parseFloat(taxRateInput.value) || 0;
    const exemptionAmount = parseFloat(exemptionsInput.value) || 0;

    // 1. Calculate Assessed Value
    const assessedValue = marketValue * (ratio / 100);
    
    // 2. Calculate Taxable Value (Assessed - Exemptions)
    const taxableValue = Math.max(0, assessedValue - exemptionAmount);
    
    // 3. Calculate Annual Tax
    const annualTax = taxableValue * (rate / 100);
    
    // 4. Monthly and Quarterly
    const monthlyTax = annualTax / 12;
    const quarterlyTax = annualTax / 4;

    // UI Update
    resAnnualTax.innerHTML = formatCurrencyDecimal(annualTax);
    resMonthlyTax.innerHTML = formatCurrencyDecimal(monthlyTax);
    resQuarterlyTax.innerHTML = formatCurrencyDecimal(quarterlyTax);
    resAssessedValue.innerHTML = formatCurrency(assessedValue);
  }

  // Listeners
  [homeValueInput, assessmentRatioInput, taxRateInput, exemptionsInput].forEach(input => {
    input.addEventListener('input', calculate);
  });

  calculateBtn.addEventListener('click', calculate);

  // Sync with global currency
  window.addEventListener('currencyChange', calculate);

  // Initial
  calculate();
});
