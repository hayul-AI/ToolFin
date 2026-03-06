import { formatCurrency, formatCurrencyDecimal, getCurrency } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const inputs = [
    'home-price', 'down-payment', 'interest-rate', 'appreciation-rate',
    'monthly-rent', 'rent-increase', 'stay-years', 'investment-return'
  ];

  const elements = {};
  inputs.forEach(id => {
    elements[id] = document.getElementById(id);
  });

  const calculateBtn = document.getElementById('calculate-btn');
  const verdictDisplay = document.getElementById('comparison-verdict');
  const rentCostDisplay = document.getElementById('total-rent-cost');
  const buyCostDisplay = document.getElementById('total-buy-cost');
  const monthlyMortgageDisplay = document.getElementById('monthly-mortgage');
  const initialRentDisplay = document.getElementById('initial-rent');
  const equityGainedDisplay = document.getElementById('equity-gained');

  function calculate() {
    const homePrice = parseFloat(elements['home-price'].value) || 0;
    const downPercent = parseFloat(elements['down-payment'].value) || 0;
    const interestRate = (parseFloat(elements['interest-rate'].value) || 0) / 100 / 12;
    const appreciationRate = (parseFloat(elements['appreciation-rate'].value) || 0) / 100;
    const monthlyRent = parseFloat(elements['monthly-rent'].value) || 0;
    const rentIncrease = (parseFloat(elements['rent-increase'].value) || 0) / 100;
    const stayYears = parseInt(elements['stay-years'].value) || 1;
    const investmentReturn = (parseFloat(elements['investment-return'].value) || 0) / 100;

    const months = stayYears * 12;
    const downPayment = homePrice * (downPercent / 100);
    const loanAmount = homePrice - downPayment;
    
    // --- BUYING CALCULATION ---
    // Monthly P&I
    let monthlyPI = 0;
    if (interestRate > 0) {
      monthlyPI = (loanAmount * interestRate) / (1 - Math.pow(1 + interestRate, -360)); // Assumes 30yr fixed for mortgage calc
    } else {
      monthlyPI = loanAmount / 360;
    }

    // Recurring Buy Costs (Simplified estimates)
    const propertyTaxRate = 0.012; // 1.2% annual avg
    const insuranceRate = 0.004; // 0.4% annual avg
    const maintenanceRate = 0.01; // 1% annual avg
    
    let totalMortgagePaid = 0;
    let totalTaxInsMain = 0;
    let currentHomeValue = homePrice;
    let remainingLoan = loanAmount;

    for (let i = 1; i <= months; i++) {
      totalMortgagePaid += monthlyPI;
      // Monthly property tax, insurance, maintenance based on current value
      totalTaxInsMain += (currentHomeValue * (propertyTaxRate + insuranceRate + maintenanceRate)) / 12;
      
      // Amortization (remaining loan)
      const interestPayment = remainingLoan * interestRate;
      const principalPayment = monthlyPI - interestPayment;
      remainingLoan -= principalPayment;

      // Appreciation (monthly)
      if (i % 12 === 0) {
        currentHomeValue *= (1 + appreciationRate);
      }
    }

    const buyClosingCosts = homePrice * 0.03; // 3% buying costs
    const sellClosingCosts = currentHomeValue * 0.06; // 6% selling costs
    
    // Total Equity at end
    const finalEquity = currentHomeValue - remainingLoan - sellClosingCosts;
    const netBuyCost = (downPayment + buyClosingCosts + totalMortgagePaid + totalTaxInsMain) - finalEquity;

    // --- RENTING CALCULATION ---
    let totalRentPaid = 0;
    let currentRent = monthlyRent;
    for (let i = 1; i <= months; i++) {
      totalRentPaid += currentRent;
      if (i % 12 === 0) {
        currentRent *= (1 + rentIncrease);
      }
    }

    // Opportunity Cost (Down payment + buying closing costs grown over time)
    const initialInvested = downPayment + buyClosingCosts;
    const futureInvestmentValue = initialInvested * Math.pow(1 + investmentReturn, stayYears);
    const opportunityCost = futureInvestmentValue - initialInvested;
    
    const netRentCost = totalRentPaid + opportunityCost;

    // --- UI UPDATE ---
    rentCostDisplay.innerHTML = formatCurrencyDecimal(netRentCost);
    buyCostDisplay.innerHTML = formatCurrencyDecimal(netBuyCost);
    monthlyMortgageDisplay.innerHTML = formatCurrencyDecimal(monthlyPI);
    initialRentDisplay.innerHTML = formatCurrencyDecimal(monthlyRent);
    equityGainedDisplay.innerHTML = formatCurrencyDecimal(finalEquity - downPayment);

    if (netBuyCost < netRentCost) {
      verdictDisplay.innerHTML = "Buying is Better";
      verdictDisplay.style.color = "#2563eb";
    } else {
      verdictDisplay.innerHTML = "Renting is Better";
      verdictDisplay.style.color = "#0d9488";
    }
  }

  calculateBtn.addEventListener('click', calculate);
  inputs.forEach(id => elements[id].addEventListener('input', calculate));

  window.addEventListener('currencyChange', calculate);
  calculate();
});
