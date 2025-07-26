// content.js (updated for selectable popup with X close button and Esc support)

chrome.storage.sync.get(['sites', 'globalEnabled'], data => {
  if (data.globalEnabled === false) return;
  const sites = data.sites || {};
  const hostname = window.location.hostname;
  const site = sites[hostname];
  if (!site || !site.enabled) return;

  if (site.css) {
    const style = document.createElement('style');
    style.textContent = site.css;
    document.head.appendChild(style);
  }

  if (site.js) {
    try {
      eval(site.js);
    } catch (e) {
      console.error('ModKit JS error:', e);
    }
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'startPicker') {
    startElementPicker();
    sendResponse({ status: 'picker started' });
  }
});

function startElementPicker() {
  let overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.background = 'rgba(255,0,0,0.3)';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '9998';  // Below the custom popup
  document.body.appendChild(overlay);

  function updateOverlay(el) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    overlay.style.top = `${rect.top + window.scrollY}px`;
    overlay.style.left = `${rect.left + window.scrollX}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
  }

  document.addEventListener('mousemove', e => updateOverlay(e.target));

  document.addEventListener('click', e => {
    e.preventDefault();
    const selector = generateRobustSelector(e.target);
    showSelectablePopup(selector);
    stopPicker();
  }, { once: true });

  function stopPicker() {
    overlay.remove();
    document.removeEventListener('mousemove', updateOverlay);
  }
}

function showSelectablePopup(selector) {
  // Create custom popup div
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.backgroundColor = 'white';
  popup.style.border = '1px solid black';
  popup.style.padding = '0';  // No padding on main div for header separation
  popup.style.zIndex = '9999';
  popup.style.maxWidth = '80%';
  popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  popup.style.userSelect = 'text';  // Ensure text is selectable
  popup.style.cursor = 'text';

  // Add top bar header
  const header = document.createElement('div');
  header.style.backgroundColor = '#f0f0f0';  // Light gray for contrast
  header.style.padding = '10px';
  header.style.borderBottom = '1px solid #ccc';
  header.style.fontWeight = 'bold';
  header.style.color = 'black';  // Header text color
  header.style.position = 'relative';  // For positioning the X button
  header.textContent = 'ModKit Extension';
  popup.appendChild(header);

  // Add X close button in header
  const xCloseBtn = document.createElement('button');
  xCloseBtn.textContent = '×';
  xCloseBtn.style.position = 'absolute';
  xCloseBtn.style.right = '10px';
  xCloseBtn.style.top = '50%';
  xCloseBtn.style.transform = 'translateY(-50%)';
  xCloseBtn.style.background = 'none';
  xCloseBtn.style.border = 'none';
  xCloseBtn.style.fontSize = '20px';
  xCloseBtn.style.cursor = 'pointer';
  xCloseBtn.style.color = 'black';
  xCloseBtn.addEventListener('click', () => closePopup());
  header.appendChild(xCloseBtn);

  // Add content container
  const contentContainer = document.createElement('div');
  contentContainer.style.padding = '20px';
  popup.appendChild(contentContainer);

  // Add content
  const content = document.createElement('p');
  content.textContent = `Selector: ${selector}\nUse in your ModKit rules.`;
  content.style.whiteSpace = 'pre-wrap';  // Preserve newlines and wrap
  content.style.color = 'black';  // Explicit black text on white background
  content.style.margin = '0';
  contentContainer.appendChild(content);

  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.style.marginTop = '10px';
  closeBtn.style.marginRight = '10px';
  closeBtn.addEventListener('click', () => closePopup());
  contentContainer.appendChild(closeBtn);

  // Add copy button
  const copyBtn = document.createElement('button');
  copyBtn.textContent = 'Copy Selector';
  copyBtn.style.marginTop = '10px';
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(selector).then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => copyBtn.textContent = 'Copy Selector', 2000);
    });
  });
  contentContainer.appendChild(copyBtn);

  // Add Esc key listener
  const escListener = (e) => {
    if (e.key === 'Escape' || e.keyCode === 27) {
      closePopup();
    }
  };
  document.addEventListener('keydown', escListener);

  // Cleanup function
  function closePopup() {
    popup.remove();
    document.removeEventListener('keydown', escListener);
  }

  document.body.appendChild(popup);
}

function generateRobustSelector(el) {
  if (!el || el === document.body) return 'body';
  let path = [];
  while (el && el !== document.body) {
    let sel = el.tagName.toLowerCase();
    if (el.id) {
      sel += `#${el.id}`;
      path.unshift(sel);
      break;
    }
    if (el.className) sel += `.${el.className.trim().replace(/\s+/g, '.')}`;
    const siblings = Array.from(el.parentNode.children);
    const index = siblings.indexOf(el) + 1;
    if (siblings.filter(sib => sib.tagName === el.tagName).length > 1) {
      sel += `:nth-child(${index})`;
    }
    path.unshift(sel);
    el = el.parentNode;
  }
  return path.join(' > ');
}