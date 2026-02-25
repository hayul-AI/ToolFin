import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const costInput = document.getElementById('investment-cost');
  const returnInput = document.getElementById('return-amount');
  const periodInput = document.getElementById('investment-period');
  const calculateBtn = document.getElementById('calculate-btn');

  // Result Elements
  const totalROI = document.getElementById('total-roi');
  const annualizedROI = document.getElementById('annualized-roi');
  const totalProfit = document.getElementById('total-profit');

  function calculate() {
    const cost = parseFloat(costInput.value) || 0;
    const finalValue = parseFloat(returnInput.value) || 0;
    const years = parseFloat(periodInput.value) || 0;

    if (cost === 0) {
      totalROI.textContent = '0.00%';
      annualizedROI.textContent = '0.00%';
      totalProfit.innerHTML = formatCurrency(0);
      return;
    }

    const profit = finalValue - cost;
    const roi = (profit / cost) * 100;
    
    let cagr = 0;
    if (years > 0 && finalValue > 0 && cost > 0) {
      // CAGR = [(FV/PV)^(1/n)] - 1
      cagr = (Math.pow(finalValue / cost, 1 / years) - 1) * 100;
    }

    // Update UI
    totalROI.textContent = `${roi.toFixed(2)}%`;
    totalROI.style.color = roi >= 0 ? '#10b981' : '#e11d48';
    
    annualizedROI.textContent = (years > 0 && finalValue > 0) ? `${cagr.toFixed(2)}%` : 'N/A';
    
    totalProfit.innerHTML = formatCurrencyDecimal(profit);
    totalProfit.style.color = profit >= 0 ? '#10b981' : '#e11d48';
  }

  [costInput, returnInput, periodInput].forEach(el => {
    el.addEventListener('input', calculate);
  });

  calculateBtn.addEventListener('click', calculate);

  // Wiring currency change
  window.addEventListener('currencyChange', () => {
    calculate();
  });

  // Initial Calculation
  calculate();
});
