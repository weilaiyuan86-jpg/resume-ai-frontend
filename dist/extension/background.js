// Open ResumeEditor and inject extracted data
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg?.type === 'resumeai_open_editor') {
    try {
      const targetUrl = buildEditorUrl(msg);
      const tab = await chrome.tabs.create({ url: targetUrl, active: true });
      await waitForTabLoad(tab.id);
      await chrome.tabs.sendMessage(tab.id, { type: 'resumeai_inject', payload: msg.payload });
      sendResponse({ ok: true });
    } catch (e) {
      sendResponse({ ok: false, error: String(e) });
    }
    return true;
  }
});

function buildEditorUrl(msg) {
  const base = msg?.url || 'http://localhost:5175/resume-editor';
  const params = new URLSearchParams();
  if (msg?.templateId) params.set('template', String(msg.templateId));
  const url = params.toString() ? `${base}?${params.toString()}` : base;
  return url;
}

async function getAppUrl(pathname) {
  // Prefer local dev
  const local = 'http://localhost:5175' + pathname;
  return local;
}

function waitForTabLoad(tabId) {
  return new Promise((resolve) => {
    const listener = (updatedTabId, info) => {
      if (updatedTabId === tabId && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve(true);
      }
    };
    chrome.tabs.onUpdated.addListener(listener);
  });
}
