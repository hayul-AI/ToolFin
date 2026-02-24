// ToolFin Common Functionality
export const currencies = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  CNY: { symbol: '¥', name: 'Chinese Yuan' },
  KRW: { symbol: '₩', name: 'South Korean Won' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
  AUD: { symbol: 'A$', name: 'Australian Dollar' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar' },
  NZD: { symbol: 'NZ$', name: 'New Zealand Dollar' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc' },
  SEK: { symbol: 'kr', name: 'Swedish Krona' },
  NOK: { symbol: 'kr', name: 'Norwegian Krone' },
  DKK: { symbol: 'kr', name: 'Danish Krone' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar' },
  HKD: { symbol: 'HK$', name: 'Hong Kong Dollar' },
  TWD: { symbol: 'NT$', name: 'New Taiwan Dollar' },
  THB: { symbol: '฿', name: 'Thai Baht' },
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit' },
  IDR: { symbol: 'Rp', name: 'Indonesian Rupiah' },
  PHP: { symbol: '₱', name: 'Philippine Peso' },
  VND: { symbol: '₫', name: 'Vietnamese Dong' },
  MXN: { symbol: '$', name: 'Mexican Peso' },
  BRL: { symbol: 'R$', name: 'Brazilian Real' },
  ARS: { symbol: '$', name: 'Argentine Peso' },
  CLP: { symbol: '$', name: 'Chilean Peso' },
  COP: { symbol: '$', name: 'Colombian Peso' },
  PEN: { symbol: 'S/', name: 'Peruvian Sol' },
  ZAR: { symbol: 'R', name: 'South African Rand' },
  EGP: { symbol: 'E£', name: 'Egyptian Pound' },
  NGN: { symbol: '₦', name: 'Nigerian Naira' },
  KES: { symbol: 'KSh', name: 'Kenyan Shilling' },
  AED: { symbol: 'د.إ', name: 'United Arab Emirates Dirham' },
  SAR: { symbol: '﷼', name: 'Saudi Riyal' },
  QAR: { symbol: '﷼', name: 'Qatari Riyal' },
  KWD: { symbol: 'KD', name: 'Kuwaiti Dinar' },
  BHD: { symbol: 'BD', name: 'Bahraini Dinar' },
  OMR: { symbol: '﷼', name: 'Omani Rial' },
  ILS: { symbol: '₪', name: 'Israeli New Shekel' },
  TRY: { symbol: '₺', name: 'Turkish Lira' },
  PLN: { symbol: 'zł', name: 'Polish Zloty' },
  CZK: { symbol: 'Kč', name: 'Czech Koruna' },
  HUF: { symbol: 'Ft', name: 'Hungarian Forint' },
  RON: { symbol: 'lei', name: 'Romanian Leu' },
  BGN: { symbol: 'лв', name: 'Bulgarian Lev' },
  UAH: { symbol: '₴', name: 'Ukrainian Hryvnia' },
  RUB: { symbol: '₽', name: 'Russian Ruble' },
  ISK: { symbol: 'kr', name: 'Icelandic Krona' },
  PKR: { symbol: '₨', name: 'Pakistani Rupee' },
  BDT: { symbol: '৳', name: 'Bangladeshi Taka' },
  LKR: { symbol: 'Rs', name: 'Sri Lankan Rupee' },
  MAD: { symbol: 'DH', name: 'Moroccan Dirham' },
  TND: { symbol: 'DT', name: 'Tunisian Dinar' }
};

let currentCurrencyCode = 'USD';

export function getCurrencyCode() {
  return currentCurrencyCode;
}

export function getCurrency() {
  return currencies[currentCurrencyCode];
}

export function setCurrency(code) {
  if (currencies[code]) {
    currentCurrencyCode = code;
    // Dispatch event for components to update
    window.dispatchEvent(new CustomEvent('currencyChange', { detail: { code, ...currencies[code] } }));
  }
}

export function formatCurrency(amount, decimalPlaces = 0) {
  const locale = navigator.language || 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currentCurrencyCode,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(amount);
}

export function formatCurrencyDecimal(amount) {
  return formatCurrency(amount, 2);
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
