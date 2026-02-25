// ToolFin — Global currency dropdown options (canonical from existing full list)
// Formatting only. No live FX.
(function () {
  // ✅ Paste the FULL existing <option> list from the page that already shows ALL currencies
  const CANONICAL_OPTIONS_HTML = `
  <!-- BEGIN CANONICAL OPTIONS -->
  <option value="USD">USD — US Dollar ($)</option>
  <option value="EUR">EUR — Euro (€)</option>
  <option value="GBP">GBP — British Pound (£)</option>
  <option value="JPY">JPY — Japanese Yen (¥)</option>
  <option value="CNY">CNY — Chinese Yuan (¥)</option>
  <option value="KRW">KRW — South Korean Won (₩)</option>
  <option value="AUD">AUD — Australian Dollar (A$)</option>
  <option value="CAD">CAD — Canadian Dollar (C$)</option>
  <option value="NZD">NZD — New Zealand Dollar (NZ$)</option>
  <option value="CHF">CHF — Swiss Franc (CHF)</option>
  <option value="HKD">HKD — Hong Kong Dollar (HK$)</option>
  <option value="SGD">SGD — Singapore Dollar (S$)</option>
  <option value="TWD">TWD — Taiwan Dollar (NT$)</option>
  <option value="SEK">SEK — Swedish Krona (kr)</option>
  <option value="NOK">NOK — Norwegian Krone (kr)</option>
  <option value="DKK">DKK — Danish Krone (kr)</option>
  <option value="PLN">PLN — Polish Złoty (zł)</option>
  <option value="CZK">CZK — Czech Koruna (Kč)</option>
  <option value="HUF">HUF — Hungarian Forint (Ft)</option>
  <option value="RON">RON — Romanian Leu (lei)</option>
  <option value="BGN">BGN — Bulgarian Lev (лв)</option>
  <option value="TRY">TRY — Turkish Lira (₺)</option>
  <option value="ILS">ILS — Israeli Shekel (₪)</option>
  <option value="AED">AED — UAE Dirham (د.إ)</option>
  <option value="SAR">SAR — Saudi Riyal (﷼)</option>
  <option value="QAR">QAR — Qatari Riyal (﷼)</option>
  <option value="KWD">KWD — Kuwaiti Dinar (KD)</option>
  <option value="BHD">BHD — Bahraini Dinar (BD)</option>
  <option value="OMR">OMR — Omani Rial (﷼)</option>
  <option value="INR">INR — Indian Rupee (₹)</option>
  <option value="PKR">PKR — Pakistani Rupee (₨)</option>
  <option value="BDT">BDT — Bangladeshi Taka (৳)</option>
  <option value="LKR">LKR — Sri Lankan Rupee (₨)</option>
  <option value="THB">THB — Thai Baht (฿)</option>
  <option value="VND">VND — Vietnamese Dong (₫)</option>
  <option value="IDR">IDR — Indonesian Rupiah (Rp)</option>
  <option value="MYR">MYR — Malaysian Ringgit (RM)</option>
  <option value="PHP">PHP — Philippine Peso (₱)</option>
  <option value="ZAR">ZAR — South African Rand (R)</option>
  <option value="EGP">EGP — Egyptian Pound (E£)</option>
  <option value="NGN">NGN — Nigerian Naira (₦)</option>
  <option value="KES">KES — Kenyan Shilling (KSh)</option>
  <option value="GHS">GHS — Ghanaian Cedi (₵)</option>
  <option value="MAD">MAD — Moroccan Dirham (MAD)</option>
  <option value="RUB">RUB — Russian Ruble (₽)</option>
  <option value="UAH">UAH — Ukrainian Hryvnia (₴)</option>
  <option value="BRL">BRL — Brazilian Real (R$)</option>
  <option value="ARS">ARS — Argentine Peso ($)</option>
  <option value="CLP">CLP — Chilean Peso ($)</option>
  <option value="COP">COP — Colombian Peso ($)</option>
  <option value="PEN">PEN — Peruvian Sol (S/)</option>
  <option value="MXN">MXN — Mexican Peso ($)</option>
  <!-- END CANONICAL OPTIONS -->
  `;

  function getSavedCurrency() {
    try {
      return localStorage.getItem("toolfin_preferred_currency") || localStorage.getItem("currency") || "";
    } catch (e) { return ""; }
  }

  function saveCurrency(code) {
    try {
      localStorage.setItem("toolfin_preferred_currency", code);
      localStorage.setItem("currency", code);
    } catch (e) {}
  }

  function findCurrencySelects() {
    const sels = [];
    const byId = document.getElementById("currency-selector") || document.getElementById("currencySelect");
    if (byId) sels.push(byId);

    document.querySelectorAll("[data-currency-select], .currency-select").forEach(el => {
      if (el && el.tagName === "SELECT" && !sels.includes(el)) sels.push(el);
    });

    // fallback: any header select that contains US Dollar text
    document.querySelectorAll("select").forEach(el => {
      if (sels.includes(el)) return;
      const txt = (el.textContent || "");
      if (txt.includes("US Dollar") && txt.includes("USD")) sels.push(el);
    });

    return sels;
  }

  function normalizeSelected(sel) {
    const saved = getSavedCurrency();
    const current = sel.value || saved || "USD";
    const has = Array.from(sel.options).some(o => o.value === current);
    sel.value = has ? current : "USD";
    saveCurrency(sel.value);
  }

  function applyCanonicalOptions(sel) {
    // preserve current selection if possible
    const current = sel.value || getSavedCurrency() || "USD";

    sel.innerHTML = CANONICAL_OPTIONS_HTML.trim();

    // restore selection
    const has = Array.from(sel.options).some(o => o.value === current);
    sel.value = has ? current : "USD";
    saveCurrency(sel.value);

    // bind change
    sel.addEventListener("change", () => saveCurrency(sel.value));
  }

  function init() {
    const selects = findCurrencySelects();
    if (!selects.length) return;

    selects.forEach(applyCanonicalOptions);
    selects.forEach(normalizeSelected);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
