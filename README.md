# ModKit  
**A simple, open source, web surfing mod kit** that allows you to **“surf the web your way 🌊🏄‍♂️🤙”**

**ModKit** is a no-nonsense, developer-focused, open source Chrome extension for customizing websites on the fly.

- Inject CSS to restyle layouts, use JavaScript to tweak behavior, or insert custom HTML — all scoped per site.
- Perfect for devs who want persistent control without bloated UIs.
- Inspired by Arc Browser’s *Boosts* feature, but with more transparency and tweakability.

---

## Key Features

- 🎯 **Per‑Site Modding**  
  Define and apply custom CSS, JS, or HTML on a per‑domain basis.
- 🧪 **Element Picker**  
  Visually select page elements to generate robust CSS selectors.
- 💾 **Persistent Rules**  
  All your mods are stored locally and synced across Chrome instances.
- 🚫 **Enable/Disable Controls**  
  Toggle mods globally or per‑site for instant on/off control.
- 🔧 **Dev‑Minded Design**  
  No abstractions—raw CSS/JS/HTML power for those who know their way around the DOM.

---

## Installation

1. **Clone or download** this repository.  
2. Open Chrome and navigate to `chrome://extensions/`.  
3. Toggle **Developer mode** ON.  
4. Click **Load unpacked** and select the `ModKit` directory.  
5. (Optional) Pin the ModKit icon to your toolbar for quick access.

> **Note:** Be sure to include a `128×128` PNG icon named `icon.png` in the root.

---

## Usage

1. Click the **ModKit** toolbar icon to open the popup.  
2. **Create a Rule**:  
   - **Domain**: `example.com`  
   - **CSS** (e.g.):  
     ```css
     body { font-size: 120%; }
     .sidebar { display: none; }
     ```  
   - **JS** (e.g.):  
     ```js
     document.body.insertAdjacentHTML(
       'afterbegin',
       '<header>Custom Header</header>'
     );
     ```  
3. Use the **Element Picker** to capture selectors directly from the page.  
4. **Toggle**, **edit**, or **delete** rules as needed.  
5. **Refresh** the page to see your changes in action.

---

## Development Notes

- **`manifest.json`** — Extension metadata & permissions  
- **`popup.html` / `popup.js`** — UI for rule management & picker activation  
- **`content.js`** — Injection engine & element‑picker overlay  
- **Security** — JS injection uses `eval()`, so keep usage local/personal.

---

## Contributing

Love it? Fork, tweak, and open a PR!  
Please keep changes modular, well‑documented, and aligned with the “no‑nonsense” ethos.

---

## License

This project is open source under the **MIT License**.  
See [LICENSE](LICENSE) for details.
