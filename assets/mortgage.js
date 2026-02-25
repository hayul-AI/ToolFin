import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const inputs = {
    homePrice: document.getElementById('home-price'),
    downPayment: document.getElementById('down-payment'),
    downPercent: document.getElementById('down-payment-percent'),
    loanTerm: document.getElementById('loan-term'),
    interestRate: document.getElementById('interest-rate'),
    propertyTax: document.getElementById('property-tax'),
    homeInsurance: document.getElementById('home-insurance'),
    pmiToggle: document.getElementById('pmi-toggle')
  };

  const results = {
    monthlyPI: document.getElementById('res-monthly-pi'),
    monthlyTotal: document.getElementById('res-monthly-total'),
    totalPrincipal: document.getElementById('res-total-principal'),
    totalInterest: document.getElementById('res-total-interest'),
    totalCost: document.getElementById('res-total-cost')
  };

  const calculateBtn = document.getElementById('calculate-btn');

  function calculate() {
    const price = parseFloat(inputs.homePrice.value) || 0;
    const downAmount = parseFloat(inputs.downPayment.value) || 0;
    const termYears = parseFloat(inputs.loanTerm.value) || 30;
    const annualRate = parseFloat(inputs.interestRate.value) || 0;
    
    const principal = price - downAmount;
    const monthlyRate = (annualRate / 100) / 12;
    const numberOfPayments = termYears * 12;

    let monthlyPI = 0;
    if (principal > 0) {
      if (monthlyRate === 0) {
        monthlyPI = principal / numberOfPayments;
      } else {
        monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      }
    }

    const annualTax = parseFloat(inputs.propertyTax.value) || 0;
    const annualIns = parseFloat(inputs.homeInsurance.value) || 0;
    
    let pmi = 0;
    if (inputs.pmiToggle.checked && (downAmount / price) < 0.2) {
      // 0.5% annual estimate for PMI
      pmi = (principal * 0.005) / 12;
    }

    const totalMonthly = monthlyPI + (annualTax / 12) + (annualIns / 12) + pmi;
    const totalPaid = (monthlyPI * numberOfPayments) + (annualTax * termYears) + (annualIns * termYears) + (pmi * numberOfPayments);
    const totalInt = (monthlyPI * numberOfPayments) - principal;

    // Update UI
    results.monthlyPI.innerHTML = formatCurrencyDecimal(monthlyPI);
    results.monthlyTotal.innerHTML = formatCurrencyDecimal(totalMonthly);
    results.totalPrincipal.innerHTML = formatCurrency(principal);
    results.totalInterest.innerHTML = formatCurrency(totalInt);
    results.totalCost.innerHTML = formatCurrency(totalPaid);
  }

  // Auto-sync down payment amount and percentage
  inputs.homePrice.addEventListener('input', () => {
    const price = parseFloat(inputs.homePrice.value) || 0;
    const percent = parseFloat(inputs.downPercent.value) || 0;
    inputs.downPayment.value = Math.round(price * (percent / 100));
    calculate();
  });

  inputs.downPayment.addEventListener('input', () => {
    const price = parseFloat(inputs.homePrice.value) || 0;
    const amount = parseFloat(inputs.downPayment.value) || 0;
    if (price > 0) {
      inputs.downPercent.value = ((amount / price) * 100).toFixed(1);
    }
    calculate();
  });

  inputs.downPercent.addEventListener('input', () => {
    const price = parseFloat(inputs.homePrice.value) || 0;
    const percent = parseFloat(inputs.downPercent.value) || 0;
    inputs.downPayment.value = Math.round(price * (percent / 100));
    calculate();
  });

  // Re-calculate on any change
  Object.values(inputs).forEach(input => {
    if (input.type === 'checkbox') {
      input.addEventListener('change', calculate);
    } else {
      input.addEventListener('input', calculate);
    }
  });

  calculateBtn.addEventListener('click', calculate);

  // Sync with global currency selector
  window.addEventListener('currencyChange', calculate);

  calculate();
});
