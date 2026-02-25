// ToolFin Amortization Schedule Placeholder JS
document.addEventListener('DOMContentLoaded', () => {
  document.body.dataset.page = "amortization-schedule";
  
  const STORAGE_KEY = "toolfin_amortization_placeholder_v1";
  
  const inputs = {
    loanAmount: document.getElementById('loan-amount'),
    interestRate: document.getElementById('interest-rate'),
    loanTerm: document.getElementById('loan-term'),
    startDate: document.getElementById('start-date'),
    extraPayment: document.getElementById('extra-payment')
  };
  
  const generateBtn = document.getElementById('generate-btn');
  const resetBtn = document.getElementById('reset-btn');
  const statusNotice = document.getElementById('status-notice');
  
  // Load saved state
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    try {
      const data = JSON.parse(savedState);
      Object.keys(inputs).forEach(key => {
        if (data[key] !== undefined && inputs[key]) {
          inputs[key].value = data[key];
        }
      });
    } catch (e) {
      console.error("Error loading saved state", e);
    }
  }
  
  // Save state on change
  Object.values(inputs).forEach(input => {
    if (input) {
      input.addEventListener('change', () => {
        const state = {};
        Object.keys(inputs).forEach(key => {
          state[key] = inputs[key].value;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      });
    }
  });
  
  // Reset functionality
  resetBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    Object.values(inputs).forEach(input => {
      if (input) input.value = "";
    });
    statusNotice.textContent = "";
  });
  
  // Generate button stub
  generateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    statusNotice.textContent = "Schedule generation is being finalized.";
    statusNotice.style.color = "var(--primary)";
    
    // Optional: Scroll to results
    const resultsPanel = document.getElementById('results');
    if (resultsPanel) {
      resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  // Currency selection integration (formatting only)
  window.addEventListener('currencyChange', (e) => {
    // This will be handled by common.js for prefix spans
    // If we had a live engine, we would recalculate here.
  });
});
