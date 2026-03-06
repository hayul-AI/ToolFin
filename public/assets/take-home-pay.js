import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const salaryInput = document.getElementById('annual-salary');
  const frequencySelect = document.getElementById('pay-frequency');
  const filingSelect = document.getElementById('filing-status');
  const stateTaxInput = document.getElementById('state-tax-rate');
  const deductionsInput = document.getElementById('deductions');
  const calculateBtn = document.getElementById('calculate-btn');

  // Results
  const resPaycheck = document.getElementById('res-paycheck');
  const breakGross = document.getElementById('break-gross');
  const breakFed = document.getElementById('break-fed');
  const breakFica = document.getElementById('break-fica');
  const breakState = document.getElementById('break-state');
  const breakNet = document.getElementById('break-net');

  // 2024 Federal Tax Brackets (Simplified)
  const taxBrackets = {
    single: [
      { max: 11600, rate: 0.10 },
      { max: 47150, rate: 0.12 },
      { max: 100525, rate: 0.22 },
      { max: 191950, rate: 0.24 },
      { max: 243725, rate: 0.32 },
      { max: 609350, rate: 0.35 },
      { max: Infinity, rate: 0.37 }
    ],
    married: [
      { max: 23200, rate: 0.10 },
      { max: 94300, rate: 0.12 },
      { max: 201050, rate: 0.22 },
      { max: 383900, rate: 0.24 },
      { max: 487450, rate: 0.32 },
      { max: 731200, rate: 0.35 },
      { max: Infinity, rate: 0.37 }
    ],
    head: [
      { max: 16550, rate: 0.10 },
      { max: 63100, rate: 0.12 },
      { max: 100500, rate: 0.22 },
      { max: 191950, rate: 0.24 },
      { max: 243700, rate: 0.32 },
      { max: 609350, rate: 0.35 },
      { max: Infinity, rate: 0.37 }
    ]
  };

  // Standard Deductions (2024)
  const standardDeduction = {
    single: 14600,
    married: 29200,
    head: 21900
  };

  function calculateFederalTax(taxableIncome, status) {
    if (taxableIncome <= 0) return 0;
    
    let tax = 0;
    let previousMax = 0;
    const brackets = taxBrackets[status];

    for (const bracket of brackets) {
      if (taxableIncome > bracket.max) {
        tax += (bracket.max - previousMax) * bracket.rate;
        previousMax = bracket.max;
      } else {
        tax += (taxableIncome - previousMax) * bracket.rate;
        break;
      }
    }
    return tax;
  }

  function getPayPeriods(frequency) {
    switch(frequency) {
      case 'weekly': return 52;
      case 'biweekly': return 26;
      case 'semimonthly': return 24;
      case 'monthly': return 12;
      case 'annually': return 1;
      default: return 26;
    }
  }

  function calculate() {
    const grossSalary = parseFloat(salaryInput.value) || 0;
    const frequency = frequencySelect.value;
    const status = filingSelect.value;
    const stateRate = (parseFloat(stateTaxInput.value) || 0) / 100;
    const otherDeductionsMonthly = parseFloat(deductionsInput.value) || 0;

    if (grossSalary <= 0) return;

    // 1. Federal Tax
    const taxableIncome = Math.max(0, grossSalary - standardDeduction[status]);
    const fedTax = calculateFederalTax(taxableIncome, status);

    // 2. FICA (Social Security + Medicare)
    // SS: 6.2% on first $168,600 (2024 cap)
    // Medicare: 1.45% on all income
    const ssCap = 168600;
    const ssTax = Math.min(grossSalary, ssCap) * 0.062;
    const medTax = grossSalary * 0.0145;
    const ficaTax = ssTax + medTax;

    // 3. State Tax (Simplified Effective Rate)
    const stateTax = grossSalary * stateRate;

    // 4. Other Deductions (Annualized)
    const otherDeductionsAnnual = otherDeductionsMonthly * 12;

    // Total Deductions
    const totalDeductions = fedTax + ficaTax + stateTax + otherDeductionsAnnual;
    const netAnnual = Math.max(0, grossSalary - totalDeductions);

    // Paycheck Calculation
    const payPeriods = getPayPeriods(frequency);
    const payPerCheck = netAnnual / payPeriods;

    // Update UI
    resPaycheck.innerHTML = formatCurrencyDecimal(payPerCheck);
    
    breakGross.innerHTML = formatCurrencyDecimal(grossSalary);
    breakFed.innerHTML = formatCurrencyDecimal(fedTax);
    breakFica.innerHTML = formatCurrencyDecimal(ficaTax);
    breakState.innerHTML = formatCurrencyDecimal(stateTax);
    breakNet.innerHTML = formatCurrencyDecimal(netAnnual);
  }

  calculateBtn.addEventListener('click', calculate);
  
  // Auto-calculate on changes
  [frequencySelect, filingSelect].forEach(el => {
    el.addEventListener('change', calculate);
  });

  // Wiring currency change (global ToolFin pattern)
  window.addEventListener('currencyChange', () => {
    if (salaryInput.value) calculate();
  });

  // Initial
  calculate();
});
