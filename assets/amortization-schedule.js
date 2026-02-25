import { formatCurrencyDecimal } from './common.js';

/**
 * Amortization Schedule Tool
 */

const STORAGE_KEY = "toolfin_amortization_planner_v1";

document.addEventListener('DOMContentLoaded', () => {
    const loanAmountInput = document.getElementById('loan-amount');
    const interestRateInput = document.getElementById('interest-rate');
    const loanTermInput = document.getElementById('loan-term');
    const startDateInput = document.getElementById('start-date');
    const extraPaymentInput = document.getElementById('extra-payment');
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const statusNotice = document.getElementById('status-notice');
    const resultsContainer = document.getElementById('results');

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
        disableMobile: true
    });

    function loadState() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.amount) loanAmountInput.value = data.amount;
                if (data.rate) interestRateInput.value = data.rate;
                if (data.term) loanTermInput.value = data.term;
                if (data.extra) extraPaymentInput.value = data.extra;
                if (data.start) fp.setDate(data.start);
            } catch (e) {
                console.error("Error loading state", e);
            }
        }
    }

    function saveState() {
        const data = {
            amount: loanAmountInput.value,
            rate: interestRateInput.value,
            term: loanTermInput.value,
            extra: extraPaymentInput.value,
            start: startDateInput.value
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function calculate() {
        const principal = parseFloat(loanAmountInput.value);
        const annualRate = parseFloat(interestRateInput.value) / 100;
        const years = parseInt(loanTermInput.value);
        const extraMonthly = parseFloat(extraPaymentInput.value) || 0;
        const startDate = fp.selectedDates[0] || new Date();

        if (isNaN(principal) || isNaN(annualRate) || isNaN(years) || principal <= 0 || annualRate < 0 || years <= 0) {
            statusNotice.textContent = "Please enter valid loan details.";
            statusNotice.style.color = "#e11d48";
            return;
        }

        saveState();
        statusNotice.textContent = "";

        const monthlyRate = annualRate / 12;
        const totalPayments = years * 12;
        
        // Monthly Payment Formula: P * (r * (1+r)^n) / ((1+r)^n - 1)
        let monthlyPayment = 0;
        if (monthlyRate === 0) {
            monthlyPayment = principal / totalPayments;
        } else {
            monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
        }

        let balance = principal;
        const schedule = [];
        let currentDate = new Date(startDate);

        for (let i = 1; i <= 1200; i++) { // Cap at 100 years
            const interestPayment = balance * monthlyRate;
            let principalPayment = (monthlyPayment - interestPayment) + extraMonthly;
            
            if (principalPayment > balance) {
                principalPayment = balance;
            }

            balance -= principalPayment;

            schedule.push({
                date: formatDate(currentDate),
                payment: interestPayment + principalPayment,
                interest: interestPayment,
                principal: principalPayment,
                balance: Math.max(0, balance)
            });

            if (balance <= 0) break;
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        renderSchedule(schedule);
    }

    function renderSchedule(schedule) {
        resultsContainer.innerHTML = `
            <div class="table-container" style="overflow-x: auto; max-height: 600px; overflow-y: auto;">
              <table class="tf-table">
                <thead style="position: sticky; top: 0; background: #fff; z-index: 10;">
                  <tr>
                    <th>Date</th>
                    <th>Payment</th>
                    <th>Interest</th>
                    <th>Principal</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  ${schedule.map(row => `
                    <tr>
                      <td>${row.date}</td>
                      <td>${formatCurrencyDecimal(row.payment)}</td>
                      <td>${formatCurrencyDecimal(row.interest)}</td>
                      <td>${formatCurrencyDecimal(row.principal)}</td>
                      <td>${formatCurrencyDecimal(row.balance)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
        `;
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function formatDate(date) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }

    generateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        calculate();
    });

    resetBtn.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    });

    loadState();
});
