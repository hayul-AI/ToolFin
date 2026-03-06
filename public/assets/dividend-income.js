import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const portfolioInput = document.getElementById('portfolio-value');
  const yieldInput = document.getElementById('dividend-yield');
  const frequencySelect = document.getElementById('payout-frequency');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resAnnual = document.getElementById('res-annual-income');
  const resMonthly = document.getElementById('res-monthly-income');
  const resQuarterly = document.getElementById('res-quarterly-income');
  const resWeekly = document.getElementById('res-weekly-income');
  const resDaily = document.getElementById('res-daily-income');

  function calculate() {
    const portfolioValue = parseFloat(portfolioInput.value) || 0;
    const dividendYield = (parseFloat(yieldInput.value) || 0) / 100;

    if (portfolioValue <= 0) {
        resAnnual.innerHTML = formatCurrencyDecimal(0);
        resMonthly.innerHTML = formatCurrencyDecimal(0);
        resQuarterly.innerHTML = formatCurrencyDecimal(0);
        resWeekly.innerHTML = formatCurrencyDecimal(0);
        resDaily.innerHTML = formatCurrencyDecimal(0);
        return;
    }

    const annualIncome = portfolioValue * dividendYield;
    const monthlyIncome = annualIncome / 12;
    const quarterlyIncome = annualIncome / 4;
    const weeklyIncome = annualIncome / 52;
    const dailyIncome = annualIncome / 365;

    // Update UI
    resAnnual.innerHTML = formatCurrencyDecimal(annualIncome);
    resMonthly.innerHTML = formatCurrencyDecimal(monthlyIncome);
    resQuarterly.innerHTML = formatCurrencyDecimal(quarterlyIncome);
    resWeekly.innerHTML = formatCurrencyDecimal(weeklyIncome);
    resDaily.innerHTML = formatCurrencyDecimal(dailyIncome);
  }

  calculateBtn.addEventListener('click', calculate);

  // Auto-calculate on input changes
  [portfolioInput, yieldInput, frequencySelect].forEach(el => {
    el.addEventListener('input', calculate);
  });

  // Wiring currency change
  window.addEventListener('currencyChange', () => {
    calculate();
  });

  // Initial
  calculate();
});
