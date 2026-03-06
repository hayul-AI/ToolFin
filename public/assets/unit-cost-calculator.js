import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const descriptionInput = document.getElementById('item-description');
  const unitCostInput = document.getElementById('unit-cost');
  const quantityInput = document.getElementById('quantity');
  const totalCostInput = document.getElementById('total-cost');
  const wholeUnitsToggle = document.getElementById('whole-units');
  const copyBtn = document.getElementById('copy-result');
  const resetBtn = document.getElementById('reset-btn');
  const hintEl = document.getElementById('unit-cost-hint');
  
  const resultLabel = document.getElementById('calc-result-label');
  const resultValue = document.getElementById('calc-result-value');
  
  const addToListBtn = document.getElementById('add-to-list');
  const listContainer = document.getElementById('calculator-list-container');
  const calcList = document.getElementById('calc-list');
  const clearListBtn = document.getElementById('clear-list');
  const runningTotalEl = document.getElementById('running-total');

  let lastEdited = 'quantity';
  let calculationList = [];

  function formatNumber(num, isCurrency = false) {
    if (isCurrency) {
      return num.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  function updateResultDisplay(value, label, isCurrency = false) {
    resultLabel.innerText = label;
    if (isCurrency) {
      resultValue.innerHTML = formatCurrencyDecimal(value);
    } else {
      const formatted = formatNumber(value);
      if (formatted.includes('.')) {
        const parts = formatted.split('.');
        resultValue.innerHTML = `${parts[0]}.<span class="decimal-small">${parts[1]}</span> units`;
      } else {
        resultValue.innerText = `${formatted} units`;
      }
    }
  }

  function renderList() {
    if (calculationList.length === 0) {
      listContainer.style.display = 'none';
      return;
    }

    listContainer.style.display = 'block';
    calcList.innerHTML = '';
    let runningTotal = 0;

    calculationList.forEach((item, index) => {
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: white; border-radius: 8px; border: 1px solid var(--border);';
      
      const symbol = document.querySelector('.currency-symbol').innerText;
      
      const info = document.createElement('div');
      const labelText = item.description ? `<strong>${item.description}</strong>` : item.label;
      info.innerHTML = `<div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">${labelText}</div>
                        <div style="font-weight: 600;">${symbol}${formatNumber(item.unitCost, true)} × ${formatNumber(item.quantity)} units</div>`;
      
      const value = document.createElement('div');
      value.style.cssText = 'display: flex; align-items: center; gap: 1rem;';
      
      const amount = document.createElement('span');
      amount.style.fontWeight = '800';
      amount.innerHTML = item.isCurrency ? formatCurrencyDecimal(item.value) : `${formatNumber(item.value)} units`;
      
      const removeBtn = document.createElement('button');
      removeBtn.innerHTML = '×';
      removeBtn.style.cssText = 'background: #fee2e2; color: #ef4444; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: 900;';
      removeBtn.onclick = () => {
        calculationList.splice(index, 1);
        renderList();
      };

      value.appendChild(amount);
      value.appendChild(removeBtn);
      row.appendChild(info);
      row.appendChild(value);
      calcList.appendChild(row);

      if (item.isCurrency) {
        runningTotal += item.value;
      }
    });

    runningTotalEl.innerHTML = formatCurrencyDecimal(runningTotal);
  }

  function calculate() {
    const unitCost = parseFloat(unitCostInput.value) || 0;
    const quantity = parseFloat(quantityInput.value) || 0;
    const totalCost = parseFloat(totalCostInput.value) || 0;
    const isWholeUnits = wholeUnitsToggle.checked;

    hintEl.style.display = (unitCost === 0 && lastEdited === 'total') ? 'block' : 'none';

    if (lastEdited === 'quantity') {
      let finalQuantity = quantity;
      if (isWholeUnits) {
        finalQuantity = Math.round(quantity);
        quantityInput.value = finalQuantity;
      }
      const calculatedTotal = unitCost * finalQuantity;
      totalCostInput.value = calculatedTotal.toFixed(2);
      updateResultDisplay(calculatedTotal, 'Total Cost', true);
    } else if (lastEdited === 'total') {
      if (unitCost > 0) {
        let calculatedQuantity = totalCost / unitCost;
        if (isWholeUnits) {
          calculatedQuantity = Math.round(calculatedQuantity);
          // If rounding changed the quantity, we should update the total to match the real cost of these whole units
          const adjustedTotal = unitCost * calculatedQuantity;
          totalCostInput.value = adjustedTotal.toFixed(2);
        }
        quantityInput.value = calculatedQuantity;
        updateResultDisplay(calculatedQuantity, 'Quantity', false);
      } else {
        resultValue.innerText = '--';
      }
    }
  }

  addToListBtn.addEventListener('click', () => {
    const unitCost = parseFloat(unitCostInput.value) || 0;
    const quantity = parseFloat(quantityInput.value) || 0;
    const totalCost = parseFloat(totalCostInput.value) || 0;
    const description = descriptionInput.value.trim();
    
    if (lastEdited === 'quantity') {
      calculationList.push({
        label: 'Total Cost',
        description,
        unitCost,
        quantity,
        value: totalCost,
        isCurrency: true
      });
    } else {
      calculationList.push({
        label: 'Quantity',
        description,
        unitCost,
        quantity,
        value: quantity,
        isCurrency: false
      });
    }
    
    renderList();
    
    // Clear description for next item
    descriptionInput.value = '';
    
    // Visual feedback
    addToListBtn.style.transform = 'scale(1.2)';
    setTimeout(() => addToListBtn.style.transform = 'scale(1)', 200);
  });

  clearListBtn.addEventListener('click', () => {
    calculationList = [];
    renderList();
  });

  unitCostInput.addEventListener('input', calculate);
  quantityInput.addEventListener('input', () => {
    lastEdited = 'quantity';
    calculate();
  });
  totalCostInput.addEventListener('input', () => {
    lastEdited = 'total';
    calculate();
  });
  wholeUnitsToggle.addEventListener('change', calculate);

  copyBtn.addEventListener('click', () => {
    const valueToCopy = lastEdited === 'quantity' ? totalCostInput.value : quantityInput.value;
    navigator.clipboard.writeText(valueToCopy).then(() => {
      const originalText = copyBtn.innerText;
      copyBtn.innerText = 'Copied!';
      setTimeout(() => copyBtn.innerText = originalText, 2000);
    });
  });

  resetBtn.addEventListener('click', () => {
    descriptionInput.value = '';
    unitCostInput.value = '1.00';
    quantityInput.value = '1';
    totalCostInput.value = '1.00';
    wholeUnitsToggle.checked = false;
    lastEdited = 'quantity';
    hintEl.style.display = 'none';
    calculate();
  });

  window.addEventListener('currencyChange', calculate);

  calculate();
});
