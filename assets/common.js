// ToolFin Common Functionality

export const currencySymbols = {
USD:"$", EUR:"€", GBP:"£", JPY:"¥", CNY:"¥", KRW:"₩",
AUD:"A$", CAD:"C$", NZD:"NZ$", CHF:"CHF",
HKD:"HK$", SGD:"S$", TWD:"NT$",
SEK:"kr", NOK:"kr", DKK:"kr",
PLN:"zł", CZK:"Kč", HUF:"Ft", RON:"lei", BGN:"лв",
TRY:"₺", ILS:"₪",
AED:"د.إ", SAR:"﷼", QAR:"﷼", KWD:"KD", BHD:"BD", OMR:"﷼",
INR:"₹", PKR:"₨", BDT:"৳", LKR:"₨",
THB:"฿", VND:"₫", IDR:"Rp", MYR:"RM", PHP:"₱",
ZAR:"R", EGP:"E£", NGN:"₦", KES:"KSh", GHS:"₵", MAD:"MAD",
RUB:"₽", UAH:"₴",
BRL:"R$", ARS:"$", CLP:"$", COP:"$", PEN:"S/", MXN:"$"
};

// Map symbols back to the expected currencies format for backward compatibility
export const currencies = Object.keys(currencySymbols).reduce((acc, code) => {
  acc[code] = { symbol: currencySymbols[code], name: code }; // Name is defaulted to code
  return acc;
}, {});

let currentCurrencyCode = 'USD';

export function getCurrencyCode() {
  return currentCurrencyCode;
}

export function getCurrency() {
  return currencies[currentCurrencyCode] || { symbol: "$", name: "USD" };
}

export function getCurrencySymbol(code) {
  return currencySymbols[code] || "$";
}

export function setCurrency(code) {
  if (currencySymbols[code]) {
    currentCurrencyCode = code;
    // Dispatch event for components to update
    window.dispatchEvent(new CustomEvent('currencyChange', { 
      detail: { 
        code, 
        symbol: getCurrencySymbol(code),
        name: code
      } 
    }));
  }
}

export function formatCurrency(amount, decimalPlaces = 0) {
  const locale = navigator.language || 'en-US';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currentCurrencyCode,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    }).format(amount);
  } catch (e) {
    // Fallback if currency code is not supported by Intl
    const symbol = getCurrencySymbol(currentCurrencyCode);
    return `${symbol}${amount.toFixed(decimalPlaces)}`;
  }
}

export function formatCurrencyDecimal(amount) {
  return formatCurrency(amount, 2);
}

// Global UI Setup
document.addEventListener('DOMContentLoaded', () => {
  const currencySelector = document.getElementById('currency-selector');
  if (currencySelector) {
    // Load saved currency from localStorage if available
    const savedCurrency = localStorage.getItem('toolfin_preferred_currency');
    if (savedCurrency && currencySymbols[savedCurrency]) {
      currentCurrencyCode = savedCurrency;
      currencySelector.value = savedCurrency;
    }

    currencySelector.addEventListener('change', (e) => {
      const code = e.target.value;
      setCurrency(code);
      localStorage.setItem('toolfin_preferred_currency', code);
    });
  }

  // Update all prefix spans on currency change
  window.addEventListener('currencyChange', (e) => {
    const prefixes = document.querySelectorAll('.prefix.currency-symbol');
    prefixes.forEach(p => {
      p.textContent = e.detail.symbol;
    });
  });

  // Initial trigger to set symbols if they aren't default
  if (currentCurrencyCode !== 'USD') {
    setCurrency(currentCurrencyCode);
  }
});
