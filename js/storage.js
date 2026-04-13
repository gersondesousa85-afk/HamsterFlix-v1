const get = (k, d) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; }
};
const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export const storage = {
  getLastServer: () => get('hf_last_server', null),
  setLastServer: (v) => set('hf_last_server', v),
  getFavorites: () => get('hf_fav', []),
  setFavorites: (v) => set('hf_fav', v),
  getHistory: () => get('hf_history', []),
  setHistory: (v) => set('hf_history', v),
  clearHistory: () => set('hf_history', []),
  getContinue: () => get('hf_continue', []),
  setContinue: (v) => set('hf_continue', v),
  getCache: (key) => get(`hf_cache_${key}`, null),
  setCache: (key, v) => set(`hf_cache_${key}`, v)
};
