import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const rateInput = document.getElementById('hourly-rate');
  const regHoursInput = document.getElementById('reg-hours');
  const otHoursInput = document.getElementById('ot-hours');
  const dtHoursInput = document.getElementById('dt-hours');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resTotalGross = document.getElementById('res-total-gross');
  const breakReg = document.getElementById('break-reg');
  const breakOt = document.getElementById('break-ot');
  const breakDt = document.getElementById('break-dt');
  const breakTotal = document.getElementById('break-total');
  const otRateDisplay = document.getElementById('ot-rate-display');
  const dtRateDisplay = document.getElementById('dt-rate-display');

  function calculate() {
    const hourlyRate = parseFloat(rateInput.value) || 0;
    const regHours = parseFloat(regHoursInput.value) || 0;
    const otHours = parseFloat(otHoursInput.value) || 0;
    const dtHours = parseFloat(dtHoursInput.value) || 0;

    if (hourlyRate < 0) return;

    const otRate = hourlyRate * 1.5;
    const dtRate = hourlyRate * 2.0;

    const regPay = hourlyRate * regHours;
    const otPay = otRate * otHours;
    const dtPay = dtRate * dtHours;
    const totalGross = regPay + otPay + dtPay;

    // Update UI
    resTotalGross.innerHTML = formatCurrencyDecimal(totalGross);
    breakReg.innerHTML = formatCurrencyDecimal(regPay);
    breakOt.innerHTML = formatCurrencyDecimal(otPay);
    breakDt.innerHTML = formatCurrencyDecimal(dtPay);
    breakTotal.innerHTML = formatCurrencyDecimal(totalGross);

    otRateDisplay.innerHTML = formatCurrencyDecimal(otRate);
    dtRateDisplay.innerHTML = formatCurrencyDecimal(dtRate);
  }

  calculateBtn.addEventListener('click', calculate);

  // Auto-calculate on input
  [rateInput, regHoursInput, otHoursInput, dtHoursInput].forEach(el => {
    el.addEventListener('input', calculate);
  });

  // Wiring currency change
  window.addEventListener('currencyChange', () => {
    calculate();
  });

  // Initial
  calculate();
});
