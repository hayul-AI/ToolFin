import { formatCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const debtContainer = document.getElementById('debt-container');
  const addDebtBtn = document.getElementById('add-debt-btn');
  const extraPaymentInput = document.getElementById('extra-payment');
  const startDateInput = document.getElementById('start-date');
  const calculateBtn = document.getElementById('calculate-btn');
  const resetBtn = document.getElementById('reset-btn');

  // Results elements
  const resultsSection = document.getElementById('results-section');
  const resPayoffDate = document.getElementById('res-payoff-date');
  const resDuration = document.getElementById('res-duration');
  const resInterest = document.getElementById('res-interest');
  const resTotal = document.getElementById('res-total');
  const interpretationBox = document.getElementById('interpretation-box');
  const payoffOrderList = document.getElementById('payoff-order-list');
  const timelineBody = document.getElementById('timeline-body');

  // Set default start date to current month
  const now = new Date();
  startDateInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  function createDebtRow(name = '', balance = '', apr = '', minPayment = '') {
    const row = document.createElement('div');
    row.className = 'debt-row';
    row.innerHTML = `
      <div class="input-group" style="margin-bottom: 0;">
        <label>Debt Name</label>
        <div class="input-wrapper"><input type="text" class="debt-name" value="${name}" placeholder="e.g. Visa"></div>
      </div>
      <div class="input-group" style="margin-bottom: 0;">
        <label>Balance</label>
        <div class="input-wrapper"><input type="number" class="debt-balance" value="${balance}" placeholder="0"></div>
      </div>
      <div class="input-group" style="margin-bottom: 0;">
        <label>APR %</label>
        <div class="input-wrapper"><input type="number" class="debt-apr" value="${apr}" placeholder="0" step="0.01"></div>
      </div>
      <div class="input-group" style="margin-bottom: 0;">
        <label>Min Payment</label>
        <div class="input-wrapper"><input type="number" class="debt-min" value="${minPayment}" placeholder="0"></div>
      </div>
      <button class="remove-btn" title="Remove">&times;</button>
    `;
    
    row.querySelector('.remove-btn').addEventListener('click', () => {
      row.remove();
      if (debtContainer.children.length === 0) addDebtRow();
    });
    
    return row;
  }

  function addDebtRow() {
    debtContainer.appendChild(createDebtRow());
  }

  // Initial rows
  debtContainer.appendChild(createDebtRow('Credit Card 1', '1200', '18', '40'));
  debtContainer.appendChild(createDebtRow('Car Loan', '8000', '4.5', '250'));

  addDebtBtn.addEventListener('click', addDebtRow);

  resetBtn.addEventListener('click', () => {
    debtContainer.innerHTML = '';
    addDebtRow();
    resultsSection.style.display = 'none';
  });

  function calculate() {
    const debts = [];
    const rows = debtContainer.querySelectorAll('.debt-row');
    
    rows.forEach(row => {
      const balance = parseFloat(row.querySelector('.debt-balance').value) || 0;
      if (balance > 0) {
        debts.push({
          name: row.querySelector('.debt-name').value || 'Unnamed Debt',
          balance: balance,
          apr: parseFloat(row.querySelector('.debt-apr').value) || 0,
          minPayment: parseFloat(row.querySelector('.debt-min').value) || 0,
          paidOffMonth: null
        });
      }
    });

    if (debts.length === 0) return;

    // Snowball Order: Smallest balance first
    debts.sort((a, b) => a.balance - b.balance);

    const extraBase = parseFloat(extraPaymentInput.value) || 0;
    let totalInterest = 0;
    let totalPaid = 0;
    let monthCount = 0;
    const timeline = [];
    const maxMonths = 600;

    let currentBalances = debts.map(d => ({ ...d }));
    
    while (currentBalances.some(d => d.balance > 0) && monthCount < maxMonths) {
      monthCount++;
      let monthlyInterest = 0;
      let monthlyPrincipal = 0;
      let monthlyTotalPayment = 0;
      
      // Calculate interest first for all active debts
      currentBalances.forEach(d => {
        if (d.balance > 0) {
          const interest = d.balance * ((d.apr / 100) / 12);
          d.interestThisMonth = interest;
          monthlyInterest += interest;
        } else {
          d.interestThisMonth = 0;
        }
      });

      // Distribute minimum payments
      let availableExtra = extraBase;
      currentBalances.forEach(d => {
        if (d.balance > 0) {
          const min = d.minPayment;
          const payment = Math.min(d.balance + d.interestThisMonth, min);
          d.paymentThisMonth = payment;
          monthlyTotalPayment += payment;
        } else {
          // Debt is already paid, its minimum payment rolls into the available extra
          availableExtra += d.minPayment;
          d.paymentThisMonth = 0;
        }
      });

      // Apply snowball (extra + rolled minimums) to the first debt with a balance
      const targetDebt = currentBalances.find(d => d.balance > 0);
      if (targetDebt) {
        const extraUsed = Math.min(targetDebt.balance + targetDebt.interestThisMonth - targetDebt.paymentThisMonth, availableExtra);
        targetDebt.paymentThisMonth += extraUsed;
        monthlyTotalPayment += extraUsed;
      }

      // Finalize month: subtract principal from balances
      currentBalances.forEach(d => {
        if (d.balance > 0) {
          const principalApplied = d.paymentThisMonth - d.interestThisMonth;
          d.balance -= principalApplied;
          monthlyPrincipal += principalApplied;
          
          if (d.balance <= 0) {
            d.balance = 0;
            d.paidOffMonth = monthCount;
          }
        }
      });

      totalInterest += monthlyInterest;
      totalPaid += monthlyTotalPayment;

      const totalRemaining = currentBalances.reduce((sum, d) => sum + d.balance, 0);
      
      if (monthCount <= 36 || totalRemaining === 0 || monthCount % 12 === 0) {
        timeline.push({
          month: monthCount,
          payment: monthlyTotalPayment,
          interest: monthlyInterest,
          principal: monthlyPrincipal,
          balance: totalRemaining
        });
      }
    }

    displayResults(debts, currentBalances, monthCount, totalInterest, totalPaid, timeline);
  }

  function displayResults(originalDebts, finalDebts, totalMonths, totalInterest, totalPaid, timeline) {
    resultsSection.style.display = 'block';
    
    // Summary
    const startDate = new Date(startDateInput.value + '-01');
    const payoffDate = new Date(startDate);
    payoffDate.setMonth(payoffDate.getMonth() + totalMonths);
    
    resPayoffDate.textContent = payoffDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    resDuration.textContent = `${Math.floor(totalMonths / 12)} years, ${totalMonths % 12} months`;
    resInterest.textContent = formatCurrency(totalInterest);
    resTotal.textContent = formatCurrency(totalPaid);

    // Interpretation
    if (totalMonths < 24) {
      interpretationBox.textContent = "Short payoff horizon. Your debt-free goal is within reach, and momentum will build quickly as you close out balances.";
    } else if (totalMonths <= 60) {
      interpretationBox.textContent = "Moderate payoff horizon. A steady approach will help you clear these balances while interest remains manageable over time.";
    } else if (totalMonths <= 120) {
      interpretationBox.textContent = "Extended payoff horizon. Staying disciplined with the snowball roll-over is critical as interest accumulation becomes more significant.";
    } else {
      interpretationBox.textContent = "Long payoff horizon. Consider looking for ways to increase the monthly extra payment to reduce the long-term interest impact.";
    }

    // Payoff Order
    payoffOrderList.innerHTML = '';
    finalDebts.forEach((d, i) => {
      const li = document.createElement('li');
      li.style.padding = '0.75rem 0';
      li.style.borderBottom = '1px solid var(--border)';
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      
      const payoffDateDebt = new Date(startDate);
      payoffDateDebt.setMonth(payoffDateDebt.getMonth() + d.paidOffMonth);
      
      li.innerHTML = `
        <span><strong>${i + 1}. ${d.name}</strong></span>
        <span style="font-weight: 600; color: #10b981;">Paid Off: ${payoffDateDebt.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
      `;
      payoffOrderList.appendChild(li);
    });

    // Timeline Table
    timelineBody.innerHTML = '';
    timeline.forEach(row => {
      const tr = document.createElement('tr');
      const rowDate = new Date(startDate);
      rowDate.setMonth(rowDate.getMonth() + row.month);
      
      tr.innerHTML = `
        <td>${rowDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</td>
        <td>${formatCurrency(row.payment)}</td>
        <td>${formatCurrency(row.interest)}</td>
        <td>${formatCurrency(row.principal)}</td>
        <td><strong>${formatCurrency(row.balance)}</strong></td>
      `;
      timelineBody.appendChild(tr);
    });

    resultsSection.scrollIntoView({ behavior: 'smooth' });
  }

  calculateBtn.addEventListener('click', calculate);
  window.addEventListener('currencyChange', calculate);
});
