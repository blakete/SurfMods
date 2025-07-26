// background.js

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

            // If a mod for the site exists and is enabled
            if (site && site.enabled) {
                // Inject CSS
                if (site.css) {
                    chrome.scripting.insertCSS({
                        target: { tabId: tabId },
                        css: site.css
                    });
                }

                // // Inject JavaScript
                // if (site.js) {
                //     chrome.scripting.executeScript({
                //         target: { tabId: tabId },
                //         func: (jsCode) => {
                //             const script = document.createElement('script');
                //             script.textContent = jsCode;
                //             (document.head || document.documentElement).appendChild(script);
                //             script.remove();
                //         },
                //         args: [site.js],
                //         // world: 'MAIN' // Execute in the main world to interact with page scripts
                //     });
                // }

                // Inject JavaScript
                if (site.js) {
                    chrome.scripting.executeScript({
                        target: { tabId: tabId }, // Defaults to the secure, ISOLATED world
                        func: (userJs) => {
                            // This function runs in the isolated world.
                            // We use the Function constructor to execute the user's
                            // saved script string directly, without creating a <script> tag.
                            try {
                                new Function(userJs)();
                            } catch (e) {
                                console.error("ModKit: Error executing user script.", e);
                            }
                        },
                        args: [site.js] // Pass the user's script in as an argument.
                    });
                }
                
            }
        });
    }
});