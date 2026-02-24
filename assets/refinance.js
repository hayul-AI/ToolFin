import { formatCurrencyDecimal } from './common.js';

/**
 * Refinance Calculator Logic
 * Calculates monthly savings, break-even point, and lifetime benefits.
 */

const STORAGE_KEY = "toolfin_refinance_v1";

document.addEventListener('DOMContentLoaded', () => {
    // Set page identifier
    document.body.dataset.page = "refinance";

    const balanceInput = document.getElementById('loan-balance');
    const currentRateInput = document.getElementById('current-rate');
    const newRateInput = document.getElementById('new-rate');
    const termInput = document.getElementById('remaining-term');
    const closingCostsInput = document.getElementById('closing-costs');
    const calculateBtn = document.getElementById('calculate-btn');

    // Result Elements
    const resBreakEven = document.getElementById('res-break-even');
    const resMonthlySavings = document.getElementById('res-monthly-savings');
    const resLifetimeSavings = document.getElementById('res-lifetime-savings');
    const resOldPayment = document.getElementById('res-old-payment');
    const resNewPayment = document.getElementById('res-new-payment');

    function loadState() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            if (balanceInput) balanceInput.value = data.balance || 300000;
            if (currentRateInput) currentRateInput.value = data.currentRate || 6.5;
            if (newRateInput) newRateInput.value = data.newRate || 5.5;
            if (termInput) termInput.value = data.term || 25;
            if (closingCostsInput) closingCostsInput.value = data.closingCosts || 5000;
        }
    }

    function saveState() {
        const data = {
            balance: balanceInput.value,
            currentRate: currentRateInput.value,
            newRate: newRateInput.value,
            term: termInput.value,
            closingCosts: closingCostsInput.value
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function calculatePayment(principal, annualRate, months) {
        const r = (annualRate / 100) / 12;
        if (r === 0) return principal / months;
        return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    }

    function calculate() {
        saveState();

        const principal = parseFloat(balanceInput.value) || 0;
        const oldRate = parseFloat(currentRateInput.value) || 0;
        const newRate = parseFloat(newRateInput.value) || 0;
        const termYears = parseInt(termInput.value) || 0;
        const closingCosts = parseFloat(closingCostsInput.value) || 0;

        if (principal <= 0 || termYears <= 0) return;

        const months = termYears * 12;
        const oldPayment = calculatePayment(principal, oldRate, months);
        const newPayment = calculatePayment(principal, newRate, months);
        const monthlySavings = oldPayment - newPayment;

        // Render Results
        resOldPayment.textContent = formatCurrencyDecimal(oldPayment);
        resNewPayment.textContent = formatCurrencyDecimal(newPayment);
        resMonthlySavings.textContent = formatCurrencyDecimal(monthlySavings);

        if (monthlySavings > 0.01) {
            const breakEven = closingCosts / monthlySavings;
            resBreakEven.textContent = breakEven > 1200 ? "Never" : `${Math.ceil(breakEven)} Months`;
            resBreakEven.style.color = "#10b981";

            const lifetimeSavings = (monthlySavings * months) - closingCosts;
            resLifetimeSavings.textContent = formatCurrencyDecimal(lifetimeSavings);
            resLifetimeSavings.style.color = lifetimeSavings > 0 ? "#10b981" : "#e11d48";
        } else {
            resBreakEven.textContent = "N/A";
            resBreakEven.style.color = "#64748b";
            resLifetimeSavings.textContent = formatCurrencyDecimal((monthlySavings * months) - closingCosts);
            resLifetimeSavings.style.color = "#e11d48";
        }
    }

    // Wiring currency change (global ToolFin pattern)
    window.addEventListener('currencyChange', () => {
        calculate();
    });

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculate);
    }

    loadState();
    calculate();
});
