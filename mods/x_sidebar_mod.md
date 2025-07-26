site: x.com
mod-css:
```css
div#react-root > div.css-175oi2r.r-13awgt0.r-12vffkv > div.css-175oi2r.r-13awgt0.r-12vffkv > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz:nth-child(3) > header.css-175oi2r.r-lrvibr.r-1g40b8q.r-obd0qt.r-16y2uox > div.css-175oi2r.r-o96wvk > div.css-175oi2r.r-aqfbo4.r-1pi2tsx.r-1xcajam.r-ipm5af > div.css-175oi2r.r-1pi2tsx.r-1wtj0ep.r-1rnoaur.r-o96wvk.r-is05cd {
  width: 72px !important;  /* Collapsed width; adjust to 68px if too wide */
  overflow: hidden !important;  /* Prevent text spillover */
  transition: width 0.3s ease;  /* Smooth like native */
}

div#react-root > div.css-175oi2r.r-13awgt0.r-12vffkv > div.css-175oi2r.r-13awgt0.r-12vffkv > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz:nth-child(3) > header.css-175oi2r.r-lrvibr.r-1g40b8q.r-obd0qt.r-16y2uox > div.css-175oi2r.r-o96wvk > div.css-175oi2r.r-aqfbo4.r-1pi2tsx.r-1xcajam.r-ipm5af > div.css-175oi2r.r-1pi2tsx.r-1wtj0ep.r-1rnoaur.r-o96wvk.r-is05cd span {
  display: none !important;  /* Hide text labels */
}

div#react-root > div.css-175oi2r.r-13awgt0.r-12vffkv > div.css-175oi2r.r-13awgt0.r-12vffkv > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz:nth-child(3) > header.css-175oi2r.r-lrvibr.r-1g40b8q.r-obd0qt.r-16y2uox > div.css-175oi2r.r-o96wvk > div.css-175oi2r.r-aqfbo4.r-1pi2tsx.r-1xcajam.r-ipm5af > div.css-175oi2r.r-1pi2tsx.r-1wtj0ep.r-1rnoaur.r-o96wvk.r-is05cd > div > a > div {
  justify-content: center !important;  /* Center icons horizontally */
  padding: 0 !important;  /* Remove extra padding for neatness */
}

div#react-root > div.css-175oi2r.r-13awgt0.r-12vffkv > div.css-175oi2r.r-13awgt0.r-12vffkv > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz:nth-child(3) > header.css-175oi2r.r-lrvibr.r-1g40b8q.r-obd0qt.r-16y2uox > div.css-175oi2r.r-o96wvk > div.css-175oi2r.r-aqfbo4.r-1pi2tsx.r-1xcajam.r-ipm5af > div.css-175oi2r.r-1pi2tsx.r-1wtj0ep.r-1rnoaur.r-o96wvk.r-is05cd svg {
  margin: 0 auto !important;  /* Center icons if needed */
}
```
mod-js:
```javascript
(function() {
  const selector = '#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > header > div > div > div > div:nth-child(1) > div.css-175oi2r.r-15zivkp.r-1bymd8e.r-13qz1uu.r-1awozwy > nav';

  function collapseSidebar() {
    const sidebar = document.querySelector(selector);
    if (!sidebar) return;

    // Force collapsed width (override computed value)
    sidebar.style.width = '72px';
    sidebar.style.overflow = 'hidden';
    sidebar.style.transition = 'width 0.3s ease';

    // Hide text labels
    const texts = sidebar.querySelectorAll('span');
    texts.forEach(text => {
      text.style.display = 'none';
    });

    // Center menu items and icons
    const menuItems = sidebar.querySelectorAll('a > div, div[role="link"] > div');
    menuItems.forEach(item => {
      item.style.justifyContent = 'center';
      item.style.padding = '0';
      item.style.alignItems = 'center';
    });

    const icons = sidebar.querySelectorAll('svg');
    icons.forEach(icon => {
      icon.style.margin = '0 auto';
    });
  }

  // Run initially
  collapseSidebar();

  // Observe for React re-renders or DOM changes
  const observer = new MutationObserver(collapseSidebar);
  observer.observe(document.body, { childList: true, subtree: true });
})();
```


trying other selectors:
```css
div#react-root > div.css-175oi2r.r-13awgt0.r-12vffkv > div.css-175oi2r.r-13awgt0.r-12vffkv > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz:nth-child(3) > header.css-175oi2r.r-lrvibr.r-1g40b8q.r-obd0qt.r-16y2uox
```
/html/body/div[1]/div/div/div[2]/header/div
```css
#react-root > div > div > div.css-175oi2r.r-1f2l425.r-13qz1uu.r-417010.r-18u37iz > header > div > div > div > div:nth-child(1) > div.css-175oi2r.r-15zivkp.r-1bymd8e.r-13qz1uu.r-1awozwy > nav
```