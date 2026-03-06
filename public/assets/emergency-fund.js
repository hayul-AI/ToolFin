import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const inputs = [
    'exp-housing', 'exp-utilities', 'exp-food', 'exp-transport', 'exp-other'
  ];
  const monthsSelect = document.getElementById('fund-months');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resTargetFund = document.getElementById('res-target-fund');
  const resMonthlyTotal = document.getElementById('res-monthly-total');
  const resDailyBuffer = document.getElementById('res-daily-buffer');
  const resYearlyTotal = document.getElementById('res-yearly-total');

  function calculate() {
    let monthlyTotal = 0;
    inputs.forEach(id => {
      monthlyTotal += parseFloat(document.getElementById(id).value) || 0;
    });

    const months = parseInt(monthsSelect.value) || 6;
    const targetFund = monthlyTotal * months;
    const dailyBuffer = (monthlyTotal * 12) / 365;
    const yearlyTotal = monthlyTotal * 12;

    // UI Update
    resTargetFund.innerHTML = formatCurrency(targetFund);
    resMonthlyTotal.innerHTML = formatCurrency(monthlyTotal);
    resDailyBuffer.innerHTML = formatCurrencyDecimal(dailyBuffer);
    resYearlyTotal.innerHTML = formatCurrency(yearlyTotal);
  }

  // Listeners
  inputs.forEach(id => {
    document.getElementById(id).addEventListener('input', calculate);
  });
  monthsSelect.addEventListener('change', calculate);
  calculateBtn.addEventListener('click', calculate);

  // Sync with global currency
  window.addEventListener('currencyChange', calculate);

  // Initial
  calculate();
});
