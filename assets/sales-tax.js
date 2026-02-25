import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const priceInput = document.getElementById('price');
  const taxRateInput = document.getElementById('tax-rate');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resTotal = document.getElementById('res-total');
  const resTaxAmount = document.getElementById('res-tax-amount');
  const resBasePrice = document.getElementById('res-base-price');

  function calculate() {
    const price = parseFloat(priceInput.value) || 0;
    const rate = parseFloat(taxRateInput.value) || 0;

    const taxAmount = price * (rate / 100);
    const total = price + taxAmount;

    // UI Update
    resTotal.innerHTML = formatCurrencyDecimal(total);
    resTaxAmount.innerHTML = formatCurrencyDecimal(taxAmount);
    resBasePrice.innerHTML = formatCurrencyDecimal(price);
  }

  priceInput.addEventListener('input', calculate);
  taxRateInput.addEventListener('input', calculate);
  calculateBtn.addEventListener('click', calculate);

  // Sync with global currency
  window.addEventListener('currencyChange', calculate);

  // Initial
  calculate();
});
