import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const p1PriceInput = document.getElementById('p1-price');
  const p1QtyInput = document.getElementById('p1-qty');
  const p2PriceInput = document.getElementById('p2-price');
  const p2QtyInput = document.getElementById('p2-qty');
  const unitLabelInput = document.getElementById('unit-label');
  const unitSync = document.getElementById('unit-label-sync');

  // Results
  const p1UnitDisplay = document.getElementById('p1-unit-price');
  const p2UnitDisplay = document.getElementById('p2-unit-price');
  const p1Box = document.getElementById('product-1');
  const p2Box = document.getElementById('product-2');
  const verdictBox = document.getElementById('verdict-box');

  function calculate() {
    const p1Price = parseFloat(p1PriceInput.value) || 0;
    const p1Qty = parseFloat(p1QtyInput.value) || 1;
    const p2Price = parseFloat(p2PriceInput.value) || 0;
    const p2Qty = parseFloat(p2QtyInput.value) || 1;
    const unit = unitLabelInput.value || 'unit';

    unitSync.textContent = unit;

    const p1Unit = p1Price / p1Qty;
    const p2Unit = p2Price / p2Qty;

    // UI Update
    p1UnitDisplay.innerHTML = `${formatCurrencyDecimal(p1Unit)} / ${unit}`;
    p2UnitDisplay.innerHTML = `${formatCurrencyDecimal(p2Unit)} / ${unit}`;

    p1Box.classList.remove('better');
    p2Box.classList.remove('better');

    if (p1Unit < p2Unit) {
      p1Box.classList.add('better');
      const diff = ((p2Unit - p1Unit) / p2Unit) * 100;
      verdictBox.textContent = `Option A is ${diff.toFixed(1)}% cheaper per ${unit}.`;
    } else if (p2Unit < p1Unit) {
      p2Box.classList.add('better');
      const diff = ((p1Unit - p2Unit) / p1Unit) * 100;
      verdictBox.textContent = `Option B is ${diff.toFixed(1)}% cheaper per ${unit}.`;
    } else {
      verdictBox.textContent = "Both options have the same unit price.";
    }
  }

  [p1PriceInput, p1QtyInput, p2PriceInput, p2QtyInput, unitLabelInput].forEach(el => {
    el.addEventListener('input', calculate);
  });

  // Initial
  calculate();
});
