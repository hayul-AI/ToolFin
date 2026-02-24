import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const homePriceInput = document.getElementById('home-price');
  const downPaymentInput = document.getElementById('down-payment');
  const downPaymentPercentInput = document.getElementById('down-payment-percent');
  const loanTermInput = document.getElementById('loan-term');
  const interestRateInput = document.getElementById('interest-rate');
  const propertyTaxInput = document.getElementById('property-tax');
  const homeInsuranceInput = document.getElementById('home-insurance');
  const pmiToggle = document.getElementById('pmi-toggle');
  const calculateBtn = document.getElementById('calculate-btn');

  // Result Elements
  const monthlyPI = document.getElementById('monthly-pi');
  const monthlyTotal = document.getElementById('monthly-total');
  const totalPrincipal = document.getElementById('total-principal');
  const totalInterest = document.getElementById('total-interest');
  const totalPaid = document.getElementById('total-paid');

  function calculate() {
    const price = parseFloat(homePriceInput.value) || 0;
    const downPayment = parseFloat(downPaymentInput.value) || 0;
    const termYears = parseFloat(loanTermInput.value) || 0;
    const annualRate = parseFloat(interestRateInput.value) || 0;
    
    const principal = price - downPayment;
    const monthlyRate = (annualRate / 100) / 12;
    const numberOfPayments = termYears * 12;

    let monthlyPayment = 0;
    if (monthlyRate === 0) {
      monthlyPayment = principal / numberOfPayments;
    } else {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    const totalCost = monthlyPayment * numberOfPayments;
    const totalInt = totalCost - principal;

    // Advanced additions
    const annualTax = parseFloat(propertyTaxInput.value) || 0;
    const annualInsurance = parseFloat(homeInsuranceInput.value) || 0;
    let monthlyPMI = 0;
    if (pmiToggle.checked && (downPayment / price) < 0.2) {
      // Simple PMI estimate: 0.5% of loan amount annually
      monthlyPMI = (principal * 0.005) / 12;
    }

    const totalMonthly = monthlyPayment + (annualTax / 12) + (annualInsurance / 12) + monthlyPMI;

    // Update UI
    monthlyPI.textContent = formatCurrencyDecimal(monthlyPayment);
    monthlyTotal.textContent = formatCurrencyDecimal(totalMonthly);
    totalPrincipal.textContent = formatCurrency(principal);
    totalInterest.textContent = formatCurrency(totalInt);
    totalPaid.textContent = formatCurrency(totalCost + (annualTax * termYears) + (annualInsurance * termYears) + (monthlyPMI * numberOfPayments));
  }

  // Event Listeners for auto-syncing down payment
  homePriceInput.addEventListener('input', () => {
    const price = parseFloat(homePriceInput.value) || 0;
    const percent = parseFloat(downPaymentPercentInput.value) || 0;
    downPaymentInput.value = (price * (percent / 100)).toFixed(0);
    calculate();
  });

  downPaymentInput.addEventListener('input', () => {
    const price = parseFloat(homePriceInput.value) || 0;
    const amount = parseFloat(downPaymentInput.value) || 0;
    if (price > 0) {
      downPaymentPercentInput.value = ((amount / price) * 100).toFixed(1);
    }
    calculate();
  });

  downPaymentPercentInput.addEventListener('input', () => {
    const price = parseFloat(homePriceInput.value) || 0;
    const percent = parseFloat(downPaymentPercentInput.value) || 0;
    downPaymentInput.value = (price * (percent / 100)).toFixed(0);
    calculate();
  });

  [loanTermInput, interestRateInput, propertyTaxInput, homeInsuranceInput, pmiToggle].forEach(el => {
    el.addEventListener('input', calculate);
  });

  calculateBtn.addEventListener('click', calculate);

  // Initial Calculation
  calculate();

  // Listen for global currency changes
  window.addEventListener('currencyChange', calculate);
});
