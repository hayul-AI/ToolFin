import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const incomeInput = document.getElementById('monthly-income');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resNeeds = document.getElementById('res-needs');
  const resWants = document.getElementById('res-wants');
  const resSavings = document.getElementById('res-savings');

  // Bars
  const barNeeds = document.getElementById('bar-needs');
  const barWants = document.getElementById('bar-wants');
  const barSavings = document.getElementById('bar-savings');

  function calculate() {
    const income = parseFloat(incomeInput.value) || 0;

    const needs = income * 0.50;
    const wants = income * 0.30;
    const savings = income * 0.20;

    // UI Update
    resNeeds.innerHTML = formatCurrency(needs);
    resWants.innerHTML = formatCurrency(wants);
    resSavings.innerHTML = formatCurrency(savings);

    // Animation
    barNeeds.style.width = '50%';
    barWants.style.width = '30%';
    barSavings.style.width = '20%';
  }

  incomeInput.addEventListener('input', calculate);
  calculateBtn.addEventListener('click', calculate);

  // Sync with global currency
  window.addEventListener('currencyChange', calculate);

  // Initial
  calculate();
});
