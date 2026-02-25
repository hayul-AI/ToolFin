// assets/tf-state.js
(function() {
  function injectUI() {
    const main = document.querySelector('main');
    if (!main) return;
    
    // Only inject if it looks like a calculator page
    const hasInputs = document.querySelector('.calc-grid') || document.querySelector('#inputs') || document.querySelector('#calculator-area') || document.querySelector('.calculator-row') || document.querySelector('.debt-row');
    if (!hasInputs) return;
    
    // Create UI container
    const uiContainer = document.createElement('div');
    uiContainer.className = 'tf-state-actions';
    uiContainer.style.display = 'flex';
    uiContainer.style.flexWrap = 'wrap';
    uiContainer.style.gap = '10px';
    uiContainer.style.marginTop = '20px';
    uiContainer.style.marginBottom = '20px';
    uiContainer.style.justifyContent = 'flex-end';
    
    uiContainer.innerHTML = `
      <button id="tf-btn-save" style="background: var(--bg-card); border: 1px solid var(--border); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; color: var(--text-main); transition: all 0.2s; box-shadow: var(--shadow-sm);">💾 Save</button>
      <button id="tf-btn-load" style="background: var(--bg-card); border: 1px solid var(--border); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; color: var(--text-main); transition: all 0.2s; box-shadow: var(--shadow-sm);">📂 Load</button>
      <button id="tf-btn-clear" style="background: var(--bg-card); border: 1px solid var(--border); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; color: #e11d48; transition: all 0.2s; box-shadow: var(--shadow-sm);">🗑️ Clear</button>
      <button id="tf-btn-export" style="background: var(--primary); border: 1px solid var(--primary-dark); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; color: white; transition: all 0.2s; box-shadow: var(--shadow-sm);">📄 Export PDF</button>
    `;
    
    // Insert before the calculator card or inside main
    const hero = document.querySelector('.hero');
    const noticeBox = document.querySelector('.notice-box');
    
    if (noticeBox && noticeBox.nextElementSibling) {
      noticeBox.parentNode.insertBefore(uiContainer, noticeBox.nextElementSibling);
    } else if (hero && hero.nextElementSibling) {
      hero.parentNode.insertBefore(uiContainer, hero.nextElementSibling);
    } else {
      main.prepend(uiContainer);
    }

    document.getElementById('tf-btn-save').addEventListener('click', saveState);
    document.getElementById('tf-btn-load').addEventListener('click', loadState);
    document.getElementById('tf-btn-clear').addEventListener('click', clearState);
    if(window.exportToPDF) {
       document.getElementById('tf-btn-export').addEventListener('click', window.exportToPDF);
    } else {
       // Bind directly if loaded late
       document.getElementById('tf-btn-export').addEventListener('click', () => {
           if(window.exportToPDF) window.exportToPDF();
       });
    }
  }

  function getStorageKey() {
    return 'tf_state_' + window.location.pathname;
  }

  function getInputs() {
    // Collect inputs within main, exclude buttons
    const inputs = document.querySelectorAll('main input, main select, main textarea');
    return Array.from(inputs).filter(i => i.id && i.type !== 'button' && i.type !== 'submit');
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
    
    // Special handling for dynamic rows (e.g., debt avalanche, net worth)
    // To keep it generic, we could just rely on saving input states, 
    // but dynamic DOM elements might not exist on reload.
    // For a generic solution, we save what exists. 
    localStorage.setItem(getStorageKey(), JSON.stringify(state));
    
    const btn = document.getElementById('tf-btn-save');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅ Saved!';
    setTimeout(() => { btn.innerHTML = originalText; }, 2000);
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
          // trigger events
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      triggerCalculate();
    } catch(e) {
      console.error('Failed to load state', e);
    }
  }

  function clearState() {
    if (confirm('Are you sure you want to clear saved data and reset the calculator?')) {
      localStorage.removeItem(getStorageKey());
      location.reload();
    }
  }

  function triggerCalculate() {
    // Try to find and click the calculate button
    const calcBtn = document.querySelector('button[id*="calculate"], button[id*="calc"]');
    if (calcBtn) {
      calcBtn.click();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectUI);
  } else {
    injectUI();
  }
})();
