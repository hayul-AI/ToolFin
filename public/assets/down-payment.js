import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const homePriceInput = document.getElementById('home-price');
  const downPercentInput = document.getElementById('down-percent');
  const currentSavingsInput = document.getElementById('current-savings');
  const interestRateInput = document.getElementById('interest-rate');
  const loanTermInput = document.getElementById('loan-term');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resTargetAmount = document.getElementById('res-target-amount');
  const resStillNeeded = document.getElementById('res-still-needed');
  const resProgressBar = document.getElementById('res-progress-bar');
  const resProgressText = document.getElementById('res-progress-text');
  const resLoanAmount = document.getElementById('res-loan-amount');
  const resMonthlyPI = document.getElementById('res-monthly-pi');

  function calculate() {
    const price = parseFloat(homePriceInput.value) || 0;
    const percent = parseFloat(downPercentInput.value) || 0;
    const savings = parseFloat(currentSavingsInput.value) || 0;
    const rate = parseFloat(interestRateInput.value) || 0;
    const term = parseFloat(loanTermInput.value) || 30;

    // 1. Goal Calculation
    const targetAmount = price * (percent / 100);
    const stillNeeded = Math.max(0, targetAmount - savings);
    const progress = targetAmount > 0 ? Math.min(100, (savings / targetAmount) * 100) : 0;

    // 2. Mortgage Impact
    const loanAmount = Math.max(0, price - targetAmount);
    const monthlyRate = (rate / 100) / 12;
    const numberOfPayments = term * 12;
    
    let monthlyPayment = 0;
    if (loanAmount > 0) {
      if (monthlyRate === 0) {
        monthlyPayment = loanAmount / numberOfPayments;
      } else {
        monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      }
    }

    // 3. UI Update
    resTargetAmount.innerHTML = formatCurrency(targetAmount);
    resStillNeeded.innerHTML = formatCurrency(stillNeeded);
    resProgressBar.style.width = `${progress}%`;
    resProgressText.innerHTML = `${progress.toFixed(1)}% of goal reached`;
    resLoanAmount.innerHTML = formatCurrency(loanAmount);
    resMonthlyPI.innerHTML = formatCurrencyDecimal(monthlyPayment);
  }

  // Listeners
  [homePriceInput, downPercentInput, currentSavingsInput, interestRateInput, loanTermInput].forEach(input => {
    input.addEventListener('input', calculate);
  });

  calculateBtn.addEventListener('click', calculate);

  // Sync with global currency
  window.addEventListener('currencyChange', calculate);

  // Initial
  calculate();
});
