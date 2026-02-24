import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const salaryInput = document.getElementById('annual-salary');
  const hoursWeekInput = document.getElementById('hours-week');
  const weeksYearInput = document.getElementById('weeks-year');
  const hourlyRateInput = document.getElementById('hourly-rate');

  // Result Elements
  const resHourly = document.getElementById('res-hourly');
  const resMonthly = document.getElementById('res-monthly');
  const resWeekly = document.getElementById('res-weekly');
  const resDaily = document.getElementById('res-daily');

  function updateResults(source) {
    const hoursWeek = parseFloat(hoursWeekInput.value) || 0;
    const weeksYear = parseFloat(weeksYearInput.value) || 0;
    const totalHours = hoursWeek * weeksYear;

    let annual = 0;
    let hourly = 0;

    if (source === 'salary') {
      annual = parseFloat(salaryInput.value) || 0;
      hourly = totalHours > 0 ? annual / totalHours : 0;
      hourlyRateInput.value = hourly.toFixed(2);
    } else {
      hourly = parseFloat(hourlyRateInput.value) || 0;
      annual = hourly * totalHours;
      salaryInput.value = annual.toFixed(0);
    }

    const monthly = annual / 12;
    const weekly = weeksYear > 0 ? annual / weeksYear : 0;
    const daily = hoursWeek > 0 ? (weekly / hoursWeek) * 8 : 0; // Standard 8hr day benchmark

    // Update UI
    resHourly.textContent = formatCurrencyDecimal(hourly);
    resMonthly.textContent = formatCurrencyDecimal(monthly);
    resWeekly.textContent = formatCurrencyDecimal(weekly);
    resDaily.textContent = formatCurrencyDecimal(daily);
  }

  salaryInput.addEventListener('input', () => updateResults('salary'));
  hourlyRateInput.addEventListener('input', () => updateResults('hourly'));
  hoursWeekInput.addEventListener('input', () => updateResults('salary'));
  weeksYearInput.addEventListener('input', () => updateResults('salary'));

  // Initial Calculation
  updateResults('salary');

  // Listen for global currency changes
  window.addEventListener('currencyChange', () => updateResults('salary'));
});
