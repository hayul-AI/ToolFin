import { formatCurrencyDecimal } from './common.js';

/**
 * Goal Savings Planner
 * Calculates monthly savings needed to reach a target amount.
 */

const STORAGE_KEY = "toolfin_goal_savings_planner_v1";
const RENDER_CAP = 600;

document.addEventListener('DOMContentLoaded', () => {
    const targetInput = document.getElementById('target-amount');
    const yearsInput = document.getElementById('time-years');
    const monthsInput = document.getElementById('time-months');
    const startBalanceInput = document.getElementById('start-balance');
    const returnInput = document.getElementById('annual-return');
    const startDateInput = document.getElementById('start-date');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Display Elements
    const resMonthlySavings = document.getElementById('res-monthly-savings');
    const resEndingBalance = document.getElementById('res-ending-balance');
    const resTotalContributions = document.getElementById('res-total-contributions');
    const resTotalGrowth = document.getElementById('res-total-growth');
    const scheduleSection = document.getElementById('schedule-section');
    const scheduleBody = document.getElementById('schedule-body');
    const warningBanner = document.getElementById('warning-banner');
    const renderWarning = document.getElementById('render-warning');

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
            const data = JSON.parse(saved);
            targetInput.value = data.target || 50000;
            yearsInput.value = data.years || 5;
            monthsInput.value = data.months || 0;
            startBalanceInput.value = data.startBalance || 0;
            returnInput.value = data.annualReturn || 0;
            if (data.startDate) fp.setDate(data.startDate);
        }
    }

    function saveState() {
        const data = {
            target: targetInput.value,
            years: yearsInput.value,
            months: monthsInput.value,
            startBalance: startBalanceInput.value,
            annualReturn: returnInput.value,
            startDate: startDateInput.value
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function validate() {
        let valid = true;
        const target = parseFloat(targetInput.value);
        const years = parseInt(yearsInput.value) || 0;
        const months = parseInt(monthsInput.value) || 0;
        const totalMonths = (years * 12) + months;

        document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');

        if (isNaN(target) || target <= 0) {
            document.getElementById('err-target').style.display = 'block';
            valid = false;
        }
        if (totalMonths < 1) {
            document.getElementById('err-time').style.display = 'block';
            valid = false;
        }
        return valid;
    }

    function calculate() {
        if (!validate()) return;
        saveState();

        const targetAmount = parseFloat(targetInput.value);
        const years = parseInt(yearsInput.value) || 0;
        const months = parseInt(monthsInput.value) || 0;
        const totalMonths = (years * 12) + months;
        const startBalance = parseFloat(startBalanceInput.value) || 0;
        const annualReturn = parseFloat(returnInput.value) || 0;
        const startDate = fp.selectedDates[0] || new Date();

        const r = annualReturn / 100 / 12;
        const N = totalMonths;

        let requiredMonthly = 0;

        if (annualReturn === 0) {
            requiredMonthly = Math.max(0, (targetAmount - startBalance) / N);
        } else {
            // FV = startBalance*(1+r)^N + PMT * [((1+r)^N - 1)/r]
            // Solve for PMT
            const compoundFactor = Math.pow(1 + r, N);
            const annuityFactor = (compoundFactor - 1) / r;
            requiredMonthly = (targetAmount - (startBalance * compoundFactor)) / annuityFactor;
            
            if (requiredMonthly < 0) requiredMonthly = 0;
        }

        // Outputs
        resMonthlySavings.textContent = formatCurrencyDecimal(requiredMonthly);
        resEndingBalance.textContent = formatCurrencyDecimal(targetAmount);

        // Schedule Generation
        let balance = startBalance;
        let totalContributions = startBalance;
        let totalGrowth = 0;
        const schedule = [];

        for (let m = 1; m <= N; m++) {
            const growth = balance * r;
            balance = balance + growth + requiredMonthly;
            
            totalGrowth += growth;
            if (m > 0) totalContributions += requiredMonthly;

            if (m <= RENDER_CAP) {
                const date = new Date(startDate);
                date.setMonth(date.getMonth() + (m - 1));
                
                schedule.push({
                    month: m,
                    date: formatDate(date),
                    contribution: requiredMonthly,
                    growth: growth,
                    balance: balance
                });
            }
        }

        resTotalContributions.textContent = formatCurrencyDecimal(totalContributions);
        resTotalGrowth.textContent = formatCurrencyDecimal(totalGrowth);

        renderTable(schedule);
        
        scheduleSection.style.display = 'block';
        renderWarning.style.display = N > RENDER_CAP ? 'block' : 'none';
    }

    function renderTable(data) {
        scheduleBody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.month}</td>
                <td>${row.date}</td>
                <td>${formatCurrencyDecimal(row.contribution)}</td>
                <td>${formatCurrencyDecimal(row.growth)}</td>
                <td>${formatCurrencyDecimal(row.balance)}</td>
            `;
            scheduleBody.appendChild(tr);
        });
    }

    function formatDate(date) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }

    calculateBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    });

    window.addEventListener('currencyChange', () => {
        if (targetInput.value) calculate();
    });

    loadState();
    if (targetInput.value) calculate();
});
