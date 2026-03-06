import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const inputs = {
    loanBalance: document.getElementById('loan-balance'),
    interestRate: document.getElementById('interest-rate'),
    remainingTerm: document.getElementById('remaining-term'),
    extraMonthly: document.getElementById('extra-monthly'),
    extraYearly: document.getElementById('extra-yearly')
  };

  const results = {
    interestSaved: document.getElementById('res-interest-saved'),
    timeSaved: document.getElementById('res-time-saved'),
    originalInterest: document.getElementById('res-original-interest'),
    newInterest: document.getElementById('res-new-interest'),
    payoffDate: document.getElementById('res-payoff-date')
  };

  const calculateBtn = document.getElementById('calculate-btn');

  function calculate() {
    const balance = parseFloat(inputs.loanBalance.value) || 0;
    const annualRate = parseFloat(inputs.interestRate.value) || 0;
    const termYears = parseFloat(inputs.remainingTerm.value) || 0;
    const extraMonthly = parseFloat(inputs.extraMonthly.value) || 0;
    const extraYearly = parseFloat(inputs.extraYearly.value) || 0;

    const monthlyRate = (annualRate / 100) / 12;
    const totalMonths = termYears * 12;

    if (balance <= 0 || totalMonths <= 0) return;

    // 1. Calculate Standard Monthly Payment (P&I) to maintain original term
    let standardPayment = 0;
    if (monthlyRate > 0) {
      standardPayment = (balance * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      standardPayment = balance / totalMonths;
    }

    // 2. Scenario A: Original Path
    let originalTotalInterest = 0;
    let tempBalanceA = balance;
    for (let m = 0; i < totalMonths; m++) {
        // Simple approx for original total interest
    }
    // Better way: (Payment * months) - principal
    originalTotalInterest = (standardPayment * totalMonths) - balance;

    // 3. Scenario B: Extra Payment Path (Amortization Schedule Simulation)
    let newTotalInterest = 0;
    let tempBalanceB = balance;
    let monthsToPayoff = 0;

    for (let m = 1; m <= 600; m++) { // Cap at 50 years to prevent infinite loop
      if (tempBalanceB <= 0) break;
      
      monthsToPayoff++;
      const interestCharge = tempBalanceB * monthlyRate;
      newTotalInterest += interestCharge;
      
      let totalApplied = standardPayment + extraMonthly;
      if (m % 12 === 0) totalApplied += extraYearly;

      const principalApplied = totalApplied - interestCharge;
      tempBalanceB -= principalApplied;
      
      if (tempBalanceB < 0) tempBalanceB = 0;
    }

    const interestSaved = originalTotalInterest - newInterest;
    const monthDiff = totalMonths - monthsToPayoff;
    const yearsSaved = Math.floor(monthDiff / 12);
    const extraMonthsSaved = monthDiff % 12;

    // 4. Payoff Date Estimation
    const today = new Date();
    const payoffDate = new Date(today.setMonth(today.getMonth() + monthsToPayoff));
    const dateStr = payoffDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    // UI Update
    results.interestSaved.innerHTML = formatCurrency(Math.max(0, originalTotalInterest - newTotalInterest));
    results.originalInterest.innerHTML = formatCurrency(originalTotalInterest);
    results.newInterest.innerHTML = formatCurrency(newTotalInterest);
    
    let timeStr = "";
    if (yearsSaved > 0) timeStr += `${yearsSaved} Year${yearsSaved > 1 ? 's' : ''}`;
    if (extraMonthsSaved > 0) timeStr += ` ${extraMonthsSaved} Month${extraMonthsSaved > 1 ? 's' : ''}`;
    results.timeSaved.innerHTML = timeStr || "0 Months";
    
    results.payoffDate.innerHTML = dateStr;
  }

  // Refined calculate to handle the loop index i vs m
  function calculateAmort() {
    const balance = parseFloat(inputs.loanBalance.value) || 0;
    const annualRate = parseFloat(inputs.interestRate.value) || 0;
    const termYears = parseFloat(inputs.remainingTerm.value) || 0;
    const extraMonthly = parseFloat(inputs.extraMonthly.value) || 0;
    const extraYearly = parseFloat(inputs.extraYearly.value) || 0;

    const monthlyRate = (annualRate / 100) / 12;
    const totalMonths = termYears * 12;

    if (balance <= 0 || totalMonths <= 0) return;

    let standardPayment = 0;
    if (monthlyRate > 0) {
      standardPayment = (balance * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      standardPayment = balance / totalMonths;
    }

    const originalTotalInterest = (standardPayment * totalMonths) - balance;

    let newTotalInterest = 0;
    let tempBalance = balance;
    let monthsToPayoff = 0;

    for (let m = 1; m <= 600; m++) { 
      if (tempBalance <= 0) break;
      
      monthsToPayoff++;
      const interestCharge = tempBalance * monthlyRate;
      newTotalInterest += interestCharge;
      
      let totalApplied = standardPayment + extraMonthly;
      if (m % 12 === 0) totalApplied += extraYearly;

      const principalApplied = totalApplied - interestCharge;
      tempBalance -= principalApplied;
    }

    const monthDiff = Math.max(0, totalMonths - monthsToPayoff);
    const yearsSaved = Math.floor(monthDiff / 12);
    const extraMonthsSaved = monthDiff % 12;

    const today = new Date();
    today.setMonth(today.getMonth() + monthsToPayoff);
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    // UI Update
    results.interestSaved.innerHTML = formatCurrency(Math.max(0, originalTotalInterest - newTotalInterest));
    results.originalInterest.innerHTML = formatCurrency(originalTotalInterest);
    results.newInterest.innerHTML = formatCurrency(newTotalInterest);
    
    let timeStr = "";
    if (yearsSaved > 0) timeStr += `${yearsSaved} Year${yearsSaved > 1 ? 's' : ''}`;
    if (extraMonthsSaved > 0) {
        if (yearsSaved > 0) timeStr += " ";
        timeStr += `${extraMonthsSaved} Month${extraMonthsSaved > 1 ? 's' : ''}`;
    }
    results.timeSaved.innerHTML = timeStr || "0 Months";
    results.payoffDate.innerHTML = dateStr;
  }

  Object.values(inputs).forEach(input => input.addEventListener('input', calculateAmort));
  calculateBtn.addEventListener('click', calculateAmort);
  window.addEventListener('currencyChange', calculateAmort);

  calculateAmort();
});
