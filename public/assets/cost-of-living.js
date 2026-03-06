import { formatCurrencyDecimal } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const inputs = [
    'current-salary',
    'current-index',
    'new-index',
    'housing-portion'
  ];

  const elements = {};
  inputs.forEach(id => {
    elements[id] = document.getElementById(id);
  });

  const results = {
    equivalentSalary: document.getElementById('equivalent-salary-result'),
    salaryDifference: document.getElementById('salary-difference'),
    purchasingPower: document.getElementById('purchasing-power-change'),
    interpretation: document.getElementById('interpretation-text')
  };

  function calculate() {
    const currentSalary = parseFloat(elements['current-salary'].value) || 0;
    const currentIndex = parseFloat(elements['current-index'].value) || 100;
    const newIndex = parseFloat(elements['new-index'].value) || 100;
    const housingPortion = parseFloat(elements['housing-portion'].value) || 35;

    // equivalentSalary = currentSalary * (newCostIndex / currentCostIndex)
    const equivalentSalary = currentSalary * (newIndex / currentIndex);

    // salaryDifference = equivalentSalary - currentSalary
    const salaryDifference = equivalentSalary - currentSalary;

    // purchasingPowerChange = ((currentSalary / equivalentSalary) - 1) * 100
    // Actually, a more intuitive purchasing power change:
    // If equivalent is 125 and current is 100, you need 25% more money.
    // Purchasing power of your CURRENT salary in the NEW location is:
    // (currentSalary / equivalentSalary)
    const purchasingPowerChange = ((currentSalary / equivalentSalary) - 1) * 100;

    // Update results
    results.equivalentSalary.innerHTML = formatCurrencyDecimal(equivalentSalary);
    
    let diffColor = salaryDifference > 0 ? '#e11d48' : '#166534';
    results.salaryDifference.style.color = diffColor;
    results.salaryDifference.innerHTML = (salaryDifference > 0 ? '+' : '') + formatCurrencyDecimal(salaryDifference);

    results.purchasingPower.textContent = purchasingPowerChange.toFixed(1) + '%';
    results.purchasingPower.style.color = purchasingPowerChange < 0 ? '#e11d48' : '#166534';

    updateInterpretation(equivalentSalary, currentSalary, newIndex, currentIndex);
  }

  function updateInterpretation(equivalent, current, newIdx, currentIdx) {
    let text = '';
    if (equivalent > current) {
      text = `You would need a salary of ${formatCurrencyDecimal(equivalent)} in the new location to maintain your current lifestyle. This is because the new location is estimated to be ${( ((newIdx/currentIdx)-1)*100 ).toFixed(1)}% more expensive overall.`;
    } else if (equivalent < current) {
      text = `Your purchasing power increases in the new location. You only need ${formatCurrencyDecimal(equivalent)} to maintain the same lifestyle, effectively giving you a boost in disposable income if you maintain your current salary.`;
    } else {
      text = "The cost of living index is the same in both locations. Your purchasing power remains unchanged.";
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
