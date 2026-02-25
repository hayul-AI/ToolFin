// assets/tf-state.js
(function() {
  console.log("ToolFin State Module Loading...");

  function injectUI() {
    const main = document.querySelector('main');
    if (!main) {
      console.log("ToolFin State: No <main> element found. Skipping injection.");
      return;
    }
    
    // Broaden check: any input or select within main (excluding those in header/footer)
    const inputs = main.querySelectorAll('input, select');
    if (inputs.length === 0) {
      console.log("ToolFin State: No inputs found in <main>. Skipping injection.");
      return;
    }
    
    // Prevent double injection
    if (document.getElementById('tf-state-actions')) return;
    
    console.log("ToolFin State: Injecting UI...");

    // Create UI container
    const uiContainer = document.createElement('div');
    uiContainer.id = 'tf-state-actions';
    uiContainer.className = 'container'; // Use site container for alignment
    uiContainer.style.display = 'flex';
    uiContainer.style.flexWrap = 'wrap';
    uiContainer.style.gap = '10px';
    uiContainer.style.padding = '15px 0';
    uiContainer.style.justifyContent = 'flex-end';
    uiContainer.style.position = 'relative';
    uiContainer.style.zIndex = '100';
    
    const btnStyle = "background: #ffffff; border: 1px solid #e2e8f0; padding: 10px 18px; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 14px; color: #1e293b; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 6px;";
    const primaryBtnStyle = "background: #0061FF; border: 1px solid #004ecc; padding: 10px 18px; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 14px; color: white; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(0,97,255,0.2); display: flex; align-items: center; gap: 6px;";
    
    uiContainer.innerHTML = `
      <button id="tf-btn-save" style="${btnStyle}"><span>💾</span> Save Data</button>
      <button id="tf-btn-load" style="${btnStyle}"><span>📂</span> Load Data</button>
      <button id="tf-btn-clear" style="${btnStyle} color: #e11d48;"><span>🗑️</span> Reset</button>
      <button id="tf-btn-export" style="${primaryBtnStyle}"><span>📄</span> Export PDF</button>
    `;
    
    // Standard insertion: always at the top of main, or after breadcrumbs if they exist
    const breadcrumbs = main.querySelector('nav');
    if (breadcrumbs && breadcrumbs.parentNode === main) {
      breadcrumbs.after(uiContainer);
    } else {
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
        alert('Export module is still loading. Please try again in a moment.');
      }
    });

    // Hover effects
    [document.getElementById('tf-btn-save'), document.getElementById('tf-btn-load'), document.getElementById('tf-btn-clear')].forEach(btn => {
      btn.onmouseover = () => btn.style.transform = 'translateY(-1px)';
      btn.onmouseout = () => btn.style.transform = 'translateY(0)';
    });
    const exportBtn = document.getElementById('tf-btn-export');
    exportBtn.onmouseover = () => {
      exportBtn.style.background = '#004ecc';
      exportBtn.style.transform = 'translateY(-1px)';
    };
    exportBtn.onmouseout = () => {
      exportBtn.style.background = '#0061FF';
      exportBtn.style.transform = 'translateY(0)';
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
      let count = 0;
      inputs.forEach(input => {
        if (state[input.id] !== undefined) {
          if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = state[input.id];
          } else {
            input.value = state[input.id];
          }
          // trigger events for calculations to update
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          count++;
        }
      });
      
      // Auto-calculate
      setTimeout(triggerCalculate, 100);
      
      const btn = document.getElementById('tf-btn-load');
      const originalContent = btn.innerHTML;
      btn.innerHTML = '<span>✅</span> Loaded!';
      setTimeout(() => { btn.innerHTML = originalContent; }, 2000);
    } catch(e) {
      console.error('ToolFin State: Failed to load state', e);
    }
  }

  function clearState() {
    if (confirm('Clear all inputs and saved data for this calculator?')) {
      localStorage.removeItem(getStorageKey());
      location.reload();
    }
  }

  function triggerCalculate() {
    // Try common calculate button IDs/classes
    const calcBtn = document.querySelector('#calculate-btn, #calculate, .calculate-btn, button[id*="calc"]');
    if (calcBtn) {
      calcBtn.click();
    }
  }

  // Use a slight delay to ensure other scripts (especially dynamic row builders) have a chance to start
  if (document.readyState === 'complete') {
    setTimeout(injectUI, 500);
  } else {
    window.addEventListener('load', () => setTimeout(injectUI, 500));
  }
})();
