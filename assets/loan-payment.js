import { formatCurrency, formatCurrencyDecimal } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const repaymentTypeInput = document.getElementById('repaymentType');
  const loanAmountInput = document.getElementById('loan-amount');
  const aprInput = document.getElementById('apr');
  const loanTermInput = document.getElementById('loan-term');
  const downPaymentInput = document.getElementById('down-payment');
  const extraPaymentInput = document.getElementById('extra-payment');
  const calculateBtn = document.getElementById('calculate-btn');

  // Result Elements
  const monthlyPaymentResult = document.getElementById('monthly-payment-result');
  const payoffNote = document.getElementById('payoff-note');
  const totalInterestResult = document.getElementById('total-interest');
  const totalPaidResult = document.getElementById('total-paid');

  // Extra Scenario Elements
  const extraScenarioPanel = document.getElementById('extra-scenario');
  const newTermResult = document.getElementById('new-term');
  const interestSavedResult = document.getElementById('interest-saved');

  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

  function computeAmortized(principal, apr, months, extraMonthly) {
    const r = (apr / 100) / 12;
    const base = (r === 0) ? (principal / months) : (principal * r) / (1 - Math.pow(1 + r, -months));

    if (extraMonthly <= 0) {
      const totalPaid = base * months;
      const totalInterest = totalPaid - principal;
      return { monthlyPayment: base, totalInterest, totalPaid, payoffMonths: months, paidOffEarly: false };
    }

    // simulate with extra
    let balance = principal;
    let totalInterest = 0;
    let totalPaid = 0;
    let m = 0;
    const cap = 1200;

    while (balance > 0.01 && m < cap) {
      const interest = balance * r;
      const payment = base + extraMonthly;
      let principalPaid = payment - interest;
      if (principalPaid < 0) principalPaid = 0;
      if (principalPaid > balance) principalPaid = balance;

      totalInterest += interest;
      totalPaid += (interest + principalPaid);
      balance -= principalPaid;
      m++;
      if (m > months && balance <= 0.01) break;
    }

    return { monthlyPayment: base, totalInterest, totalPaid, payoffMonths: m, paidOffEarly: m < months };
  }

  function computeInterestOnly(principal, apr, months, extraMonthly) {
    const r = (apr / 100) / 12;
    const interestOnlyPayment = principal * r;

    if (extraMonthly <= 0) {
      const totalInterest = interestOnlyPayment * months;
      // For Interest Only, Total Paid usually includes the principal at the end, 
      // but we follow the provided formula: totalPaid = interestOnlyPayment * months
      const totalPaid = interestOnlyPayment * months;
      return { monthlyPayment: interestOnlyPayment, totalInterest, totalPaid, payoffMonths: months, paidOffEarly: false };
    }

    // simulate: interest payment + extra goes to principal
    let balance = principal;
    let totalInterest = 0;
    let totalPaid = 0;
    let m = 0;
    const cap = 1200;

    while (balance > 0.01 && m < cap) {
      const interest = balance * r;
      const payment = interestOnlyPayment + extraMonthly;
      let principalPaid = payment - interest;
      if (principalPaid < 0) principalPaid = 0;
      if (principalPaid > balance) principalPaid = balance;

      totalInterest += interest;
      totalPaid += (interest + principalPaid);
      balance -= principalPaid;
      m++;
      if (m > months && balance <= 0.01) break;
    }

    return { monthlyPayment: interestOnlyPayment, totalInterest, totalPaid, payoffMonths: m, paidOffEarly: m < months };
  }

  function update() {
    const method = repaymentTypeInput.value;
    const rawAmount = parseFloat(loanAmountInput.value) || 0;
    const downPayment = parseFloat(downPaymentInput.value) || 0;
    const principalNet = Math.max(0, rawAmount - downPayment);
    const rawApr = parseFloat(aprInput.value) || 0;
    const apr = clamp(rawApr, 0, 100);
    const years = parseFloat(loanTermInput.value) || 0;
    const months = Math.max(1, Math.round(years * 12));
    const extraMonthly = Math.max(0, parseFloat(extraPaymentInput.value) || 0);

    if (principalNet <= 0 || years <= 0) {
      monthlyPaymentResult.innerHTML = formatCurrency(0);
      totalInterestResult.innerHTML = formatCurrency(0);
      totalPaidResult.innerHTML = formatCurrency(0);
      extraScenarioPanel.style.display = 'none';
      payoffNote.style.display = 'none';
      return;
    }

    let res;
    if (method === "interestOnly") {
      res = computeInterestOnly(principalNet, apr, months, extraMonthly);
    } else {
      res = computeAmortized(principalNet, apr, months, extraMonthly);
    }

    monthlyPaymentResult.innerHTML = formatCurrencyDecimal(res.monthlyPayment);
    totalInterestResult.innerHTML = formatCurrency(res.totalInterest);
    totalPaidResult.innerHTML = formatCurrency(res.totalPaid);

    if (res.paidOffEarly) {
      payoffNote.textContent = `Paid off early in ${res.payoffMonths} months (term was ${months} months).`;
      payoffNote.style.display = 'block';
      
      extraScenarioPanel.style.display = 'block';
      newTermResult.textContent = `${res.payoffMonths} months (${(res.payoffMonths / 12).toFixed(1)} years)`;
      
      // Calculate baseline interest without extra for savings display
      const baseline = (method === "interestOnly") 
        ? computeInterestOnly(principalNet, apr, months, 0)
        : computeAmortized(principalNet, apr, months, 0);
      
      interestSavedResult.innerHTML = formatCurrency(Math.max(0, baseline.totalInterest - res.totalInterest));
    } else {
      payoffNote.style.display = 'none';
      extraScenarioPanel.style.display = 'none';
    }
  }

  calculateBtn.addEventListener('click', update);
  repaymentTypeInput.addEventListener('change', update);
  
  // Listen for global currency changes
  window.addEventListener('currencyChange', update);

  // Initial update
  update();
});
