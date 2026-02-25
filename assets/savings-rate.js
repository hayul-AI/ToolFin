import { formatCurrencyDecimal } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const inputs = [
    'monthly-income',
    'monthly-expenses',
    'monthly-savings'
  ];

  const elements = {};
  inputs.forEach(id => {
    elements[id] = document.getElementById(id);
  });

  const results = {
    savingsRate: document.getElementById('savings-rate-result'),
    healthIndicator: document.getElementById('health-indicator'),
    savingsAmount: document.getElementById('savings-amount-display'),
    fiYears: document.getElementById('fi-years-result'),
    interpretation: document.getElementById('interpretation-text')
  };

  function calculate() {
    const income = parseFloat(elements['monthly-income'].value) || 0;
    const expenses = parseFloat(elements['monthly-expenses'].value) || 0;
    let savings = parseFloat(elements['monthly-savings'].value);

    // If savings is NaN (empty), auto-calculate
    if (isNaN(savings)) {
      savings = Math.max(0, income - expenses);
      elements['monthly-savings'].placeholder = savings.toFixed(0);
    } else {
      elements['monthly-savings'].placeholder = "Auto-calculated";
    }

    let rate = 0;
    if (income > 0) {
      rate = (savings / income) * 100;
    }

    // Update results
    results.savingsRate.textContent = rate.toFixed(1) + '%';
    results.savingsAmount.innerHTML = formatCurrencyDecimal(savings);

    updateHealthIndicator(rate);
    updateFIYears(savings, expenses);
  }

  function updateHealthIndicator(rate) {
    let label = '';
    let color = '';

    if (rate < 10) {
      label = 'At Risk';
      color = '#991b1b'; // Red
    } else if (rate < 20) {
      label = 'Stable';
      color = '#92400e'; // Amber
    } else if (rate < 40) {
      label = 'Strong';
      color = '#15803d'; // Light Green
    } else {
      label = 'Excellent';
      color = '#166534'; // Dark Green
    }

    results.healthIndicator.textContent = label;
    results.healthIndicator.style.color = color;
  }

  function updateFIYears(savings, expenses) {
    if (savings <= 0) {
      results.fiYears.textContent = 'Achievable? No';
      results.fiYears.style.color = '#991b1b';
      results.interpretation.textContent = "Financial independence is not achievable at your current savings rate because your expenses exceed or equal your income.";
      return;
    }

    // Simplified FI formula: Target = 25 * Annual Expenses
    // Years = Target / Annual Savings
    // Years = (25 * (expenses * 12)) / (savings * 12) = (25 * expenses) / savings
    const years = (25 * expenses) / savings;

    results.fiYears.textContent = `~${years.toFixed(1)} Years`;
    results.fiYears.style.color = '#166534';

    let text = `By saving ${formatCurrencyDecimal(savings)} per month, you are keeping ${((savings/(savings+expenses+0.0001))*100).toFixed(0)}% of your lifestyle costs. `;
    if (years > 40) {
      text += "At this rate, reaching financial independence will take several decades. Focus on increasing the 'gap' to accelerate your progress.";
    } else if (years > 20) {
      text += "You are on a solid path to a traditional or slightly early retirement.";
    } else {
      text += "You are hyper-efficient! Your high savings rate means you will reach financial freedom very quickly.";
    }
    
    results.interpretation.textContent = text;
  }

  // Add event listeners
  inputs.forEach(id => {
    elements[id].addEventListener('input', calculate);
  });

  // Listen for currency changes
  window.addEventListener('currencyChange', calculate);

  // Initial calculation
  calculate();
});
