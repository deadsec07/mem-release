document.addEventListener('DOMContentLoaded', () => {
  async function load() {
    const v = await chrome.storage.session.get("cfg");
    const c = v?.cfg || {};
    document.getElementById('enabled').checked = c.enabled ?? true;
    document.getElementById('grace').value = c.graceMs ?? 8000;
    document.getElementById('skipAudible').checked = c.skipAudible ?? true;
    document.getElementById('skipPinned').checked = c.skipPinned ?? true;
    document.getElementById('wl').value = (c.whitelist || []).join("\n");
  }

  document.getElementById('apply').addEventListener('click', () => {
    const payload = {
      enabled: document.getElementById('enabled').checked,
      graceMs: Math.max(0, Number(document.getElementById('grace').value) || 0),
      skipAudible: document.getElementById('skipAudible').checked,
      skipPinned: document.getElementById('skipPinned').checked,
      whitelist: document.getElementById('wl').value.split("\n").map(s => s.trim()).filter(Boolean)
    };
    chrome.runtime.sendMessage({ type: "updateCfg", payload });
    const btn = document.getElementById('apply');
    const t = btn.textContent; btn.textContent = "Saved ✓"; setTimeout(() => btn.textContent = t, 1200);
  });

  document.getElementById('now').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: "triggerNow" });
  });

  load();

  // Auto-flip tooltip if it would clip the popup edges
(function enableSmartTips(){
  const tips = Array.from(document.querySelectorAll('.tip'));
  tips.forEach(t => {
    t.addEventListener('mouseenter', () => {
      // show it virtually to measure
      t.dataset.side = ''; // reset
      const tip = t; const fake = document.createElement('div');
      fake.style.cssText = 'position:fixed;visibility:hidden;padding:8px 10px;max-width:240px';
      fake.textContent = tip.getAttribute('data-tip') || '';
      document.body.appendChild(fake);
      const r = tip.getBoundingClientRect();
      const popupW = document.documentElement.clientWidth;
      const estLeft = r.left + r.width/2 - fake.offsetWidth/2;
      const estRight = estLeft + fake.offsetWidth;

      if (estRight > popupW - 8)      tip.dataset.side = 'left';  // flip left
      else if (estLeft < 8)           tip.dataset.side = 'right'; // flip right
      else                            delete tip.dataset.side;

      fake.remove();
    });
    t.addEventListener('mouseleave', () => { /* keep side for consistency or reset */ });
  });
})();


});
document.addEventListener('DOMContentLoaded', () => {
  async function load() {
    const v = await chrome.storage.session.get("cfg");
    const c = v?.cfg || {};
    document.getElementById('enabled').checked = c.enabled ?? true;
    document.getElementById('grace').value = c.graceMs ?? 8000;
    document.getElementById('skipAudible').checked = c.skipAudible ?? true;
    document.getElementById('skipPinned').checked = c.skipPinned ?? true;
    document.getElementById('wl').value = (c.whitelist || []).join("\n");
  }

  document.getElementById('apply').addEventListener('click', () => {
    const payload = {
      enabled: document.getElementById('enabled').checked,
      graceMs: Math.max(0, Number(document.getElementById('grace').value) || 0),
      skipAudible: document.getElementById('skipAudible').checked,
      skipPinned: document.getElementById('skipPinned').checked,
      whitelist: document.getElementById('wl').value.split("\n").map(s => s.trim()).filter(Boolean)
    };
    chrome.runtime.sendMessage({ type: "updateCfg", payload });
    const btn = document.getElementById('apply');
    const t = btn.textContent; btn.textContent = "Saved ✓"; setTimeout(() => btn.textContent = t, 1200);
  });

  document.getElementById('now').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: "triggerNow" });
  });

  load();

 // --- Smart tooltips: avoid cutoff (top/left/right) ---
(function enableSmartTips(){
  const tips = Array.from(document.querySelectorAll('.tip'));
  tips.forEach(t => {
    t.addEventListener('mouseenter', () => {
      t.removeAttribute('data-side');
      t.removeAttribute('data-pos');

      // measure bubble size using temp element
      const fake = document.createElement('div');
      fake.style.cssText = 'position:fixed;visibility:hidden;padding:8px 10px;max-width:260px';
      fake.textContent = t.getAttribute('data-tip') || '';
      document.body.appendChild(fake);

      const r = t.getBoundingClientRect();
      const popupW = document.documentElement.clientWidth;
      const popupH = document.documentElement.clientHeight;
      const bw = fake.offsetWidth;
      const bh = fake.offsetHeight;
      fake.remove();

      // If showing ABOVE would clip out of the popup top, use SIDE placement
      const willClipTop = (r.top - 8 - bh) < 0;

      if (willClipTop) {
        t.dataset.pos = 'side'; // place left/right
        const spaceLeft  = r.left - 8;               // pixels available to the left edge
        const spaceRight = popupW - (r.right + 8);   // pixels to the right edge
        if (spaceLeft >= bw) {
          // left fits → default (CSS already uses left)
          t.dataset.side = ''; // ensure not "right"
        } else if (spaceRight >= bw) {
          // flip to right
          t.dataset.side = 'right';
        } else {
          // neither fully fits → pick wider side
          t.dataset.side = (spaceRight > spaceLeft) ? 'right' : '';
        }
        return;
      }

      // Otherwise keep ABOVE but still prevent horizontal overflow
      const estLeft = r.left + r.width/2 - bw/2;
      const estRight = estLeft + bw;
      if (estRight > popupW - 8)      t.dataset.side = 'left';
      else if (estLeft < 8)           t.dataset.side = 'right';
      else                            t.removeAttribute('data-side');
      t.removeAttribute('data-pos'); // ensure above mode
    });
  });
})();

});
