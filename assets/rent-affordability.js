import { formatCurrencyDecimal } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const inputs = [
    'monthly-gross-income',
    'toggle-net-income',
    'monthly-net-income',
    'monthly-debts',
    'rent-ratio',
    'toggle-utilities',
    'monthly-utilities'
  ];

  const elements = {};
  inputs.forEach(id => {
    elements[id] = document.getElementById(id);
  });

  const results = {
    maxRent: document.getElementById('max-rent-result'),
    rentRange: document.getElementById('rent-range-label'),
    debtDisplay: document.getElementById('debt-display'),
    remainingBudget: document.getElementById('remaining-budget'),
    interpretation: document.getElementById('interpretation-text'),
    netIncomeGroup: document.getElementById('net-income-group'),
    utilitiesGroup: document.getElementById('utilities-group')
  };

  function calculate() {
    const grossIncome = parseFloat(elements['monthly-gross-income'].value) || 0;
    const useNetIncome = elements['toggle-net-income'].checked;
    const netIncome = parseFloat(elements['monthly-net-income'].value) || 0;
    const debts = parseFloat(elements['monthly-debts'].value) || 0;
    const ratio = parseFloat(elements['rent-ratio'].value) || 30;
    const useUtilities = elements['toggle-utilities'].checked;
    const utilities = useUtilities ? (parseFloat(elements['monthly-utilities'].value) || 0) : 0;

    // Toggle visibility
    results.netIncomeGroup.style.display = useNetIncome ? 'block' : 'none';
    results.utilitiesGroup.style.display = useUtilities ? 'block' : 'none';

    const incomeUsed = (useNetIncome && netIncome > 0) ? netIncome : grossIncome;

    // Calculation logic
    const maxRentBeforeDebts = incomeUsed * (ratio / 100);
    let maxRentAfterDebts = maxRentBeforeDebts - debts - utilities;
    maxRentAfterDebts = Math.max(0, maxRentAfterDebts);

    const rangeLow = Math.max(0, (incomeUsed * 0.25) - debts - utilities);
    const rangeHigh = Math.max(0, (incomeUsed * 0.35) - debts - utilities);

    const totalObligations = maxRentAfterDebts + debts + utilities;
    const remaining = Math.max(0, incomeUsed - totalObligations);

    // Update UI
    results.maxRent.innerHTML = formatCurrencyDecimal(maxRentAfterDebts);
    results.rentRange.textContent = `Suggested Range: ${formatCurrencyDecimal(rangeLow)} – ${formatCurrencyDecimal(rangeHigh)}`;
    results.debtDisplay.innerHTML = formatCurrencyDecimal(debts + utilities);
    results.remainingBudget.innerHTML = formatCurrencyDecimal(remaining);

    updateInterpretation(ratio, useNetIncome);
  }

  function updateInterpretation(ratio, isNet) {
    let text = `Based on your ${isNet ? 'net' : 'gross'} income and a ${ratio}% target ratio, this budget ensures you aren't overextending on housing. `;
    
    if (ratio > 35) {
      text += "A ratio above 35% is generally considered 'rent burdened' and may make it difficult to save for other goals.";
    } else if (ratio < 25) {
      text += "This is a very conservative budget that leaves plenty of room for savings and lifestyle expenses.";
    } else {
      text += "Staying within the 25-35% range is a balanced approach recommended by most financial experts.";
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
