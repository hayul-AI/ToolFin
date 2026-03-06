import { formatCurrencyDecimal } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const inputs = [
    'initial-investment',
    'monthly-contribution',
    'years-to-invest',
    'expected-return',
    'expense-ratio'
  ];

  const elements = {};
  inputs.forEach(id => {
    elements[id] = document.getElementById(id);
  });

  const results = {
    totalFees: document.getElementById('total-fees-result'),
    percentageLost: document.getElementById('percentage-lost-note'),
    balanceWithFees: document.getElementById('balance-with-fees'),
    balanceNoFees: document.getElementById('balance-no-fees'),
    interpretation: document.getElementById('interpretation-text')
  };

  function calculateFutureValue(P, PMT, annualRate, years) {
    const r = annualRate / 100 / 12;
    const n = years * 12;
    
    if (r === 0) return P + (PMT * n);
    
    const fvPrincipal = P * Math.pow(1 + r, n);
    const fvContributions = PMT * (Math.pow(1 + r, n) - 1) / r;
    
    return fvPrincipal + fvContributions;
  }

  function calculate() {
    const P = parseFloat(elements['initial-investment'].value) || 0;
    const PMT = parseFloat(elements['monthly-contribution'].value) || 0;
    const years = parseInt(elements['years-to-invest'].value) || 0;
    const grossReturn = parseFloat(elements['expected-return'].value) || 0;
    const fee = parseFloat(elements['expense-ratio'].value) || 0;

    const netReturn = grossReturn - fee;

    const fvNoFees = calculateFutureValue(P, PMT, grossReturn, years);
    const fvWithFees = calculateFutureValue(P, PMT, netReturn, years);
    const totalFees = fvNoFees - fvWithFees;
    const percentLost = fvNoFees > 0 ? (totalFees / fvNoFees) * 100 : 0;

    // Update results
    results.totalFees.innerHTML = formatCurrencyDecimal(totalFees);
    results.balanceWithFees.innerHTML = formatCurrencyDecimal(fvWithFees);
    results.balanceNoFees.innerHTML = formatCurrencyDecimal(fvNoFees);

    if (totalFees > 0) {
      results.percentageLost.textContent = `${percentLost.toFixed(1)}% of potential wealth lost to fees`;
      results.percentageLost.style.color = percentLost > 15 ? '#991b1b' : '#92400e';
    } else {
      results.percentageLost.textContent = '0% lost to fees';
      results.percentageLost.style.color = 'var(--text-muted)';
    }

    updateInterpretation(totalFees, percentLost, fee);
  }

  function updateInterpretation(totalFees, percentLost, fee) {
    if (totalFees <= 0) {
      results.interpretation.textContent = "Enter your investment details and expense ratio to see how fees impact your long-term growth.";
      return;
    }

    let text = `By paying a ${fee}% expense ratio, you are projected to lose ${formatCurrencyDecimal(totalFees)} in potential wealth over your investment horizon. `;
    
    if (percentLost > 20) {
      text += "This is a significant portion of your portfolio. Consider looking for lower-cost index funds or ETFs to keep more of your returns.";
    } else if (fee > 0.75) {
      text += "Your expense ratio is relatively high. Even a small reduction in annual fees can lead to a much larger nest egg in the future.";
    } else {
      text += "Your fees are in a moderate to low range, but it's always worth checking if even lower-cost options are available for your strategy.";
    }

    results.interpretation.textContent = text;
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
