import { formatCurrency, formatCurrencyDecimal } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const balanceInput = document.getElementById('balance');
  const aprInput = document.getElementById('apr');
  const monthlyPaymentInput = document.getElementById('monthly-payment');
  const extraPaymentInput = document.getElementById('extra-payment');
  const calculateBtn = document.getElementById('calculate-btn');

  // Result Elements
  const monthsResult = document.getElementById('months-to-payoff');
  const totalInterestResult = document.getElementById('total-interest');
  const totalPaidResult = document.getElementById('total-paid');
  const interpretationBox = document.getElementById('interpretation-box');

  // Extra Scenario Elements
  const extraScenarioPanel = document.getElementById('extra-scenario');
  const newPayoffTimeResult = document.getElementById('new-payoff-time');
  const timeSavedResult = document.getElementById('time-saved');
  const interestSavedResult = document.getElementById('interest-saved');

  function calculatePayoff(balance, apr, monthlyPayment) {
    const monthlyRate = (apr / 100) / 12;
    if (monthlyPayment <= balance * monthlyRate) {
      return { infinite: true };
    }

    let months = 0;
    let totalInterest = 0;
    let remainingBalance = balance;

    while (remainingBalance > 0 && months < 1200) { // Cap at 100 years
      const interestCharge = remainingBalance * monthlyRate;
      totalInterest += interestCharge;
      const principalPayment = Math.min(remainingBalance, monthlyPayment - interestCharge);
      remainingBalance -= principalPayment;
      months++;
    }

    return {
      months,
      totalInterest,
      totalAmountPaid: balance + totalInterest
    };
  }

  function update() {
    const balance = parseFloat(balanceInput.value) || 0;
    const apr = parseFloat(aprInput.value) || 0;
    const monthlyPayment = parseFloat(monthlyPaymentInput.value) || 0;
    const extraPayment = parseFloat(extraPaymentInput.value) || 0;

    if (balance <= 0 || monthlyPayment <= 0) {
      monthsResult.textContent = '0';
      totalInterestResult.innerHTML = formatCurrency(0);
      totalPaidResult.innerHTML = formatCurrency(0);
      interpretationBox.textContent = 'Enter values to see interpretation.';
      extraScenarioPanel.style.display = 'none';
      return;
    }

    const baseResult = calculatePayoff(balance, apr, monthlyPayment);

    if (baseResult.infinite) {
      monthsResult.textContent = '∞';
      totalInterestResult.textContent = 'N/A';
      totalPaidResult.textContent = 'N/A';
      interpretationBox.textContent = 'Payment is too low to cover monthly interest. Balance will grow over time.';
      extraScenarioPanel.style.display = 'none';
      return;
    }

    // Update Main Results
    monthsResult.textContent = `${baseResult.months} months`;
    totalInterestResult.innerHTML = formatCurrency(baseResult.totalInterest);
    totalPaidResult.innerHTML = formatCurrency(baseResult.totalAmountPaid);

    // Interpretation
    if (baseResult.months < 12) {
      interpretationBox.textContent = "Short repayment duration. A larger portion of each payment reduces the principal balance.";
    } else if (baseResult.months <= 36) {
      interpretationBox.textContent = "Moderate repayment duration. Interest accumulates but remains limited over time.";
    } else if (baseResult.months <= 72) {
      interpretationBox.textContent = "Extended repayment duration. Interest becomes a significant part of total payments.";
    } else {
      interpretationBox.textContent = "Long repayment duration. A considerable share of payments may go toward interest rather than principal.";
    }

    // Extra Payment Scenario
    if (extraPayment > 0) {
      const extraResult = calculatePayoff(balance, apr, monthlyPayment + extraPayment);
      if (!extraResult.infinite) {
        extraScenarioPanel.style.display = 'block';
        newPayoffTimeResult.textContent = `${extraResult.months} months`;
        timeSavedResult.textContent = `${baseResult.months - extraResult.months} months`;
        // Correcting interest saved logic
        interestSavedResult.innerHTML = formatCurrency(Math.max(0, baseResult.totalInterest - extraResult.totalInterest));
      } else {
        extraScenarioPanel.style.display = 'none';
      }
    } else {
      extraScenarioPanel.style.display = 'none';
    }
  }

  calculateBtn.addEventListener('click', update);
  
  // Listen for global currency changes
  window.addEventListener('currencyChange', update);

  // Initial update
  update();
});
