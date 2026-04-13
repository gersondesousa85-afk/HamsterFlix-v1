export const debounce = (fn, delay = 300) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

export const sanitize = (v = '') => String(v).replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c]));

export const normId = (item = {}) => {
  const raw = item.stream_id || item.series_id || item.id || `${item.name || item.title || ''}-${item.type || ''}`;
  return String(raw).toLowerCase().replace(/\s+/g, '-');
};

export const by = (sel) => document.querySelector(sel);
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
