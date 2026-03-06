import { formatCurrencyDecimal } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const inputs = [
    'annual-income',
    'monthly-debts',
    'dti-limit',
    'apr',
    'loan-term',
    'include-tax-ins',
    'monthly-tax-ins'
  ];

  const elements = {};
  inputs.forEach(id => {
    elements[id] = document.getElementById(id);
  });

  const results = {
    affordableLoan: document.getElementById('affordable-loan-result'),
    monthlyPayment: document.getElementById('monthly-payment-used'),
    maxDebtAllowed: document.getElementById('max-debt-allowed'),
    remainingCapacity: document.getElementById('remaining-capacity'),
    interpretation: document.getElementById('interpretation-note')
  };

  const taxInsGroup = document.getElementById('tax-ins-group');

  function calculate() {
    const annualIncome = parseFloat(elements['annual-income'].value) || 0;
    const monthlyDebts = parseFloat(elements['monthly-debts'].value) || 0;
    const dtiLimit = parseFloat(elements['dti-limit'].value) || 36;
    const apr = parseFloat(elements['apr'].value) || 0;
    const termYears = parseInt(elements['loan-term'].value) || 15;
    const includeTaxIns = elements['include-tax-ins'].checked;
    const monthlyTaxIns = includeTaxIns ? (parseFloat(elements['monthly-tax-ins'].value) || 0) : 0;

    // Toggle tax/ins field visibility
    taxInsGroup.style.display = includeTaxIns ? 'block' : 'none';

    // 1) monthlyIncome = annualIncome / 12
    const monthlyIncome = annualIncome / 12;

    // 2) maxTotalDebtPayment = monthlyIncome * (targetDTI / 100)
    const maxTotalDebtPayment = monthlyIncome * (dtiLimit / 100);

    // 3) allowedMonthlyPaymentForNewLoan = maxTotalDebtPayment - existingMonthlyDebts - (taxInsuranceIfEnabled)
    let allowedMonthlyPaymentForNewLoan = maxTotalDebtPayment - monthlyDebts - monthlyTaxIns;
    allowedMonthlyPaymentForNewLoan = Math.max(0, allowedMonthlyPaymentForNewLoan);

    // 4) Convert payment to principal using amortized loan formula
    // P = PMT * (1 - (1+r)^(-n)) / r
    const r = (apr / 100) / 12;
    const n = termYears * 12;
    
    let affordablePrincipal = 0;
    if (allowedMonthlyPaymentForNewLoan > 0) {
      if (r === 0) {
        affordablePrincipal = allowedMonthlyPaymentForNewLoan * n;
      } else {
        affordablePrincipal = allowedMonthlyPaymentForNewLoan * (1 - Math.pow(1 + r, -n)) / r;
      }
    }

    // Update results
    results.affordableLoan.innerHTML = formatCurrencyDecimal(affordablePrincipal);
    results.monthlyPayment.innerHTML = formatCurrencyDecimal(allowedMonthlyPaymentForNewLoan);
    results.maxDebtAllowed.innerHTML = formatCurrencyDecimal(maxTotalDebtPayment);
    results.remainingCapacity.innerHTML = formatCurrencyDecimal(allowedMonthlyMonthlyCapacity(maxTotalDebtPayment, monthlyDebts, monthlyTaxIns));

    updateInterpretation(allowedMonthlyPaymentForNewLoan, apr, termYears);
  }

  function allowedMonthlyMonthlyCapacity(max, debts, taxIns) {
      return Math.max(0, max - debts - taxIns);
  }

  function updateInterpretation(payment, apr, term) {
    if (payment <= 0) {
      results.interpretation.innerHTML = '<strong>Note:</strong> Your current monthly debts (and taxes/insurance) already exceed your target DTI limit. To increase your loan affordability, consider lowering your target DTI, reducing existing debts, or increasing your income.';
      results.interpretation.style.color = '#991b1b';
      return;
    }

    results.interpretation.style.color = 'inherit';
    let text = `Based on a ${term}-year term at ${apr}% APR, you can support a loan of this size with a monthly payment of ${formatCurrencyDecimal(payment)}. `;
    
    text += "Keep in mind that lowering your interest rate or extending the loan term will increase your estimated affordable amount, but a longer term will also increase the total interest you pay over time.";

    results.interpretation.innerHTML = text;
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
