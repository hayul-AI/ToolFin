import { formatCurrencyDecimal } from './common.js';

/**
 * APR Calculator
 * Calculates the true Annual Percentage Rate by including upfront fees.
 */

const STORAGE_KEY = "toolfin_apr_calc_v1";

document.addEventListener('DOMContentLoaded', () => {
  const loanInput = document.getElementById('loan-amount');
  const rateInput = document.getElementById('interest-rate');
  const termInput = document.getElementById('loan-term');
  const feesInput = document.getElementById('upfront-fees');
  const calculateBtn = document.getElementById('calculate-btn');
  const resetBtn = document.getElementById('reset-btn');

  // Result Displays
  const resAPR = document.getElementById('res-apr');
  const resPayment = document.getElementById('res-payment');
  const resTotalInterest = document.getElementById('res-total-interest');
  const resTotalCost = document.getElementById('res-total-cost');
  
  // Breakdown Displays
  const breakdownSection = document.getElementById('breakdown-section');
  const breakPrincipal = document.getElementById('break-principal');
  const breakFees = document.getElementById('break-fees');
  const breakInterest = document.getElementById('break-interest');
  const breakTotal = document.getElementById('break-total');

  function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      loanInput.value = data.loanAmount || 250000;
      rateInput.value = data.interestRate || 6.5;
      termInput.value = data.loanTerm || 30;
      feesInput.value = data.upfrontFees || 5000;
    }
  }

  function saveState() {
    const data = {
      loanAmount: loanInput.value,
      interestRate: rateInput.value,
      loanTerm: termInput.value,
      upfrontFees: feesInput.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function validate() {
    let valid = true;
    const loan = parseFloat(loanInput.value);
    const rate = parseFloat(rateInput.value);
    const term = parseFloat(termInput.value);

    document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');

    if (isNaN(loan) || loan <= 0) {
      document.getElementById('err-loan-amount').style.display = 'block';
      valid = false;
    }
    if (isNaN(rate) || rate < 0 || rate > 100) {
      document.getElementById('err-rate').style.display = 'block';
      valid = false;
    }
    return valid;
  }

  /**
   * Solve for APR using Newton's method
   */
  function deriveAPR(principal, fees, monthlyPayment, totalMonths) {
    const netProceeds = principal - fees;
    if (netProceeds <= 0) return 0;

    let r = (monthlyPayment / netProceeds); // Initial guess
    const tolerance = 0.0000001;
    const maxIterations = 100;

    for (let i = 0; i < maxIterations; i++) {
      // f(r) = PMT * (1 - (1+r)^-n) / r - NetProceeds
      // We want f(r) = 0
      const powTerm = Math.pow(1 + r, -totalMonths);
      const f = monthlyPayment * (1 - powTerm) / r - netProceeds;
      
      // Derivative f'(r)
      const df = monthlyPayment * ((totalMonths * powTerm / (1 + r) / r) - ((1 - powTerm) / (Math.pow(r, 2))));
      
      const nextR = r - f / df;
      if (Math.abs(nextR - r) < tolerance) {
        return nextR * 12 * 100;
      }
      r = nextR;
    }
    return r * 12 * 100;
  }

  function calculate() {
    if (!validate()) return;
    saveState();

    const principal = parseFloat(loanInput.value);
    const nominalRate = parseFloat(rateInput.value) / 100;
    const termYears = parseInt(termInput.value);
    const fees = parseFloat(feesInput.value) || 0;

    const totalMonths = termYears * 12;
    const monthlyRate = nominalRate / 12;

    let monthlyPayment = 0;
    if (nominalRate > 0) {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      monthlyPayment = principal / totalMonths;
    }

    const totalPaid = monthlyPayment * totalMonths;
    const totalInterest = totalPaid - principal;
    const calculatedAPR = deriveAPR(principal, fees, monthlyPayment, totalMonths);

    // Render Results
    resAPR.textContent = calculatedAPR.toFixed(3) + '%';
    resPayment.textContent = formatCurrencyDecimal(monthlyPayment);
    resTotalInterest.textContent = formatCurrencyDecimal(totalInterest);
    resTotalCost.textContent = formatCurrencyDecimal(totalPaid + fees);

    // Breakdown
    breakPrincipal.textContent = formatCurrencyDecimal(principal);
    breakFees.textContent = formatCurrencyDecimal(fees);
    breakInterest.textContent = formatCurrencyDecimal(totalInterest);
    breakTotal.textContent = formatCurrencyDecimal(totalPaid + fees);

    breakdownSection.style.display = 'block';
  }

  calculateBtn.addEventListener('click', calculate);
  resetBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });

  loadState();
  if (loanInput.value) calculate();
});
