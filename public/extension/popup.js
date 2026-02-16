const $ = (id) => document.getElementById(id);
const show = (msg) => { const el = $('result'); if (el) el.textContent = msg };

async function getActiveTabId() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0]?.id;
}

$('btn-save-api')?.addEventListener('click', async () => {});

async function getConfig() {
  const data = await chrome.storage.local.get(['plugin.api.base', 'plugin.api.token', 'plugin.templateId']);
  return {
    base: data['plugin.api.base'] || '/api',
    token: data['plugin.api.token'] || '',
    templateId: data['plugin.templateId'] || '',
  };
}

async function initDefaultsFromPackage() {
  const existing = await chrome.storage.local.get(['plugin.api.base', 'plugin.api.token', 'plugin.templateId']);
  const hasBase = !!existing['plugin.api.base'];
  const hasToken = !!existing['plugin.api.token'];
  const hasTpl = !!existing['plugin.templateId'];
  if (hasBase && hasTpl) return;
  try {
    const url = chrome.runtime.getURL('config.json');
    const resp = await fetch(url);
    if (!resp.ok) return;
    const cfg = await resp.json();
    const payload = {};
    if (!hasBase && cfg.apiBase) payload['plugin.api.base'] = cfg.apiBase;
    if (!hasToken && cfg.apiToken) payload['plugin.api.token'] = cfg.apiToken;
    if (!hasTpl && cfg.templateDefaultId) payload['plugin.templateId'] = cfg.templateDefaultId;
    if (Object.keys(payload).length > 0) await chrome.storage.local.set(payload);
  } catch {}
}

initDefaultsFromPackage();

$('btn-extract-open').addEventListener('click', async () => {
  try {
    const tabId = await getActiveTabId();
    if (!tabId) return show('未找到活动标签页');
    const resp = await chrome.tabs.sendMessage(tabId, { type: 'resumeai_extract' });
    if (!resp?.ok) return show('提取失败：' + (resp?.error || '未知错误'));
    const templateId = $('tpl-select')?.value || (await getConfig()).templateId;
    await chrome.runtime.sendMessage({ type: 'resumeai_open_editor', payload: resp.data, templateId });
    show('已打开编辑器并注入数据');
  } catch (e) {
    show('执行失败：' + String(e));
  }
});

$('btn-open-editor').addEventListener('click', async () => {
  try {
    const templateId = $('tpl-select')?.value || (await getConfig()).templateId;
    await chrome.runtime.sendMessage({ type: 'resumeai_open_editor', payload: null, templateId });
    show('已打开编辑器');
  } catch (e) {
    show('打开失败：' + String(e));
  }
});

$('btn-extract').addEventListener('click', async () => {
  try {
    const tabId = await getActiveTabId();
    if (!tabId) return show('未找到活动标签页');
    const resp = await chrome.tabs.sendMessage(tabId, { type: 'resumeai_extract' });
    if (!resp?.ok) return show('提取失败：' + (resp?.error || '未知错误'));
    await chrome.storage.local.set({ resumeai_last_extract: resp.data });
    show('已提取并保存到本地');
  } catch (e) {
    show('执行失败：' + String(e));
  }
});

async function getLastExtractOrFetch() {
  const saved = await chrome.storage.local.get('resumeai_last_extract');
  if (saved?.resumeai_last_extract) return saved.resumeai_last_extract;
  const tabId = await getActiveTabId();
  const resp = await chrome.tabs.sendMessage(tabId, { type: 'resumeai_extract' });
  return resp?.data;
}

$('btn-save-api')?.addEventListener('click', async () => {
  const base = $('api-base')?.value?.trim() || '';
  const token = $('api-token')?.value?.trim() || '';
  await chrome.storage.local.set({ 'plugin.api.base': base, 'plugin.api.token': token, 'plugin.templateId': $('tpl-select')?.value || '' });
  show('已保存 API 配置与模板ID');
});

async function callBackend(path, payload) {
  const cfg = await getConfig();
  const url = (cfg.base || '/api').replace(/\/$/, '') + path;
  const headers = { 'Content-Type': 'application/json' };
  if (cfg.token) headers['Authorization'] = `Bearer ${cfg.token}`;
  const resp = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) });
  if (!resp.ok) throw new Error('后端接口调用失败');
  return resp.json();
}

$('btn-ats')?.addEventListener('click', async () => {
  try {
    const data = await getLastExtractOrFetch();
    if (!data) return show('没有可用的提取数据');
    const payload = { resume: data, jobDescription: data?.experience?.[0]?.description || '' };
    const result = await callBackend('/ats-score', payload);
    const score = result?.score ?? result?.data?.score;
    show(`ATS 匹配评分：${score}`);
  } catch (e) {
    show('ATS 评分失败：' + String(e));
  }
});

$('btn-cover')?.addEventListener('click', async () => {
  try {
    const data = await getLastExtractOrFetch();
    if (!data) return show('没有可用的提取数据');
    const payload = { resume: data, jobDescription: data?.experience?.[0]?.description || '' };
    const result = await callBackend('/generate-cover-letter', payload);
    const text = result?.text ?? result?.data?.text ?? '生成失败';
    const html = `
      <!doctype html><meta charset="utf-8" />
      <title>AI Cover Letter</title>
      <pre style="white-space:pre-wrap;word-wrap:break-word;font-family:Inter,system-ui;">${text.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</pre>
    `;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    await chrome.tabs.create({ url, active: true });
    show('已打开 AI 求职信');
  } catch (e) {
    show('求职信生成失败：' + String(e));
  }
});
