import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const assetList = document.getElementById('asset-list');
  const liabilityList = document.getElementById('liability-list');
  const assetTotalDisplay = document.getElementById('asset-total-display');
  const liabilityTotalDisplay = document.getElementById('liability-total-display');
  
  const resNetWorth = document.getElementById('res-net-worth');
  const summaryAssets = document.getElementById('summary-assets');
  const summaryLiabilities = document.getElementById('summary-liabilities');
  const interpretation = document.getElementById('interpretation');

  const addBtns = document.querySelectorAll('.add-btn');

  function createItemRow(name = '', value = 0, type = 'asset') {
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
      <div class="input-wrapper">
        <input type="text" class="item-name" placeholder="${type === 'asset' ? 'e.g. Savings' : 'e.g. Car Loan'}" value="${name}">
      </div>
      <div class="input-wrapper has-prefix">
        <span class="prefix currency-symbol">$</span>
        <input type="number" class="item-value" value="${value}" step="100">
      </div>
      <button class="remove-btn" title="Remove">&times;</button>
    `;

    row.querySelector('.remove-btn').addEventListener('click', () => {
      row.remove();
      calculate();
    });

    row.querySelector('.item-value').addEventListener('input', calculate);
    row.querySelector('.item-name').addEventListener('input', calculate);

    return row;
  }

  function addItem(type) {
    const list = type === 'asset' ? assetList : liabilityList;
    list.appendChild(createItemRow('', 0, type));
    calculate();
  }

  function calculate() {
    let totalAssets = 0;
    let totalLiabilities = 0;

    assetList.querySelectorAll('.item-row').forEach(row => {
      totalAssets += parseFloat(row.querySelector('.item-value').value) || 0;
    });

    liabilityList.querySelectorAll('.item-row').forEach(row => {
      totalLiabilities += parseFloat(row.querySelector('.item-value').value) || 0;
    });

    const netWorth = totalAssets - totalLiabilities;

    // Update UI
    assetTotalDisplay.innerHTML = formatCurrencyDecimal(totalAssets);
    liabilityTotalDisplay.innerHTML = formatCurrencyDecimal(totalLiabilities);
    
    resNetWorth.innerHTML = formatCurrencyDecimal(netWorth);
    resNetWorth.style.color = netWorth >= 0 ? 'var(--primary)' : '#e11d48';
    
    summaryAssets.innerHTML = formatCurrencyDecimal(totalAssets);
    summaryLiabilities.innerHTML = formatCurrencyDecimal(totalLiabilities);

    // Interpretation logic
    if (totalAssets === 0 && totalLiabilities === 0) {
      interpretation.innerHTML = "Enter your assets and liabilities to see your financial health summary.";
    } else if (netWorth > 0) {
      interpretation.innerHTML = "<strong>Positive Net Worth:</strong> You own more than you owe. This is a strong foundation for building wealth.";
    } else if (netWorth < 0) {
      interpretation.innerHTML = "<strong>Negative Net Worth:</strong> Your debts exceed your assets. Focus on paying down high-interest debt and building emergency savings.";
    } else {
      interpretation.innerHTML = "Your assets and liabilities are equal. Aim to increase assets or reduce debt to move into positive territory.";
    }
  }

  addBtns.forEach(btn => {
    btn.addEventListener('click', () => addItem(btn.dataset.type));
  });

  // Initial items
  assetList.appendChild(createItemRow('Savings Account', 5000, 'asset'));
  assetList.appendChild(createItemRow('Investments', 15000, 'asset'));
  liabilityList.appendChild(createItemRow('Credit Card Debt', 2000, 'liability'));

  // Wiring currency change
  window.addEventListener('currencyChange', () => {
    calculate();
  });

  calculate();
});
