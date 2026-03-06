import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const billInput = document.getElementById('bill-amount');
  const customTipInput = document.getElementById('custom-tip');
  const splitInput = document.getElementById('split-count');
  const tipBtns = document.querySelectorAll('.tip-btn');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resTotalPerPerson = document.getElementById('res-total-per-person');
  const resTotalTip = document.getElementById('res-total-tip');
  const resTipPerPerson = document.getElementById('res-tip-per-person');
  const resFinalBill = document.getElementById('res-final-bill');

  let currentTipPercent = 18;

  function calculate() {
    const bill = parseFloat(billInput.value) || 0;
    const split = parseInt(splitInput.value) || 1;
    
    // Use custom if provided, else use button selection
    const customTip = parseFloat(customTipInput.value);
    const tipPercent = !isNaN(customTip) ? customTip : currentTipPercent;

    const totalTip = bill * (tipPercent / 100);
    const finalBill = bill + totalTip;
    const totalPerPerson = finalBill / split;
    const tipPerPerson = totalTip / split;

    // UI Update
    resTotalPerPerson.innerHTML = formatCurrencyDecimal(totalPerPerson);
    resTotalTip.innerHTML = formatCurrencyDecimal(totalTip);
    resTipPerPerson.innerHTML = formatCurrencyDecimal(tipPerPerson);
    resFinalBill.innerHTML = formatCurrencyDecimal(finalBill);
  }

  tipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tipBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTipPercent = parseFloat(btn.dataset.value);
      customTipInput.value = ''; // clear custom
      calculate();
    });
  });

  customTipInput.addEventListener('input', () => {
    tipBtns.forEach(b => b.classList.remove('active'));
    calculate();
  });

  [billInput, splitInput].forEach(el => el.addEventListener('input', calculate));
  calculateBtn.addEventListener('click', calculate);

  // Sync with global currency
  window.addEventListener('currencyChange', calculate);

  // Initial
  calculate();
});
