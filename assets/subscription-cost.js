import { formatCurrencyDecimal } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const listContainer = document.getElementById('subscription-list');
  const addBtn = document.getElementById('add-service');
  
  const results = {
    monthly: document.getElementById('monthly-total'),
    yearly: document.getElementById('yearly-total'),
    fiveYear: document.getElementById('five-year-total'),
    tenYear: document.getElementById('ten-year-total'),
    interpretation: document.getElementById('interpretation-text')
  };

  function createRow() {
    const row = document.createElement('div');
    row.className = 'subscription-row';
    row.innerHTML = `
      <div class="input-group" style="margin-bottom: 0;">
        <label>Service Name</label>
        <input type="text" class="service-name" placeholder="e.g. Netflix" style="padding: 0.6rem;">
      </div>
      <div class="input-group" style="margin-bottom: 0;">
        <label>Price</label>
        <div class="input-wrapper has-prefix">
          <span class="prefix currency-symbol">$</span>
          <input type="number" class="service-price" value="15" step="0.01" min="0">
        </div>
      </div>
      <div class="input-group" style="margin-bottom: 0;">
        <label>Billing</label>
        <select class="service-cycle" style="padding: 0.6rem; width: 100%; border: 1px solid var(--border); border-radius: 6px;">
          <option value="monthly">Monthly</option>
          <option value="yearly">Annual</option>
        </select>
      </div>
      <button class="remove-btn">Remove</button>
    `;

    // Event listeners for inputs
    row.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', calculate);
    });

    row.querySelector('.remove-btn').addEventListener('click', () => {
      row.remove();
      calculate();
    });

    return row;
  }

  function calculate() {
    let totalMonthly = 0;
    const rows = listContainer.querySelectorAll('.subscription-row');

    rows.forEach(row => {
      const price = parseFloat(row.querySelector('.service-price').value) || 0;
      const cycle = row.querySelector('.service-cycle').value;

      if (cycle === 'yearly') {
        totalMonthly += (price / 12);
      } else {
        totalMonthly += price;
      }
    });

    const totalYearly = totalMonthly * 12;
    const total5Yr = totalYearly * 5;
    const total10Yr = totalYearly * 10;

    // Update UI
    results.monthly.innerHTML = formatCurrencyDecimal(totalMonthly);
    results.yearly.innerHTML = formatCurrencyDecimal(totalYearly);
    results.fiveYear.innerHTML = formatCurrencyDecimal(total5Yr);
    results.tenYear.innerHTML = formatCurrencyDecimal(total10Yr);

    updateInterpretation(totalMonthly, rows.length);
  }

  function updateInterpretation(monthly, count) {
    if (count === 0) {
      results.interpretation.textContent = "Small recurring payments can grow into large long-term expenses. Add your first service to start tracking.";
      return;
    }

    let text = `You currently have ${count} subscription${count > 1 ? 's' : ''} costing you ${formatCurrencyDecimal(monthly)} per month. `;
    
    if (monthly > 150) {
      text += "Your recurring spending is relatively high. Auditing these services could significantly boost your monthly savings.";
    } else if (monthly > 50) {
      text += "This is a typical amount for many households, but remember that over a decade, this represents a significant investment opportunity.";
    } else {
      text += "Your subscription overhead is lean, which gives your budget more flexibility.";
    }

    results.interpretation.textContent = text;
  }

  addBtn.addEventListener('click', () => {
    listContainer.appendChild(createRow());
    calculate();
  });

  // Listen for currency changes
  window.addEventListener('currencyChange', calculate);

  // Add one initial row
  listContainer.appendChild(createRow());
  calculate();
});
