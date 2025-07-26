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
  const activatePicker = document.getElementById('activatePicker');

  // --- Functions ---
  function refreshList(sites) {
    siteList.innerHTML = '';
    Object.keys(sites).forEach(key => {
      const site = sites[key];
      const li = document.createElement('li');

      const toggleCheckbox = document.createElement('input');
      toggleCheckbox.type = 'checkbox';
      toggleCheckbox.checked = site.enabled;
      toggleCheckbox.title = `Enable/Disable mod for ${key}`;

      toggleCheckbox.addEventListener('change', () => {
        sites[key].enabled = toggleCheckbox.checked;
        saveSites(sites);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0] && tabs[0].id) {
            chrome.tabs.reload(tabs[0].id);
          }
        });
      });

      const siteNameLabel = document.createElement('label');
      siteNameLabel.textContent = key;
      siteNameLabel.style.cursor = 'pointer';
      siteNameLabel.style.marginLeft = '4px';

      siteNameLabel.addEventListener('click', () => {
        siteUrl.value = key;
        cssInput.value = site.css || '';
        modAction.value = site.action || 'remove';
        modSelector.value = site.selector || '';
        modValue.value = site.value || '';
      });

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

  // --- Event Listeners ---
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

  activatePicker.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0] && tabs[0].id && !tabs[0].url.startsWith('chrome://')) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'startPicker' });
        window.close(); // Close the popup to get it out of the way
      } else {
        alert('Element picker cannot be used on this page.');
      }
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