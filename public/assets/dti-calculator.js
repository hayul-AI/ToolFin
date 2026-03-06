import { formatCurrencyDecimal } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const inputs = [
    'monthly-income',
    'housing-payment',
    'credit-card-payments',
    'auto-loan-payments',
    'student-loan-payments',
    'other-debt-payments'
  ];

  const elements = {};
  inputs.forEach(id => {
    elements[id] = document.getElementById(id);
  });

  const results = {
    dtiRatio: document.getElementById('dti-ratio-result'),
    riskBand: document.getElementById('risk-band-label'),
    totalDebt: document.getElementById('total-monthly-debt'),
    remainingIncome: document.getElementById('income-remaining'),
    interpretation: document.getElementById('result-interpretation')
  };

  function calculate() {
    const income = parseFloat(elements['monthly-income'].value) || 0;
    const housing = parseFloat(elements['housing-payment'].value) || 0;
    const creditCards = parseFloat(elements['credit-card-payments'].value) || 0;
    const autoLoans = parseFloat(elements['auto-loan-payments'].value) || 0;
    const studentLoans = parseFloat(elements['student-loan-payments'].value) || 0;
    const otherDebts = parseFloat(elements['other-debt-payments'].value) || 0;

    const totalDebt = housing + creditCards + autoLoans + studentLoans + otherDebts;
    const remainingIncome = Math.max(0, income - totalDebt);

    let dti = 0;
    if (income > 0) {
      dti = (totalDebt / income) * 100;
    }

    // Update results
    results.dtiRatio.textContent = dti.toFixed(1) + '%';
    results.totalDebt.innerHTML = formatCurrencyDecimal(totalDebt);
    results.remainingIncome.innerHTML = formatCurrencyDecimal(remainingIncome);

    updateRiskBand(dti, income);
  }

  function updateRiskBand(dti, income) {
    if (income <= 0) {
      results.riskBand.textContent = 'N/A';
      results.riskBand.style.color = 'var(--text-muted)';
      results.interpretation.textContent = 'Please enter a monthly income greater than zero to calculate your DTI ratio.';
      return;
    }

    let label = '';
    let color = '';
    let text = '';

    if (dti < 20) {
      label = 'Excellent (low risk)';
      color = '#166534'; // Green
      text = 'Your debt-to-income ratio is excellent. You have a significant amount of "breathing room" in your budget, and you are likely to qualify for the most competitive interest rates from lenders.';
    } else if (dti < 36) {
      label = 'Good';
      color = '#15803d'; // Slightly lighter green
      text = 'Your debt level is considered healthy and manageable by most financial standards. You should have little trouble qualifying for most types of credit, provided your credit score is also strong.';
    } else if (dti <= 43) {
      label = 'Caution';
      color = '#92400e'; // Amber/Orange
      text = 'You are approaching the limit of what many lenders (especially mortgage lenders) consider acceptable. While you may still qualify for loans, you have less flexibility in your monthly budget for unexpected expenses.';
    } else {
      label = 'High risk (approval may be difficult)';
      color = '#991b1b'; // Red
      text = 'Your debt obligations consume a large portion of your income. Lenders may view you as a high-risk borrower, making it difficult to qualify for new loans. Focus on reducing your balances or increasing your income to improve this ratio.';
    }

    results.riskBand.textContent = label;
    results.riskBand.style.color = color;
    results.interpretation.textContent = text;
  }

  // Add event listeners to all inputs
  inputs.forEach(id => {
    elements[id].addEventListener('input', calculate);
  });

  // Listen for currency changes to refresh formatting
  window.addEventListener('currencyChange', calculate);

  // Initial calculation
  calculate();
});
