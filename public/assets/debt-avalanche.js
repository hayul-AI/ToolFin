import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

/**
 * Debt Avalanche Logic & UI Controller
 */

const STORAGE_KEY = 'toolfin_debt_avalanche';
const MAX_MONTHS = 1200; // 100 years safety cap

function initStartMonthPicker() {
  const el = document.querySelector("#start-date");
  if (!el) return;

  if (typeof flatpickr === "undefined" || typeof monthSelectPlugin === "undefined") {
    console.warn("[ToolFin] flatpickr or monthSelectPlugin missing");
    return;
  }

  const existing = el.value || "";
  
  flatpickr(el, {
    appendTo: document.body,
    plugins: [
      new monthSelectPlugin({
        shorthand: true,
        dateFormat: "M Y",
        altFormat: "F Y",
        theme: "light"
      })
    ],
    defaultDate: existing || new Date(),
    allowInput: false,
    clickOpens: true,
    disableMobile: true,
    locale: {
      months: {
        shorthand: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        longhand: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      }
    }
  });
}

function parseMonth(dateStr) {
  if (!dateStr) return new Date();
  const [m, y] = dateStr.split(" ");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mIdx = months.indexOf(m);
  if (mIdx === -1) return new Date();
  return new Date(parseInt(y), mIdx, 1);
}

