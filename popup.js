document.addEventListener('DOMContentLoaded', () => {
  const globalEnabled = document.getElementById('globalEnabled');
  const siteList = document.getElementById('siteList');
  const siteUrl = document.getElementById('siteUrl');
  const cssInput = document.getElementById('cssInput');
  const jsInput = document.getElementById('jsInput');
  const saveBtn = document.getElementById('saveBtn');
  const deleteBtn = document.getElementById('deleteBtn');
  const activatePicker = document.getElementById('activatePicker');

  function refreshList(sites) {
    siteList.innerHTML = '';
    Object.keys(sites).forEach(key => {
      const li = document.createElement('li');
      li.textContent = `${key} (Enabled: ${sites[key].enabled})`;
      li.addEventListener('click', () => {
        siteUrl.value = key;
        cssInput.value = sites[key].css || '';
        jsInput.value = sites[key].js || '';
      });
      siteList.appendChild(li);
    });
  }

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
    if (!siteUrl.value) return;
    loadSites(sites => {
      sites[siteUrl.value] = {
        enabled: true,
        css: cssInput.value,
        js: jsInput.value
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
      siteUrl.value = cssInput.value = jsInput.value = '';
    });
  });

  activatePicker.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'startPicker' });
    });
  });
});

function saveSites(sites) {
  chrome.storage.sync.set({ sites });
}

function loadSites(callback) {
  chrome.storage.sync.get('sites', data => callback(data.sites || {}));
}