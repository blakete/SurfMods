document.addEventListener('DOMContentLoaded', () => {
  // --- Get Elements ---
  const globalEnabled = document.getElementById('globalEnabled');
  const siteList = document.getElementById('siteList');
  const siteUrl = document.getElementById('siteUrl');
  const cssInput = document.getElementById('cssInput');
  const modAction = document.getElementById('modAction');
  const modSelector = document.getElementById('modSelector');
  const modValue = document.getElementById('modValue');
  const saveBtn = document.getElementById('saveBtn');
  const deleteBtn = document.getElementById('deleteBtn');

  // --- Functions ---
  function refreshList(sites) {
    siteList.innerHTML = '';
    Object.keys(sites).forEach(key => {
      const li = document.createElement('li');
      const site = sites[key];
      li.textContent = `${key} (${site.action}: ${site.selector})`;
      li.style.cursor = 'pointer';

      li.addEventListener('click', () => {
        siteUrl.value = key;
        cssInput.value = site.css || '';
        modAction.value = site.action || 'remove';
        modSelector.value = site.selector || '';
        modValue.value = site.value || '';
      });
      siteList.appendChild(li);
    });
  }

  function clearInputs() {
    siteUrl.value = '';
    cssInput.value = '';
    modAction.value = 'remove';
    modSelector.value = '';
    modValue.value = '';
  }

  // --- Event Listeners ---
  loadSites(sites => {
    refreshList(sites);
    chrome.storage.sync.get('globalEnabled', data => {
      globalEnabled.checked = data.globalEnabled !== false;
    });
  });

  // UPDATED globalEnabled listener
  globalEnabled.addEventListener('change', () => {
    const isEnabled = globalEnabled.checked;
    // 1. Save the new state to storage.
    chrome.storage.sync.set({ globalEnabled: isEnabled }, () => {
      // 2. Find the active tab.
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          // 3. Reload the tab to apply or remove the mods.
          chrome.tabs.reload(tabs[0].id);
        }
      });
    });
  });

  saveBtn.addEventListener('click', () => {
    if (!siteUrl.value || !modSelector.value) {
      alert('Domain and CSS Selector are required.');
      return;
    }
    loadSites(sites => {
      sites[siteUrl.value] = {
        enabled: true,
        css: cssInput.value,
        action: modAction.value,
        selector: modSelector.value,
        value: modValue.value
      };
      saveSites(sites);
      refreshList(sites);
    });
  });

  deleteBtn.addEventListener('click', () => {
    if (!siteUrl.value) return;
    loadSites(sites => {
      delete sites[siteUrl.value];
      saveSites(sites);
      refreshList(sites);
      clearInputs();
    });
  });
});

// --- Helper Functions ---
function saveSites(sites) {
  chrome.storage.sync.set({ sites });
}

function loadSites(callback) {
  chrome.storage.sync.get('sites', data => callback(data.sites || {}));
}