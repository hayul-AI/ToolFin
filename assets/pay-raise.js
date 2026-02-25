import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const currentSalaryInput = document.getElementById('current-salary');
  const raiseAmountInput = document.getElementById('raise-amount');
  const raisePercentInput = document.getElementById('raise-percent');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resNewSalary = document.getElementById('res-new-salary');
  const gainMonthly = document.getElementById('gain-monthly');
  const gainBiWeekly = document.getElementById('gain-biweekly');
  const gainWeekly = document.getElementById('gain-weekly');
  const gainDaily = document.getElementById('gain-daily');

  function updateFromAmount() {
    const current = parseFloat(currentSalaryInput.value) || 0;
    const amount = parseFloat(raiseAmountInput.value) || 0;
    
    if (current > 0) {
      const percent = (amount / current) * 100;
      raisePercentInput.value = percent.toFixed(2);
    } else {
      raisePercentInput.value = 0;
    }
    calculate();
  }

  function updateFromPercent() {
    const current = parseFloat(currentSalaryInput.value) || 0;
    const percent = parseFloat(raisePercentInput.value) || 0;
    
    const amount = current * (percent / 100);
    raiseAmountInput.value = amount.toFixed(0);
    calculate();
  }

  function calculate() {
    const current = parseFloat(currentSalaryInput.value) || 0;
    const raiseAmount = parseFloat(raiseAmountInput.value) || 0;
    const newSalary = current + raiseAmount;

    // Incremental Gains
    const monthly = raiseAmount / 12;
    const biweekly = raiseAmount / 26;
    const weekly = raiseAmount / 52;
    const daily = raiseAmount / 260; // 5 days * 52 weeks

    // Update UI
    resNewSalary.innerHTML = formatCurrencyDecimal(newSalary);
    gainMonthly.innerHTML = formatCurrencyDecimal(monthly);
    gainBiWeekly.innerHTML = formatCurrencyDecimal(biweekly);
    gainWeekly.innerHTML = formatCurrencyDecimal(weekly);
    gainDaily.innerHTML = formatCurrencyDecimal(daily);
  }

  raiseAmountInput.addEventListener('input', updateFromAmount);
  raisePercentInput.addEventListener('input', updateFromPercent);
  currentSalaryInput.addEventListener('input', calculate);
  calculateBtn.addEventListener('click', calculate);

  // Wiring currency change
  window.addEventListener('currencyChange', () => {
    calculate();
  });

  // Initial
  calculate();
});
