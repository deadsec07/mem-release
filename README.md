
## Permissions
- **tabs** – to list/discard tabs and read minimal tab metadata (pinned/audible/URL host)
- **storage** – to save settings locally  
_No host permissions. No content scripts. No remote code._

## Usage
- Click the toolbar icon → set **Grace (ms)**, toggle **Skip audible/pinned**, add **Whitelist hosts** (one per line).
- Click **Release Memory Now** to discard background tabs immediately.
- Recommended grace: **6000 ms** (6s). Lower = more aggressive; higher = gentler.

## How it Works
On tab change/focus, a timer runs (grace). When it fires:
- Every other tab in the **current window** is discarded via `chrome.tabs.discard()`
- Pinned/audible/whitelisted tabs are skipped
- Discarded tabs reload when you visit them

## Packaging for Chrome Web Store
- Create a ZIP of the project root (include `manifest.json`, code, and `icons/`)
- **Screenshots / Promo (optional but recommended):**
  - 1280×800 or 640×400 screenshots (JPEG/PNG, no alpha)
  - Small promo: 440×280 (PNG/JPEG)
  - Marquee promo: 1400×560 (PNG/JPEG)

## Store Listing – Short Copy
> **Memory Releaser keeps Chrome fast by unloading background tabs and keeping only the active tab in memory.**  
> Set a small delay, skip pinned/audible tabs, and whitelist important sites. Click “Release Memory Now” anytime.

**Single purpose:** memory relief by discarding background tabs.

## Privacy
- No analytics or tracking  
- No remote code  
- All settings stored locally via `chrome.storage.session`/`storage`

## FAQ
**Q: Will I lose my tabs?**  
No. Discarded tabs stay in the strip and reload when clicked.

**Q: Does it read page content?**  
No. It only checks tab state (pinned/audible) and hostname for whitelist matching.

**Q: Incognito?**  
Yes—enable **Allow in incognito** in the extension Details.

## Development
- Edit and reload the unpacked extension from `chrome://extensions`
- No build step required (plain MV3)

## License
See [LICENSE](./LICENSE)

---

Made with care — [hnetechnologies.com](https://hnetechnologies.com)
