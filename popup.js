document.addEventListener('DOMContentLoaded', () => {
  // --- Get Elements ---
  // Get all the elements from the NEW popup.html
  const globalEnabled = document.getElementById('globalEnabled');
  const siteList = document.getElementById('siteList');
  const siteUrl = document.getElementById('siteUrl');
  const cssInput = document.getElementById('cssInput');
  const modAction = document.getElementById('modAction');
  const modSelector = document.getElementById('modSelector');
  const modValue = document.getElementById('modValue');
  const saveBtn = document.getElementById('saveBtn');
  const deleteBtn = document.getElementById('deleteBtn');

  // Note: The activatePicker button was removed from the last HTML proposal
  // to make room for the new UI, but if you've added it back, its logic remains the same.

  // --- Functions ---
  function refreshList(sites) {
    siteList.innerHTML = '';
    Object.keys(sites).forEach(key => {
      const li = document.createElement('li');
      const site = sites[key];
      // Display more useful info about the mod in the list
      li.textContent = `${key} (${site.action}: ${site.selector})`;
      li.style.cursor = 'pointer';

      // When a saved mod is clicked, populate the form
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

  globalEnabled.addEventListener('change', () => {
    chrome.storage.sync.set({ globalEnabled: globalEnabled.checked });
  });

  saveBtn.addEventListener('click', () => {
    if (!siteUrl.value || !modSelector.value) {
      // Require a domain and selector to save
      alert('Domain and CSS Selector are required.');
      return;
    }
    loadSites(sites => {
      // Save the new structured mod data
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