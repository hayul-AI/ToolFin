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

export function formatCurrency(amount, decimalPlaces = 0, asHtml = true) {
  const locale = navigator.language || 'en-US';
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currentCurrencyCode,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });

    if (decimalPlaces === 0) return formatter.format(amount);

    if (!asHtml) return formatter.format(amount);

    return formatter.formatToParts(amount).map(part => {
      if (part.type === 'fraction') return `<span class="decimal-small">${part.value}</span>`;
      return part.value;
    }).join('');
  } catch (e) {
    const symbol = getCurrencySymbol(currentCurrencyCode);
    const fixed = amount.toFixed(decimalPlaces);
    if (decimalPlaces > 0) {
      if (!asHtml) return `${symbol}${fixed}`;
      const parts = fixed.split('.');
      return `${symbol}${parts[0]}.<span class="decimal-small">${parts[1]}</span>`;
    }
    return `${symbol}${fixed}`;
  }
}

export function formatCurrencyDecimal(amount, asHtml = true) {
  return formatCurrency(amount, 2, asHtml);
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
