import { formatCurrencyDecimal } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const inputs = [
    'annual-salary',
    'contribution-rate',
    'employer-match',
    'annual-return',
    'years-invest'
  ];

  const elements = {};
  inputs.forEach(id => {
    elements[id] = document.getElementById(id);
  });

  const results = {
    futureBalance: document.getElementById('future-balance-result'),
    employeeContrib: document.getElementById('annual-employee-contrib'),
    employerContrib: document.getElementById('annual-employer-contrib'),
    totalContrib: document.getElementById('total-annual-contrib'),
    interpretation: document.getElementById('interpretation-text'),
    growthTableBody: document.getElementById('growth-table-body')
  };

  function calculateFutureValue(annualContrib, rate, years) {
    if (rate === 0) return annualContrib * years;
    const r = rate / 100;
    return annualContrib * (Math.pow(1 + r, years) - 1) / r;
  }

  function calculate() {
    const salary = parseFloat(elements['annual-salary'].value) || 0;
    const contribRate = parseFloat(elements['contribution-rate'].value) || 0;
    const matchRate = parseFloat(elements['employer-match'].value) || 0;
    const annualReturn = parseFloat(elements['annual-return'].value) || 0;
    const years = parseInt(elements['years-invest'].value) || 1;

    const employeeAnnual = salary * (contribRate / 100);
    const employerAnnual = salary * (matchRate / 100);
    const totalAnnual = employeeAnnual + employerAnnual;

    const futureValue = calculateFutureValue(totalAnnual, annualReturn, years);

    // Update results
    results.futureBalance.innerHTML = formatCurrencyDecimal(futureValue);
    results.employeeContrib.innerHTML = formatCurrencyDecimal(employeeAnnual);
    results.employerContrib.innerHTML = formatCurrencyDecimal(employerAnnual);
    results.totalContrib.innerHTML = formatCurrencyDecimal(totalAnnual);

    updateInterpretation(contribRate, matchRate, years);
    updateGrowthTable(totalAnnual, annualReturn, years);
  }

  function updateInterpretation(contrib, match, years) {
    let text = `By contributing ${contrib}% of your salary and receiving a ${match}% employer match over ${years} years, you are building a significant retirement fund. `;
    
    if (contrib < 5) {
      text += "Increasing your contribution rate by even 1% could dramatically boost your final balance. ";
    }
    
    if (years < 20) {
      text += "A longer time horizon will have the biggest impact on your total savings due to the power of compounding.";
    } else {
      text += "Your long-term commitment allows compound interest to do most of the heavy lifting for your wealth creation.";
    }

    results.interpretation.textContent = text;
  }

  function updateGrowthTable(annualContrib, rate, maxYears) {
    const checkYears = [5, 10, 20, 30, 40, 50].filter(y => y <= Math.max(maxYears, 30));
    // Ensure the specific target year is in the list
    if (!checkYears.includes(maxYears)) {
        checkYears.push(maxYears);
    }
    checkYears.sort((a, b) => a - b);

    let html = '';
    checkYears.forEach(y => {
      const fv = calculateFutureValue(annualContrib, rate, y);
      html += `
        <tr style="border-bottom: 1px solid var(--border);">
          <td style="padding: 1rem 0.5rem; font-weight: 600;">Year ${y}</td>
          <td style="padding: 1rem 0.5rem;">${formatCurrencyDecimal(fv)}</td>
        </tr>
      `;
    });

    results.growthTableBody.innerHTML = html;
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
