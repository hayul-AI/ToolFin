import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const amountInput = document.getElementById('investment-amount');
  const countInput = document.getElementById('interval-count');
  const priceInput = document.getElementById('avg-price');
  const volatilityInput = document.getElementById('price-volatility');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resAvgCost = document.getElementById('res-avg-cost');
  const resTotalInvested = document.getElementById('res-total-invested');
  const resTotalShares = document.getElementById('res-total-shares');
  const resMarketValue = document.getElementById('res-market-value');

  function calculate() {
    const amountPerInterval = parseFloat(amountInput.value) || 0;
    const intervals = parseInt(countInput.value) || 0;
    const startPrice = parseFloat(priceInput.value) || 0;
    const volatility = (parseFloat(volatilityInput.value) || 0) / 100;

    if (intervals <= 0 || startPrice <= 0) return;

    let totalInvested = 0;
    let totalShares = 0;
    let currentPrice = startPrice;

    for (let i = 0; i < intervals; i++) {
      // Simulate random price movement within volatility range
      // Range: [currentPrice * (1 - volatility), currentPrice * (1 + volatility)]
      // For a more realistic "random walk", we adjust from the current price
      const change = (Math.random() * 2 - 1) * volatility;
      currentPrice = currentPrice * (1 + change);
      if (currentPrice < 0.01) currentPrice = 0.01;

      const sharesBought = amountPerInterval / currentPrice;
      totalShares += sharesBought;
      totalInvested += amountPerInterval;
    }

    const avgCost = totalInvested / totalShares;
    const marketValue = totalShares * currentPrice;

    // Update UI
    resAvgCost.innerHTML = formatCurrencyDecimal(avgCost);
    resTotalInvested.innerHTML = formatCurrencyDecimal(totalInvested);
    resTotalShares.textContent = totalShares.toFixed(4);
    resMarketValue.innerHTML = formatCurrencyDecimal(marketValue);
    
    // Style market value
    resMarketValue.style.color = marketValue >= totalInvested ? '#10b981' : '#e11d48';
  }

  calculateBtn.addEventListener('click', calculate);

  // Auto-calculate on input changes
  [amountInput, countInput, priceInput, volatilityInput].forEach(el => {
    el.addEventListener('input', calculate);
  });

  // Wiring currency change
  window.addEventListener('currencyChange', () => {
    calculate();
  });

  // Initial
  calculate();
});
