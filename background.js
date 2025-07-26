// A safe, pre-defined function that performs DOM manipulation.
// This function will be injected onto the page.
function performMod(action, selector, value) {
    const observer = new MutationObserver(() => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            elements.forEach(el => {
                switch (action) {
                    case 'remove':
                        el.remove();
                        break;
                    case 'hide':
                        el.style.display = 'none';
                        break;
                    case 'addClass':
                        if (value) el.classList.add(value);
                        break;
                }
            });
            // Optional: Disconnect after first success if the element doesn't reappear.
            // observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Listen for when a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        const url = new URL(tab.url);
        const hostname = url.hostname;

        chrome.storage.sync.get(['sites', 'globalEnabled'], data => {
            if (data.globalEnabled === false) return;

            const sites = data.sites || {};
            const site = sites[hostname];

            if (site && site.enabled) {
                // CSS injection remains the same
                if (site.css) {
                    chrome.scripting.insertCSS({
                        target: { tabId: tabId },
                        css: site.css
                    });
                }

                // JS logic now uses the safe, pre-defined function
                if (site.action && site.selector) {
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        func: performMod,
                        args: [site.action, site.selector, site.value]
                    });
                }
            }
        });
    }
});