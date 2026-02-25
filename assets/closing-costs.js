import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const inputs = {
    homePrice: document.getElementById('home-price'),
    loanAmount: document.getElementById('loan-amount'),
    originationFee: document.getElementById('origination-fee'),
    appraisalFee: document.getElementById('appraisal-fee'),
    titleFee: document.getElementById('title-fee'),
    transferTax: document.getElementById('transfer-tax'),
    inspectionFee: document.getElementById('inspection-fee')
  };

  const results = {
    totalCosts: document.getElementById('res-total-costs'),
    percentPrice: document.getElementById('res-percent-price'),
    lenderFees: document.getElementById('res-lender-fees'),
    thirdPartyFees: document.getElementById('res-third-party'),
    govFees: document.getElementById('res-gov-fees'),
    cashToClose: document.getElementById('res-cash-to-close')
  };

  const calculateBtn = document.getElementById('calculate-btn');

  function calculate() {
    const price = parseFloat(inputs.homePrice.value) || 0;
    const loan = parseFloat(inputs.loanAmount.value) || 0;
    const origPercent = parseFloat(inputs.originationFee.value) || 0;
    const appraisal = parseFloat(inputs.appraisalFee.value) || 0;
    const title = parseFloat(inputs.titleFee.value) || 0;
    const transfer = parseFloat(inputs.transferTax.value) || 0;
    const inspection = parseFloat(inputs.inspectionFee.value) || 0;

    // Categories
    const lender = loan * (origPercent / 100);
    const thirdParty = appraisal + title + inspection;
    const gov = transfer;

    const total = lender + thirdParty + gov;
    const percent = price > 0 ? (total / price) * 100 : 0;
    
    // Cash to close: Down Payment + Closing Costs
    // Down Payment = price - loan
    const downPayment = Math.max(0, price - loan);
    const cashToClose = downPayment + total;

    // Update UI
    results.totalCosts.innerHTML = formatCurrencyDecimal(total);
    results.percentPrice.innerHTML = `${percent.toFixed(2)}% of Home Price`;
    results.lenderFees.innerHTML = formatCurrency(lender);
    results.thirdPartyFees.innerHTML = formatCurrency(thirdParty);
    results.govFees.innerHTML = formatCurrency(gov);
    results.cashToClose.innerHTML = formatCurrencyDecimal(cashToClose);
  }

  // Re-calculate on input
  Object.values(inputs).forEach(input => {
    input.addEventListener('input', calculate);
  });

  calculateBtn.addEventListener('click', calculate);

  // Sync with global currency
  window.addEventListener('currencyChange', calculate);

  // Initial
  calculate();
});
