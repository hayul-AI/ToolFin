import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const originalPriceInput = document.getElementById('original-price');
  const discountPctInput = document.getElementById('discount-pct');
  const additionalOffInput = document.getElementById('additional-discount');
  const taxInput = document.getElementById('sales-tax');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resFinalPrice = document.getElementById('res-final-price');
  const resSavings = document.getElementById('res-savings');
  const resTotalTax = document.getElementById('res-total-tax');
  const resOriginal = document.getElementById('res-original');

  function calculate() {
    const original = parseFloat(originalPriceInput.value) || 0;
    const pct = parseFloat(discountPctInput.value) || 0;
    const off = parseFloat(additionalOffInput.value) || 0;
    const taxRate = parseFloat(taxInput.value) || 0;

    const discountAmount = original * (pct / 100);
    const priceAfterPct = original - discountAmount;
    const finalBeforeTax = Math.max(0, priceAfterPct - off);
    
    const taxAmount = finalBeforeTax * (taxRate / 100);
    const finalPrice = finalBeforeTax + taxAmount;
    const totalSavings = original - finalBeforeTax;

    // UI Update
    resFinalPrice.innerHTML = formatCurrencyDecimal(finalPrice);
    resSavings.innerHTML = formatCurrencyDecimal(totalSavings);
    resTotalTax.innerHTML = formatCurrencyDecimal(taxAmount);
    resOriginal.innerHTML = formatCurrencyDecimal(original);
  }

  [originalPriceInput, discountPctInput, additionalOffInput, taxInput].forEach(el => {
    el.addEventListener('input', calculate);
  });
  calculateBtn.addEventListener('click', calculate);

  // Initial
  calculate();
});
