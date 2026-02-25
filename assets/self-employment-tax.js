import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const profitInput = document.getElementById('net-profit');
  const statusSelect = document.getElementById('filing-status');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resTotalTax = document.getElementById('res-total-se-tax');
  const breakSS = document.getElementById('break-ss');
  const breakMed = document.getElementById('break-med');
  const breakNet = document.getElementById('break-net');

  function calculate() {
    const netProfit = parseFloat(profitInput.value) || 0;
    const status = statusSelect.value;

    if (netProfit <= 0) {
        resTotalTax.innerHTML = formatCurrencyDecimal(0);
        breakSS.innerHTML = formatCurrencyDecimal(0);
        breakMed.innerHTML = formatCurrencyDecimal(0);
        breakNet.innerHTML = formatCurrencyDecimal(0);
        return;
    }

    // 1. Only 92.35% of net profit is subject to SE tax
    const taxableProfit = netProfit * 0.9235;

    // 2. Social Security Portion (12.4% up to cap)
    const ssCap = 168600; // 2024 cap
    const ssTax = Math.min(taxableProfit, ssCap) * 0.124;

    // 3. Medicare Portion (2.9% on all)
    const medTax = taxableProfit * 0.029;

    // 4. Additional Medicare Tax (0.9% above threshold)
    let threshold = 200000;
    if (status === 'married') threshold = 250000;
    
    const addMedTax = Math.max(0, netProfit - threshold) * 0.009;

    const totalSEtax = ssTax + medTax + addMedTax;
    const afterTaxProfit = netProfit - totalSEtax;

    // Update UI
    resTotalTax.innerHTML = formatCurrencyDecimal(totalSEtax);
    breakSS.innerHTML = formatCurrencyDecimal(ssTax);
    breakMed.innerHTML = formatCurrencyDecimal(medTax + addMedTax);
    breakNet.innerHTML = formatCurrencyDecimal(afterTaxProfit);
  }

  calculateBtn.addEventListener('click', calculate);

  // Auto-calculate on input
  [profitInput, statusSelect].forEach(el => {
    el.addEventListener('input', calculate);
  });

  // Wiring currency change
  window.addEventListener('currencyChange', () => {
    calculate();
  });

  // Initial
  calculate();
});
