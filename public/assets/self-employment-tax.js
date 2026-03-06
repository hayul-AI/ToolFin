import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const profitInput = document.getElementById('net-profit');
  const rateInput = document.getElementById('tax-rate');
  const statusSelect = document.getElementById('filing-status');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resTotalTax = document.getElementById('res-total-se-tax');
  const breakTax = document.getElementById('break-tax');
  const breakNet = document.getElementById('break-net');

  function calculate() {
    const netProfit = parseFloat(profitInput.value) || 0;
    const taxRate = (parseFloat(rateInput.value) || 0) / 100;
    const status = statusSelect.value;

    if (netProfit <= 0) {
        resTotalTax.innerHTML = formatCurrencyDecimal(0);
        breakTax.innerHTML = formatCurrencyDecimal(0);
        breakNet.innerHTML = formatCurrencyDecimal(0);
        return;
    }

    // Default US logic if rate is 15.3% exactly, otherwise use simple percentage
    let totalSEtax = 0;
    
    if (rateInput.value === "15.3") {
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
      totalSEtax = ssTax + medTax + addMedTax;
    } else {
      // Simple percentage calculation for custom rates
      totalSEtax = netProfit * taxRate;
    }

    const afterTaxProfit = netProfit - totalSEtax;

    // Update UI
    resTotalTax.innerHTML = formatCurrencyDecimal(totalSEtax);
    breakTax.innerHTML = formatCurrencyDecimal(totalSEtax);
    breakNet.innerHTML = formatCurrencyDecimal(afterTaxProfit);
  }

  calculateBtn.addEventListener('click', calculate);

  // Auto-calculate on input
  [profitInput, rateInput, statusSelect].forEach(el => {
    el.addEventListener('input', calculate);
  });

  // Wiring currency change
  window.addEventListener('currencyChange', () => {
    calculate();
  });

  // Initial
  calculate();
});
