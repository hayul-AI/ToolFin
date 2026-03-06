import { formatCurrencyDecimal } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const inputs = [
    'loan-balance',
    'current-rate',
    'current-term',
    'new-rate',
    'new-term',
    'closing-costs',
    'toggle-cashout',
    'cash-out'
  ];

  const elements = {};
  inputs.forEach(id => {
    elements[id] = document.getElementById(id);
  });

  const results = {
    breakEvenMonths: document.getElementById('break-even-result'),
    breakEvenYears: document.getElementById('break-even-years'),
    currentPayment: document.getElementById('current-payment-display'),
    newPayment: document.getElementById('new-payment-display'),
    monthlySavings: document.getElementById('monthly-savings-display'),
    interpretation: document.getElementById('interpretation-note'),
    cashoutGroup: document.getElementById('cashout-group')
  };

  function calculatePayment(principal, annualRate, years) {
    if (years <= 0) return 0;
    const r = annualRate / 100 / 12;
    const n = years * 12;
    
    if (r === 0) return principal / n;
    
    return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  function calculate() {
    const balance = parseFloat(elements['loan-balance'].value) || 0;
    const currentRate = parseFloat(elements['current-rate'].value) || 0;
    const currentTerm = parseInt(elements['current-term'].value) || 30;
    
    const newRate = parseFloat(elements['new-rate'].value) || 0;
    const newTerm = parseInt(elements['new-term'].value) || 30;
    const closingCosts = parseFloat(elements['closing-costs'].value) || 0;
    
    const includeCashout = elements['toggle-cashout'].checked;
    const cashOutAmount = includeCashout ? (parseFloat(elements['cash-out'].value) || 0) : 0;

    results.cashoutGroup.style.display = includeCashout ? 'block' : 'none';

    // Calculate Payments
    const currentPayment = calculatePayment(balance, currentRate, currentTerm);
    const newPrincipal = balance + cashOutAmount;
    const newPayment = calculatePayment(newPrincipal, newRate, newTerm);
    
    const monthlySavings = currentPayment - newPayment;

    // Update result displays
    results.currentPayment.innerHTML = formatCurrencyDecimal(currentPayment);
    results.newPayment.innerHTML = formatCurrencyDecimal(newPayment);
    
    if (monthlySavings > 0) {
      results.monthlySavings.style.color = '#166534'; // Green
      results.monthlySavings.innerHTML = formatCurrencyDecimal(monthlySavings);
      
      const breakEvenMonths = closingCosts / monthlySavings;
      const breakEvenYears = breakEvenMonths / 12;
      
      results.breakEvenMonths.textContent = `${breakEvenMonths.toFixed(1)} Months`;
      results.breakEvenYears.textContent = `(${breakEvenYears.toFixed(1)} Years)`;
      results.breakEvenMonths.style.color = 'var(--text-main)';
    } else {
      results.monthlySavings.style.color = monthlySavings < 0 ? '#e11d48' : 'var(--text-main)';
      results.monthlySavings.innerHTML = formatCurrencyDecimal(monthlySavings);
      
      results.breakEvenMonths.textContent = 'No Break-Even';
      results.breakEvenMonths.style.color = '#e11d48'; // Red
      results.breakEvenYears.textContent = '(Savings do not cover costs)';
    }

    updateInterpretation(monthlySavings);
  }

  function updateInterpretation(savings) {
    if (savings <= 0) {
      results.interpretation.innerHTML = '<strong>Note:</strong> Your new monthly payment is higher than or equal to your current payment. Refinancing may only make sense if you are significantly shortening your loan term or consolidating high-interest debt.';
      results.interpretation.style.color = '#991b1b';
    } else {
      results.interpretation.innerHTML = 'If you plan to move or sell your home before your break-even point, refinancing may not pay off as the closing costs will exceed your total savings.';
      results.interpretation.style.color = 'inherit';
    }
  }

  // Add event listeners
  inputs.forEach(id => {
    elements[id].addEventListener('input', calculate);
  });

  // Listen for currency changes
  window.addEventListener('currencyChange', calculate);

  // Initial calculation
  calculate();
});