function formatDate(date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const debtList = document.getElementById('debt-list');
  const addDebtBtn = document.getElementById('add-debt-btn');
  const extraPaymentInput = document.getElementById('extra-payment');
  const startDateInput = document.getElementById('start-date');
  const calculateBtn = document.getElementById('calculate-btn');
  const resetBtn = document.getElementById('reset-btn');
  const errorBanner = document.getElementById('error-banner');
  const resultsArea = document.getElementById('results-area');
  const toggleScheduleBtn = document.getElementById('toggle-schedule-btn');
  const scheduleBody = document.getElementById('schedule-body');

  let showFullSchedule = false;
  let calculationData = null;

  initStartMonthPicker();

  function createDebtRow(data = { name: '', balance: '', apr: '', min: '' }) {
    const row = document.createElement('div');
    row.className = 'debt-row';
    row.innerHTML = `
      <div class="tf-field-group">
        <label>Debt Name</label>
        <div class="input-wrapper"><input type="text" class="d-name" value="${data.name}" placeholder="e.g. Credit Card"></div>
      </div>
      <div class="tf-field-group">
        <label>Balance</label>
        <div class="input-wrapper has-prefix"><span class="prefix currency-symbol">$</span><input type="number" class="d-balance" value="${data.balance}" placeholder="0" min="0"></div>
      </div>
      <div class="tf-field-group">
        <label>APR %</label>
        <div class="input-wrapper"><input type="number" class="d-apr" value="${data.apr}" placeholder="0" step="0.01" min="0"><span class="suffix" style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-weight: 700; color: var(--text-muted);">%</span></div>
      </div>
      <div class="tf-field-group">
        <label>Min Payment</label>
        <div class="input-wrapper has-prefix"><span class="prefix currency-symbol">$</span><input type="number" class="d-min" value="${data.min}" placeholder="0" min="0"></div>
      </div>
      <button class="remove-btn" title="Remove">&times;</button>
    `;
    row.querySelector('.remove-btn').addEventListener('click', () => {
      row.remove();
      saveToStorage();
    });
    return row;
  }

  function addRow(data) {
    debtList.appendChild(createDebtRow(data));
  }

  function saveToStorage() {
    const debts = [];
    document.querySelectorAll('.debt-row').forEach(row => {
      debts.push({
        name: row.querySelector('.d-name').value,
        balance: row.querySelector('.d-balance').value,
        apr: row.querySelector('.d-apr').value,
        min: row.querySelector('.d-min').value
      });
    });
    const state = {
      debts,
      extra: extraPaymentInput.value,
      start: startDateInput.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const state = JSON.parse(saved);
      state.debts.forEach(d => addRow(d));
      extraPaymentInput.value = state.extra || 200;
      startDateInput.value = state.start || '';
    } else {
      addRow({ name: 'Visa Credit Card', balance: '5000', apr: '18.99', min: '125' });
      addRow({ name: 'Student Loan', balance: '12000', apr: '4.5', min: '150' });
    }
  }

  function validate() {
    errorBanner.style.display = 'none';
    const debts = [];
    let totalMin = 0;
    let totalInterestFirstMonth = 0;

    document.querySelectorAll('.debt-row').forEach(row => {
      const balance = parseFloat(row.querySelector('.d-balance').value) || 0;
      const apr = parseFloat(row.querySelector('.d-apr').value) || 0;
      const min = parseFloat(row.querySelector('.d-min').value) || 0;
      const name = row.querySelector('.d-name').value || 'Unnamed Debt';

      if (balance > 0) {
        debts.push({ name, balance, apr, min });
        totalMin += min;
        totalInterestFirstMonth += balance * (apr / 100 / 12);
      }
    });

    const extra = parseFloat(extraPaymentInput.value) || 0;
    
    if (debts.length === 0) {
      showError("Please enter at least one debt with a balance.");
      return null;
    }

    if (totalMin + extra <= totalInterestFirstMonth) {
      showError("Warning: Negative Amortization. Your total monthly payment is less than the interest accruing. Your debt will grow forever unless you increase your payment.");
      // We still return to show results, but logic will cap at MAX_MONTHS
    }

    return { debts, extra };
  }

  function showError(msg) {
    errorBanner.textContent = msg;
    errorBanner.style.display = 'block';
    errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function computePayoff(debts, extraPool, isAvalanche = true) {
    // Clone debts to avoid mutation
    let activeDebts = debts.map(d => ({ ...d, currentBalance: d.balance }));
    
    // Avalanche Sort: Highest APR first. Tie-break with smallest balance.
    if (isAvalanche) {
      activeDebts.sort((a, b) => b.apr - a.apr || a.balance - b.balance);
    }

    let totalInterest = 0;
    let totalPaid = 0;
    let months = 0;
    const history = [];

    while (activeDebts.some(d => d.currentBalance > 0.01) && months < MAX_MONTHS) {
      months++;
      let monthlyInterest = 0;
      let monthlyPrincipal = 0;
      let monthlyPayment = 0;
      
      // 1. Calculate Interest
      activeDebts.forEach(d => {
        if (d.currentBalance > 0) {
          const interest = d.currentBalance * (d.apr / 100 / 12);
          d.interestThisMonth = interest;
          monthlyInterest += interest;
        } else {
          d.interestThisMonth = 0;
        }
      });

      // 2. Apply Minimums
      let extraAvailable = extraPool;
      activeDebts.forEach(d => {
        if (d.currentBalance > 0) {
          const payment = Math.min(d.currentBalance + d.interestThisMonth, d.min);
          d.paymentThisMonth = payment;
          monthlyPayment += payment;
          // If we paid less than min because balance was low, the rest goes to extra
          if (d.min > payment) {
            extraAvailable += (d.min - payment);
          }
        } else {
          // Debt already paid, its full min goes to extra
          extraAvailable += d.min;
          d.paymentThisMonth = 0;
        }
      });

      // 3. Apply Extra to Target (Avalanche/Highest APR)
      const target = activeDebts.find(d => d.currentBalance > 0);
      if (target) {
        const remainingOnTarget = target.currentBalance + target.interestThisMonth - target.paymentThisMonth;
        const extraToApply = Math.min(remainingOnTarget, extraAvailable);
        target.paymentThisMonth += extraToApply;
        monthlyPayment += extraToApply;
      }

      // 4. Update Balances
      activeDebts.forEach(d => {
        if (d.currentBalance > 0) {
          const principal = d.paymentThisMonth - d.interestThisMonth;
          d.currentBalance -= principal;
          monthlyPrincipal += principal;
          if (d.currentBalance < 0) d.currentBalance = 0;
        }
      });

      totalInterest += monthlyInterest;
      totalPaid += monthlyPayment;
      
      history.push({
        month: months,
        payment: monthlyPayment,
        interest: monthlyInterest,
        principal: monthlyPrincipal,
        balance: activeDebts.reduce((sum, d) => sum + d.currentBalance, 0)
      });
    }

    return { months, totalInterest, totalPaid, history };
  }

  function renderResults(avalanche, baseline, startMonth) {
    resultsArea.style.display = 'block';
    
    const payoffDate = new Date(startMonth);
    payoffDate.setMonth(payoffDate.getMonth() + avalanche.months);
    
    document.getElementById('res-payoff-date').textContent = formatDate(payoffDate);
    document.getElementById('res-total-interest').innerHTML = formatCurrency(avalanche.totalInterest);
    document.getElementById('res-total-time').textContent = avalanche.months >= MAX_MONTHS ? "100+ Years" : `${Math.floor(avalanche.months / 12)}y ${avalanche.months % 12}m`;
    document.getElementById('res-total-paid').innerHTML = formatCurrency(avalanche.totalPaid);

    const interestSaved = baseline.totalInterest - avalanche.totalInterest;
    const timeSaved = baseline.months - avalanche.months;

    document.getElementById('res-savings-interest').innerHTML = formatCurrency(Math.max(0, interestSaved));
    document.getElementById('res-savings-time').textContent = timeSaved > 0 ? `${Math.floor(timeSaved / 12)}y ${timeSaved % 12}m` : '0m';

    renderChart(avalanche.history);
    renderSchedule(avalanche.history, startMonth);
    
    resultsArea.scrollIntoView({ behavior: 'smooth' });
  }

  function renderChart(history) {
    const chart = document.getElementById('balance-chart');
    chart.innerHTML = '';
    
    // Show first 24 months
    const dataPoints = history.slice(0, 24);
    const maxBalance = Math.max(...history.map(h => h.balance));

    dataPoints.forEach(h => {
      const height = (h.balance / maxBalance) * 100;
      const bar = document.createElement('div');
      bar.className = 'bar-item';
      bar.style.height = `${Math.max(2, height)}%`;
      bar.title = `Month ${h.month}: ${formatCurrency(h.balance, 0, false)}`;
      chart.appendChild(bar);
    });
  }

  function renderSchedule(history, startMonth) {
    calculationData = { history, startMonth };
    updateScheduleUI();
  }

  function updateScheduleUI() {
    const { history, startMonth } = calculationData;
    scheduleBody.innerHTML = '';
    
    const toShow = showFullSchedule ? history : history.slice(0, 24);
    
    toShow.forEach(h => {
      const rowDate = new Date(startMonth);
      rowDate.setMonth(rowDate.getMonth() + h.month);
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatDate(rowDate)}</td>
        <td>${formatCurrencyDecimal(h.payment)}</td>
        <td>${formatCurrencyDecimal(h.interest)}</td>
        <td>${formatCurrencyDecimal(h.principal)}</td>
        <td><strong>${formatCurrencyDecimal(h.balance)}</strong></td>
      `;
      scheduleBody.appendChild(tr);
    });

    toggleScheduleBtn.textContent = showFullSchedule ? "Show Less" : `Show All (${history.length} Months)`;
    if (history.length <= 24) toggleScheduleBtn.style.display = 'none';
    else toggleScheduleBtn.style.display = 'block';
  }

  function calculate() {
    const input = validate();
    if (!input) return;

    saveToStorage();

    const startMonth = parseMonth(startDateInput.value);
    
    // 1. Compute Avalanche
    const avalanche = computePayoff(input.debts, input.extra, true);
    
    // 2. Compute Baseline (Min payments only, 0 extra)
    const baseline = computePayoff(input.debts, 0, true);

    renderResults(avalanche, baseline, startMonth);
  }

  addDebtBtn.addEventListener('click', () => addRow({ name: '', balance: '', apr: '', min: '' }));
  
  calculateBtn.addEventListener('click', calculate);
  
  resetBtn.addEventListener('click', () => {
    if (confirm("Reset all inputs?")) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });

  toggleScheduleBtn.addEventListener('click', () => {
    showFullSchedule = !showFullSchedule;
    updateScheduleUI();
  });

  // Currency change support
  window.addEventListener('currencyChange', () => {
    if (resultsArea.style.display !== 'none') calculate();
    
    // Update symbols in input placeholders if needed
    const symbol = getCurrency().symbol;
    document.querySelectorAll('.currency-symbol').forEach(s => s.textContent = symbol);
  });

  loadFromStorage();
});
