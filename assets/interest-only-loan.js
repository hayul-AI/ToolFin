import { formatCurrencyDecimal, getCurrency } from './common.js';

/**
 * Interest-Only Loan Calculator
 * Logic for IO phase followed by Amortization phase.
 */

const STORAGE_KEY = "toolfin_interest_only_loan_v1";
const MAX_PERIODS = 5000;

document.addEventListener('DOMContentLoaded', () => {
  const loanInput = document.getElementById('loan-amount');
  const aprInput = document.getElementById('apr');
  const ioPeriodInput = document.getElementById('io-period');
  const ioUnitSelect = document.getElementById('io-unit');
  const amortTermInput = document.getElementById('amortization-term');
  const frequencySelect = document.getElementById('frequency');
  const startDateInput = document.getElementById('start-date');
  const extraPaymentInput = document.getElementById('extra-payment');
  const calculateBtn = document.getElementById('calculate-btn');
  const resetBtn = document.getElementById('reset-btn');
  const advancedToggle = document.getElementById('btn-toggle-advanced');
  const advancedPanel = document.getElementById('panel-advanced');
  const warningBanner = document.getElementById('warning-banner');
  const scheduleBody = document.getElementById('schedule-body');
  const scheduleSection = document.getElementById('schedule-section');
  const summarySection = document.getElementById('summary-section');
  const toggleAllBtn = document.getElementById('toggle-all-btn');

  // Result Displays
  const resIOPayment = document.getElementById('res-io-payment');
  const resAmortPayment = document.getElementById('res-amort-payment');
  const resTotalInterest = document.getElementById('res-total-interest');
  const resPayoffDate = document.getElementById('res-payoff-date');
  const sumIOTotal = document.getElementById('sum-io-total');
  const sumTotalPaid = document.getElementById('sum-total-paid');
  const sumTotalPeriods = document.getElementById('sum-total-periods');

  let showAll = false;
  let scheduleData = [];

  // Init Month Picker
  const fp = flatpickr(startDateInput, {
    appendTo: document.body,
    plugins: [
      new monthSelectPlugin({
        shorthand: true,
        dateFormat: "M Y",
        altFormat: "F Y",
        theme: "light"
      })
    ],
    defaultDate: new Date(),
    disableMobile: true,
    locale: {
      months: {
        shorthand: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        longhand: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      }
    }
  });

  function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      loanInput.value = data.loanAmount || 300000;
      aprInput.value = data.apr || 6.5;
      ioPeriodInput.value = data.ioPeriod || 5;
      ioUnitSelect.value = data.ioUnit || 'years';
      amortTermInput.value = data.amortTerm || 25;
      frequencySelect.value = data.frequency || 'monthly';
      extraPaymentInput.value = data.extraPayment || 0;
      if (data.startDate) {
          fp.setDate(data.startDate);
      }
    }
  }

  function saveState() {
    const data = {
      loanAmount: loanInput.value,
      apr: aprInput.value,
      ioPeriod: ioPeriodInput.value,
      ioUnit: ioUnitSelect.value,
      amortTerm: amortTermInput.value,
      frequency: frequencySelect.value,
      startDate: startDateInput.value,
      extraPayment: extraPaymentInput.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function resetState() {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }

  function validate() {
    let valid = true;
    const loan = parseFloat(loanInput.value);
    const apr = parseFloat(aprInput.value);
    const amort = parseFloat(amortTermInput.value);

    // Clear previous errors
    document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
    warningBanner.style.display = 'none';

    if (isNaN(loan) || loan <= 0) {
      document.getElementById('err-loan-amount').style.display = 'block';
      valid = false;
    }
    if (isNaN(apr) || apr < 0 || apr > 100) {
      document.getElementById('err-apr').style.display = 'block';
      valid = false;
    }
    if (isNaN(amort) || amort <= 0) {
      document.getElementById('err-amort-term').style.display = 'block';
      valid = false;
    }

    if (apr === 0) {
      warningBanner.textContent = "Notice: 0% APR detected. Payments will be principal-only.";
      warningBanner.style.display = 'block';
    }

    return valid;
  }

  function getFrequencyMultiplier(freq) {
    switch (freq) {
      case 'biweekly': return 26;
      case 'weekly': return 52;
      default: return 12;
    }
  }

  function calculate() {
    if (!validate()) return;
    saveState();

    const principal = parseFloat(loanInput.value);
    const annualRate = parseFloat(aprInput.value) / 100;
    const ioValue = parseInt(ioPeriodInput.value) || 0;
    const ioUnit = ioUnitSelect.value;
    const amortYears = parseInt(amortTermInput.value);
    const frequency = frequencySelect.value;
    const extra = parseFloat(extraPaymentInput.value) || 0;
    const startDate = fp.selectedDates[0] || new Date();

    const freqMult = getFrequencyMultiplier(frequency);
    const r = annualRate / freqMult;

    // Determine IO periods
    let ioPeriodsCount = ioUnit === 'years' ? ioValue * freqMult : ioValue;
    if (ioUnit === 'months' && frequency !== 'monthly') {
        ioPeriodsCount = Math.ceil((ioValue / 12) * freqMult);
    }

    const amortPeriodsCount = amortYears * freqMult;

    let balance = principal;
    let totalInterest = 0;
    let totalPaid = 0;
    let ioTotalPaid = 0;
    let p = 1;
    scheduleData = [];

    // Result Box: Initial IO Payment (Interest + Extra)
    const initialIOPayment = (balance * r) + extra;

    // Phase 1: Interest Only
    for (; p <= ioPeriodsCount && balance > 0.01 && p <= MAX_PERIODS; p++) {
      const interest = balance * r;
      const principalPaid = Math.min(extra, balance);
      const actualPayment = interest + principalPaid;
      
      scheduleData.push({
        period: p,
        date: getPeriodDate(startDate, p - 1, frequency),
        payment: actualPayment,
        interest: interest,
        principal: principalPaid,
        balance: balance - principalPaid
      });

      balance -= principalPaid;
      totalInterest += interest;
      totalPaid += actualPayment;
      ioTotalPaid += actualPayment;
    }

    // Phase 2: Amortization
    const remainingPeriods = amortPeriodsCount;
    let amortPayment = 0;
    if (balance > 0.01) {
      if (r > 0) {
        amortPayment = balance * r / (1 - Math.pow(1 + r, -remainingPeriods));
      } else {
        amortPayment = balance / remainingPeriods;
      }
    }

    const finalAmortPayment = amortPayment; // For display

    for (let i = 1; i <= remainingPeriods && balance > 0.01 && p <= MAX_PERIODS; i++, p++) {
      const interest = balance * r;
      let payment = Math.min(amortPayment, balance + interest);
      let principalPaid = payment - interest;

      scheduleData.push({
        period: p,
        date: getPeriodDate(startDate, p - 1, frequency),
        payment: payment,
        interest: interest,
        principal: principalPaid,
        balance: balance - principalPaid
      });

      balance -= principalPaid;
      totalInterest += interest;
      totalPaid += payment;
    }

    renderResults({
      ioPayment: initialIOPayment,
      amortPayment: finalAmortPayment,
      totalInterest,
      totalPaid,
      ioTotalPaid,
      payoffDate: scheduleData.length > 0 ? scheduleData[scheduleData.length - 1].date : startDate,
      totalPeriods: scheduleData.length
    });
  }

  function getPeriodDate(start, index, frequency) {
    const d = new Date(start);
    if (frequency === 'monthly') {
      d.setMonth(d.getMonth() + index);
    } else if (frequency === 'biweekly') {
      d.setDate(d.getDate() + (index * 14));
    } else {
      d.setDate(d.getDate() + (index * 7));
    }
    return d;
  }

  function formatDate(date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  function renderResults(res) {
    resIOPayment.textContent = formatCurrencyDecimal(res.ioPayment);
    resAmortPayment.textContent = formatCurrencyDecimal(res.amortPayment);
    resTotalInterest.textContent = formatCurrencyDecimal(res.totalInterest);
    resPayoffDate.textContent = formatDate(res.payoffDate);

    sumIOTotal.textContent = formatCurrencyDecimal(res.ioTotalPaid);
    sumTotalPaid.textContent = formatCurrencyDecimal(res.totalPaid);
    sumTotalPeriods.textContent = res.totalPeriods;

    summarySection.style.display = 'block';
    scheduleSection.style.display = 'block';
    renderTable();
  }

  function renderTable() {
    scheduleBody.innerHTML = '';
    const limit = showAll ? scheduleData.length : Math.min(24, scheduleData.length);

    for (let i = 0; i < limit; i++) {
      const row = scheduleData[i];
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.period}</td>
        <td>${formatDate(row.date)}</td>
        <td>${formatCurrencyDecimal(row.payment)}</td>
        <td>${formatCurrencyDecimal(row.interest)}</td>
        <td>${formatCurrencyDecimal(row.principal)}</td>
        <td>${formatCurrencyDecimal(row.balance)}</td>
      `;
      scheduleBody.appendChild(tr);
    }

    toggleAllBtn.textContent = showAll ? "Show Less" : `Show All (${scheduleData.length} Periods)`;
    toggleAllBtn.style.display = scheduleData.length > 24 ? 'block' : 'none';
  }

  calculateBtn.addEventListener('click', () => {
    showAll = false;
    calculate();
    summarySection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', resetState);

  advancedToggle.addEventListener('click', () => {
    advancedPanel.classList.toggle('show');
    const isShow = advancedPanel.classList.contains('show');
    advancedToggle.querySelector('span').textContent = isShow ? 
      "▼ Advanced Options (Extra Payment)" : "▶ Advanced Options (Extra Payment)";
  });

  toggleAllBtn.addEventListener('click', () => {
    showAll = !showAll;
    renderTable();
  });

  window.addEventListener('currencyChange', () => {
    if (loanInput.value) calculate();
  });

  loadState();
  if (loanInput.value && !isNaN(parseFloat(loanInput.value))) {
      calculate();
  }
});
