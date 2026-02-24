// ToolFin Common Functionality
export const currencies = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', name: 'Australian Dollar' }
};

let currentCurrency = 'USD';

export function getCurrency() {
  return currencies[currentCurrency];
}

export function setCurrency(code) {
  if (currencies[code]) {
    currentCurrency = code;
    // Dispatch event for components to update
    window.dispatchEvent(new CustomEvent('currencyChange', { detail: currencies[code] }));
  }
}

export function formatCurrency(amount) {
  const { symbol } = getCurrency();
  return `${symbol}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)}`;
}

export function formatCurrencyDecimal(amount) {
  const { symbol } = getCurrency();
  return `${symbol}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)}`;
}

// Global UI Setup
document.addEventListener('DOMContentLoaded', () => {
  const currencySelector = document.getElementById('currency-selector');
  if (currencySelector) {
    currencySelector.addEventListener('change', (e) => {
      setCurrency(e.target.value);
    });
  }

  // Update all prefix spans on currency change
  window.addEventListener('currencyChange', (e) => {
    const prefixes = document.querySelectorAll('.prefix.currency-symbol');
    prefixes.forEach(p => {
      p.textContent = e.detail.symbol;
    });
  });
});
