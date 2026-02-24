import { formatCurrency, formatCurrencyDecimal } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const loanAmountInput = document.getElementById('loan-amount');
  const aprInput = document.getElementById('apr');
  const loanTermInput = document.getElementById('loan-term');
  const downPaymentInput = document.getElementById('down-payment');
  const extraPaymentInput = document.getElementById('extra-payment');
  const calculateBtn = document.getElementById('calculate-btn');

  // Result Elements
  const monthlyPaymentResult = document.getElementById('monthly-payment-result');
  const totalInterestResult = document.getElementById('total-interest');
  const totalPaidResult = document.getElementById('total-paid');

  // Extra Scenario Elements
  const extraScenarioPanel = document.getElementById('extra-scenario');
  const newTermResult = document.getElementById('new-term');
  const interestSavedResult = document.getElementById('interest-saved');

  function calculateLoan(amount, apr, years, extra) {
    const monthlyRate = (apr / 100) / 12;
    const numberOfPayments = years * 12;
    
    let monthlyPayment = 0;
    if (monthlyRate === 0) {
      monthlyPayment = amount / numberOfPayments;
    } else {
      monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    const totalCost = monthlyPayment * numberOfPayments;
    const totalInterest = totalCost - amount;

    // Extra payment calculation
    let newMonths = 0;
    let newTotalInterest = 0;
    if (extra > 0) {
      let balance = amount;
      while (balance > 0 && newMonths < 1200) {
        const interestCharge = balance * monthlyRate;
        newTotalInterest += interestCharge;
        const principalPayment = Math.min(balance, (monthlyPayment + extra) - interestCharge);
        balance -= principalPayment;
        newMonths++;
      }
    }

    return {
      monthlyPayment,
      totalInterest,
      totalPaid: totalCost,
      newMonths,
      newTotalInterest,
      interestSaved: totalInterest - newTotalInterest
    };
  }

  function update() {
    const rawAmount = parseFloat(loanAmountInput.value) || 0;
    const downPayment = parseFloat(downPaymentInput.value) || 0;
    const amount = Math.max(0, rawAmount - downPayment);
    const apr = parseFloat(aprInput.value) || 0;
    const years = parseFloat(loanTermInput.value) || 0;
    const extra = parseFloat(extraPaymentInput.value) || 0;

    if (amount <= 0 || years <= 0) {
      monthlyPaymentResult.textContent = formatCurrency(0);
      totalInterestResult.textContent = formatCurrency(0);
      totalPaidResult.textContent = formatCurrency(0);
      extraScenarioPanel.style.display = 'none';
      return;
    }

    const results = calculateLoan(amount, apr, years, extra);

    monthlyPaymentResult.textContent = formatCurrencyDecimal(results.monthlyPayment);
    totalInterestResult.textContent = formatCurrency(results.totalInterest);
    totalPaidResult.textContent = formatCurrency(results.totalPaid);

    if (extra > 0 && results.newMonths > 0) {
      extraScenarioPanel.style.display = 'block';
      newTermResult.textContent = `${results.newMonths} months (${(results.newMonths / 12).toFixed(1)} years)`;
      interestSavedResult.textContent = formatCurrency(Math.max(0, results.interestSaved));
    } else {
      extraScenarioPanel.style.display = 'none';
    }
  }

  calculateBtn.addEventListener('click', update);
  
  const repaymentTypeEl = document.getElementById("repaymentType");
  if(repaymentTypeEl){
    // This calculator currently supports amortized repayment (default).
    // Keep the selection fixed to amortized for now.
    repaymentTypeEl.value = "amortized";
    repaymentTypeEl.addEventListener("change", () => {
      repaymentTypeEl.value = "amortized";
      update();
    });
  }
  
  // Listen for global currency changes
  window.addEventListener('currencyChange', update);

  // Initial update
  update();
});
