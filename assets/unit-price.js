import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const p1PriceInput = document.getElementById('p1-price');
  const p1QtyInput = document.getElementById('p1-qty');
  const p1UnitSelect = document.getElementById('p1-unit');
  
  const p2PriceInput = document.getElementById('p2-price');
  const p2QtyInput = document.getElementById('p2-qty');
  const p2UnitSelect = document.getElementById('p2-unit');

  // Results
  const p1UnitDisplay = document.getElementById('p1-unit-price');
  const p2UnitDisplay = document.getElementById('p2-unit-price');
  const p1Box = document.getElementById('product-1');
  const p2Box = document.getElementById('product-2');
  const verdictBox = document.getElementById('verdict-box');

  // Conversion factors to a base unit (grams)
  const toGrams = {
    'g': 1,
    'kg': 1000,
    'mg': 0.001,
    'oz': 28.3495,
    'lb': 453.592
  };

  function calculate() {
    const p1Price = parseFloat(p1PriceInput.value) || 0;
    const p1Qty = parseFloat(p1QtyInput.value) || 1;
    const p1UnitType = p1UnitSelect.value;

    const p2Price = parseFloat(p2PriceInput.value) || 0;
    const p2Qty = parseFloat(p2QtyInput.value) || 1;
    const p2UnitType = p2UnitSelect.value;

    // Calculate price per base unit (grams) for internal comparison
    const p1QtyGrams = p1Qty * toGrams[p1UnitType];
    const p2QtyGrams = p2Qty * toGrams[p2UnitType];

    const p1PricePerGram = p1Price / p1QtyGrams;
    const p2PricePerGram = p2Price / p2QtyGrams;

    // Calculate display price per original unit
    const p1UnitPrice = p1Price / p1Qty;
    const p2UnitPrice = p2Price / p2Qty;

    // UI Update
    p1UnitDisplay.innerHTML = `${formatCurrencyDecimal(p1UnitPrice)} / ${p1UnitType}`;
    p2UnitDisplay.innerHTML = `${formatCurrencyDecimal(p2UnitPrice)} / ${p2UnitType}`;

    p1Box.classList.remove('better');
    p2Box.classList.remove('better');

    // Use price per gram for comparison to handle different units
    if (p1PricePerGram < p2PricePerGram) {
      p1Box.classList.add('better');
      const diff = ((p2PricePerGram - p1PricePerGram) / p2PricePerGram) * 100;
      verdictBox.textContent = `Option A is ${diff.toFixed(1)}% cheaper.`;
    } else if (p2PricePerGram < p1PricePerGram) {
      p2Box.classList.add('better');
      const diff = ((p1PricePerGram - p2PricePerGram) / p1PricePerGram) * 100;
      verdictBox.textContent = `Option B is ${diff.toFixed(1)}% cheaper.`;
    } else {
      verdictBox.textContent = "Both options have the same unit value.";
    }
  }

  [p1PriceInput, p1QtyInput, p1UnitSelect, p2PriceInput, p2QtyInput, p2UnitSelect].forEach(el => {
    el.addEventListener('input', calculate);
  });

  // Listen for currency changes
  window.addEventListener('currencyChange', calculate);

  // Initial
  calculate();
});
