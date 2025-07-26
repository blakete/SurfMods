// background.js

// Function to remove the x.com sidebar
function removeXSideNav() {
    const anchorSelector = '[data-testid="SideNav_NewTweet_Button"]';
    const containerSelector = 'header';

    function findAndRemove() {
        const anchorElement = document.querySelector(anchorSelector);
        if (anchorElement) {
            const sideNavContainer = anchorElement.closest(containerSelector);
            if (sideNavContainer) {
                sideNavContainer.remove();
                // Disconnect the observer once the job is done to save resources.
                observer.disconnect();
            }
        }
    }

    const observer = new MutationObserver(findAndRemove);
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(findAndRemove, 500);
}

// Listen for when a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Check if the tab is fully loaded and has a URL
    if (changeInfo.status === 'complete' && tab.url) {
        const url = new URL(tab.url);
        const hostname = url.hostname;

        // Check if mods are globally enabled
        chrome.storage.sync.get(['sites', 'globalEnabled'], data => {
            if (data.globalEnabled === false) return;

            const sites = data.sites || {};
            const site = sites[hostname];

            // If a rule for the site exists and is enabled
            if (site && site.enabled) {
                // Inject CSS (this is still safe and generic)
                if (site.css) {
                    chrome.scripting.insertCSS({
                        target: { tabId: tabId },
                        css: site.css
                    });
                }

                // --- JavaScript Injection Logic ---
                // Instead of running arbitrary code, check the hostname
                // and run a specific, pre-defined function.
                if (hostname === 'x.com') {
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        func: removeXSideNav // Execute the pre-defined function
                    });
                }
                // To add another mod, you would add:
                // else if (hostname === 'some-other-site.com') { ... }
            }
        });
    }
});