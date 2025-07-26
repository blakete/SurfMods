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
    alert(`Selector: ${selector}\nUse in your ModKit rules.`);
    stopPicker();
  }, { once: true });

  function stopPicker() {
    overlay.remove();
    document.removeEventListener('mousemove', updateOverlay);
  }
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