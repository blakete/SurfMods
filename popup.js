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
      const site = sites[key];
      const li = document.createElement('li');

      // 1. Create the toggle checkbox for the individual mod
      const toggleCheckbox = document.createElement('input');
      toggleCheckbox.type = 'checkbox';
      toggleCheckbox.checked = site.enabled;
      toggleCheckbox.title = `Enable/Disable mod for ${key}`;

      // 2. Add a listener to handle the toggle action
      toggleCheckbox.addEventListener('change', () => {
        sites[key].enabled = toggleCheckbox.checked;
        saveSites(sites);
        // Reload the page to apply the change instantly
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0] && tabs[0].id) {
            chrome.tabs.reload(tabs[0].id);
          }
        });
      });

      // 3. Create a label for the site name that can still be clicked
      const siteNameLabel = document.createElement('label');
      siteNameLabel.textContent = key;
      siteNameLabel.style.cursor = 'pointer';
      siteNameLabel.style.marginLeft = '4px';

      // When the site name is clicked, it still populates the form
      siteNameLabel.addEventListener('click', () => {
        siteUrl.value = key;
        cssInput.value = site.css || '';
        modAction.value = site.action || 'remove';
        modSelector.value = site.selector || '';
        modValue.value = site.value || '';
      });

      // 4. Append the checkbox and label to the list item
      li.appendChild(toggleCheckbox);
      li.appendChild(siteNameLabel);
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

  // --- Event Listeners (No changes below this line) ---
  loadSites(sites => {
    refreshList(sites);
    chrome.storage.sync.get('globalEnabled', data => {
      globalEnabled.checked = data.globalEnabled !== false;
    });
  });

  globalEnabled.addEventListener('change', () => {
    const isEnabled = globalEnabled.checked;
    chrome.storage.sync.set({ globalEnabled: isEnabled }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
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
      const existingMod = sites[siteUrl.value];
      sites[siteUrl.value] = {
        // Preserve existing enabled state on save, or default to true for new mods
        enabled: existingMod ? existingMod.enabled : true,
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