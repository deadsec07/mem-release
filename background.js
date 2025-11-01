// Config (can be changed in popup)
const DEFAULTS = {
  enabled: true,
  graceMs: 8000,            // wait after switching before discarding others
  skipAudible: true,
  skipPinned: true,
  whitelist: []             // hostnames never discarded (e.g., ["meet.google.com"])
};

let cfg = { ...DEFAULTS };
let timer = null;

// Load config
chrome.storage.session.get("cfg").then(v => { if (v?.cfg) cfg = { ...DEFAULTS, ...v.cfg }; });

// Helper: is host whitelisted?
function isWhitelisted(url) {
  try {
    const h = new URL(url).hostname;
    return cfg.whitelist.some(w => h === w || h.endsWith("." + w));
  } catch { return false; }
}

async function discardOthers(windowId, activeTabId) {
  if (!cfg.enabled) return;

  const tabs = await chrome.tabs.query({ windowId });
  const tasks = tabs.map(async t => {
    if (t.id === activeTabId) return;
    if (cfg.skipPinned && t.pinned) return;
    if (cfg.skipAudible && t.audible) return;
    if (t.discarded) return;
    if (isWhitelisted(t.url || "")) return;

    try {
      if (t.autoDiscardable === false) {
        await chrome.tabs.update(t.id, { autoDiscardable: true });
      }
      await chrome.tabs.discard(t.id);
    } catch (_) {}
  });
  await Promise.all(tasks);
}

function schedule(windowId, tabId) {
  if (!cfg.enabled) return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => discardOthers(windowId, tabId), cfg.graceMs);
}

// On active tab change → discard others after grace
chrome.tabs.onActivated.addListener(({ tabId, windowId }) => schedule(windowId, tabId));

// On window focus change → re-enforce
chrome.windows.onFocusChanged.addListener(async (winId) => {
  if (winId === chrome.windows.WINDOW_ID_NONE) return;
  try {
    const [t] = await chrome.tabs.query({ active: true, windowId: winId });
    if (t) schedule(winId, t.id);
  } catch {}
});

// Popup -> background updates
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "updateCfg") {
    cfg = { ...cfg, ...msg.payload };
    chrome.storage.session.set({ cfg });
  } else if (msg?.type === "triggerNow") {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([t]) => {
      if (t) discardOthers(t.windowId, t.id);
    });
  }
});
