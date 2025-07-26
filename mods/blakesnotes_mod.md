A mod for `blakesnotes.io` worked with the following custom JS content pasted into it:
```javascript
(function() {
  const selector = 'main.page-content > div.wrapper > article.post > div.post-content > div.wiki-list';

  function removeElement() {
    const element = document.querySelector(selector);
    if (element) {
      element.remove();
    }
  }

  setTimeout(removeElement, 1000);

  const observer = new MutationObserver(removeElement);
  observer.observe(document.body, { childList: true, subtree: true });
})();
```