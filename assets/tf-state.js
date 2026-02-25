// assets/tf-state.js
(function() {
  console.log("ToolFin State Module Loading...");

  function injectUI() {
    const main = document.querySelector('main');
    if (!main) return;
    
    // Broaden check: any input or select within main
    const inputs = main.querySelectorAll('input, select');
    if (inputs.length === 0) return;
    
    // Prevent double injection
    if (document.getElementById('tf-state-actions')) return;
    
    console.log("ToolFin State: Injecting UI below results...");

    // Create UI container
    const uiContainer = document.createElement('div');
    uiContainer.id = 'tf-state-actions';
    uiContainer.className = 'container'; 
    uiContainer.style.display = 'flex';
    uiContainer.style.flexWrap = 'wrap';
    uiContainer.style.gap = '12px';
    uiContainer.style.padding = '25px 0';
    uiContainer.style.justifyContent = 'center'; // Center for better readability below results
    uiContainer.style.position = 'relative';
    uiContainer.style.zIndex = '100';
    
    const btnStyle = "background: #ffffff; border: 1px solid #e2e8f0; padding: 12px 20px; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 14px; color: #1e293b; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 8px;";
    const primaryBtnStyle = "background: #0061FF; border: 1px solid #004ecc; padding: 12px 20px; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 14px; color: white; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(0,97,255,0.2); display: flex; align-items: center; gap: 8px;";
    
    uiContainer.innerHTML = `
      <button id="tf-btn-save" style="${btnStyle}"><span>💾</span> Save Data</button>
      <button id="tf-btn-load" style="${btnStyle}"><span>📂</span> Load Data</button>
      <button id="tf-btn-clear" style="${btnStyle} color: #e11d48;"><span>🗑️</span> Reset</button>
      <button id="tf-btn-export" style="${primaryBtnStyle}"><span>📄</span> Export PDF Report</button>
    `;
    
    // Logic to find the "Results" area
    const resultsSelectors = ['.results-panel', '#results-area', '#results', '.output-card', '#results-section'];
    let targetElement = null;
    
    for (const selector of resultsSelectors) {
      const el = document.querySelector(selector);
      if (el) {
        // If it's inside a card, we want to be after the card
        const card = el.closest('.card');
        targetElement = card || el;
        break;
      }
    }

    // If no specific results area found, find the last card in the main calculator area
    if (!targetElement) {
      const allCards = main.querySelectorAll('.card');
      if (allCards.length > 0) {
        // Try to avoid cards in educational/faq sections
        const calcSection = document.getElementById('calculator-section') || document.querySelector('.calc-grid')?.closest('section');
        if (calcSection) {
          targetElement = calcSection;
        } else {
          targetElement = allCards[0]; // Usually the first big card is the calculator
        }
      }
    }

    // Injection
    if (targetElement) {
      targetElement.after(uiContainer);
    } else {
      // Last resort fallback
      main.prepend(uiContainer);
    }

    // Bind events
    document.getElementById('tf-btn-save').addEventListener('click', saveState);
    document.getElementById('tf-btn-load').addEventListener('click', loadState);
    document.getElementById('tf-btn-clear').addEventListener('click', clearState);
    document.getElementById('tf-btn-export').addEventListener('click', () => {
      if (typeof window.exportToPDF === 'function') {
        window.exportToPDF();
      } else {
        alert('Export module is still loading. Please try again.');
      }
    });

    // Hover effects
    const btns = [
      { id: 'tf-btn-save', bg: '#ffffff', hov: '#f8fafc' },
      { id: 'tf-btn-load', bg: '#ffffff', hov: '#f8fafc' },
      { id: 'tf-btn-clear', bg: '#ffffff', hov: '#fff1f2' }
    ];
    btns.forEach(b => {
      const el = document.getElementById(b.id);
      el.onmouseover = () => { el.style.transform = 'translateY(-2px)'; el.style.background = b.hov; };
      el.onmouseout = () => { el.style.transform = 'translateY(0)'; el.style.background = b.bg; };
    });
    
    const exportBtn = document.getElementById('tf-btn-export');
    exportBtn.onmouseover = () => {
      exportBtn.style.background = '#004ecc';
      exportBtn.style.transform = 'translateY(-2px)';
      exportBtn.style.boxShadow = '0 10px 15px -3px rgba(0,97,255,0.3)';
    };
    exportBtn.onmouseout = () => {
      exportBtn.style.background = '#0061FF';
      exportBtn.style.transform = 'translateY(0)';
      exportBtn.style.boxShadow = '0 4px 6px -1px rgba(0,97,255,0.2)';
    };
  }

  function getStorageKey() {
    return 'tf_state_' + window.location.pathname;
  }

  function getInputs() {
    const main = document.querySelector('main');
    const inputs = main.querySelectorAll('input, select, textarea');
    return Array.from(inputs).filter(i => i.id && i.type !== 'button' && i.type !== 'submit' && i.id !== 'currency-selector');
  }

  function saveState() {
    const inputs = getInputs();
    const state = {};
    inputs.forEach(input => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        state[input.id] = input.checked;
      } else {
        state[input.id] = input.value;
      }
    });
    localStorage.setItem(getStorageKey(), JSON.stringify(state));
    
    const btn = document.getElementById('tf-btn-save');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<span>✅</span> Saved!';
    setTimeout(() => { btn.innerHTML = originalContent; }, 2000);
  }

  function loadState() {
    const stateStr = localStorage.getItem(getStorageKey());
    if (!stateStr) {
      alert('No saved data found for this calculator.');
      return;
    }
    try {
      const state = JSON.parse(stateStr);
      const inputs = getInputs();
      inputs.forEach(input => {
        if (state[input.id] !== undefined) {
          if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = state[input.id];
          } else {
            input.value = state[input.id];
          }
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      setTimeout(triggerCalculate, 100);
      
      const btn = document.getElementById('tf-btn-load');
      const originalContent = btn.innerHTML;
      btn.innerHTML = '<span>✅</span> Loaded!';
      setTimeout(() => { btn.innerHTML = originalContent; }, 2000);
    } catch(e) {
      console.error('ToolFin State: Load failed', e);
    }
  }

  function clearState() {
    if (confirm('Clear all inputs and saved data?')) {
      localStorage.removeItem(getStorageKey());
      location.reload();
    }
  }

  function triggerCalculate() {
    const calcBtn = document.querySelector('#calculate-btn, #calculate, .calculate-btn, button[id*="calc"]');
    if (calcBtn) calcBtn.click();
  }

  if (document.readyState === 'complete') {
    setTimeout(injectUI, 600);
  } else {
    window.addEventListener('load', () => setTimeout(injectUI, 600));
  }
})();
