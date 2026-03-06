import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const bonusInput = document.getElementById('bonus-amount');
  const methodSelect = document.getElementById('fed-tax-method');
  const marginalGroup = document.getElementById('marginal-rate-group');
  const marginalInput = document.getElementById('marginal-rate');
  const stateRateInput = document.getElementById('state-tax-rate');
  const ficaCheckbox = document.getElementById('include-fica');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resNetBonus = document.getElementById('res-net-bonus');
  const breakGross = document.getElementById('break-gross');
  const breakFed = document.getElementById('break-fed');
  const breakFica = document.getElementById('break-fica');
  const breakState = document.getElementById('break-state');
  const breakTotalTax = document.getElementById('break-total-tax');

  function toggleMethod() {
    if (methodSelect.value === 'aggregate') {
      marginalGroup.style.display = 'block';
    } else {
      marginalGroup.style.display = 'none';
    }
  }

  function calculate() {
    const grossBonus = parseFloat(bonusInput.value) || 0;
    const method = methodSelect.value;
    const stateRate = (parseFloat(stateRateInput.value) || 0) / 100;
    const includeFica = ficaCheckbox.checked;

    if (grossBonus <= 0) return;

    // 1. Federal Tax
    let fedRate = 0.22; // Default supplemental rate for < $1M
    if (grossBonus > 1000000) {
        fedRate = 0.37; // Supplemental rate for > $1M
    }
    
    if (method === 'aggregate') {
        fedRate = (parseFloat(marginalInput.value) || 0) / 100;
    }

    const fedTax = grossBonus * fedRate;

    // 2. FICA (7.65% standard)
    const ficaTax = includeFica ? grossBonus * 0.0765 : 0;

    // 3. State Tax
    const stateTax = grossBonus * stateRate;

    const totalTax = fedTax + ficaTax + stateTax;
    const netBonus = Math.max(0, grossBonus - totalTax);

    // Update UI
    resNetBonus.innerHTML = formatCurrencyDecimal(netBonus);
    breakGross.innerHTML = formatCurrencyDecimal(grossBonus);
    breakFed.innerHTML = formatCurrencyDecimal(fedTax);
    breakFica.innerHTML = formatCurrencyDecimal(ficaTax);
    breakState.innerHTML = formatCurrencyDecimal(stateTax);
    breakTotalTax.innerHTML = formatCurrencyDecimal(totalTax);
  }

  methodSelect.addEventListener('change', () => {
    toggleMethod();
    calculate();
  });

  calculateBtn.addEventListener('click', calculate);

  // Auto-calculate on changes
  [bonusInput, marginalInput, stateRateInput, ficaCheckbox].forEach(el => {
    el.addEventListener('input', calculate);
  });

  // Wiring currency change
  window.addEventListener('currencyChange', () => {
    calculate();
  });

  // Initial
  toggleMethod();
  calculate();
});
